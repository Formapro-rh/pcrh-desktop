const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');
const { z } = require('zod');
const { zodOutputFormat } = require('@anthropic-ai/sdk/helpers/zod');
const {
  Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell,
  TextRun, WidthType, AlignmentType, BorderStyle, ImageRun,
} = require('docx');
const XLSX = require('xlsx');
const { autoUpdater } = require('electron-updater');
const archiver = require('archiver');

const CONFIG_FILE = 'espace.json';
const DATA_FILE = 'audits.json';
const GRID_OVERRIDES_FILE = 'grille-personnalisee.json';
const BACKUP_DIR_NAME = 'sauvegardes';
const BACKUP_RETENTION_DAYS = 30;
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

/** In-memory session state, held ONLY in the trusted main process.
 *  The renderer never sets this directly — it is only ever set by a
 *  successful space:create / space:unlock call, and cleared on space:lock.
 *  `key` is the AES-256 key used to encrypt audits.json at rest, derived
 *  from the access code — never written to disk, never sent to the
 *  renderer, and lost the moment the space is locked. */
let session = { folder: null, identifiant: null, key: null };

let mainWindow;

/* ---------------- settings (last used folder, for convenience) ---------------- */
function readSettings() {
  try { return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')); }
  catch (e) { return {}; }
}
function writeSettings(patch) {
  const current = readSettings();
  const next = Object.assign({}, current, patch);
  try { fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true }); } catch (e) {}
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), 'utf8');
}

/* ---------------- crypto helpers ---------------- */
function hashCode(code, salt) {
  return crypto.scryptSync(String(code), salt, 64).toString('hex');
}
function makeCredential(code) {
  const salt = crypto.randomBytes(16).toString('hex');
  return { salt, hash: hashCode(code, salt) };
}
function verifyCode(code, salt, hash) {
  const candidate = hashCode(code, salt);
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/* ---------------- encryption at rest ----------------
 * audits.json (and, transitively, its backups) is encrypted with AES-256-GCM
 * using a key derived from the access code via scrypt — a *different* salt
 * than the one used for the login hash, kept in espace.json (a salt is safe
 * to store openly; without the actual code, the key can't be re-derived).
 * The key lives only in `session.key`, in this process's memory. Without it
 * (space locked, or the file opened outside the app), the file is opaque
 * ciphertext — someone with direct access to the shared folder can no
 * longer just read audits.json in a text editor. */
function deriveEncryptionKey(code, encSalt) {
  return crypto.scryptSync(String(code), encSalt, 32);
}
function encryptJSON(obj, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(obj), 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({ enc: 1, iv: iv.toString('hex'), tag: tag.toString('hex'), data: enc.toString('hex') });
}
function decryptJSON(raw, key) {
  const envelope = JSON.parse(raw);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(envelope.tag, 'hex'));
  const dec = Buffer.concat([decipher.update(Buffer.from(envelope.data, 'hex')), decipher.final()]);
  return JSON.parse(dec.toString('utf8'));
}

/* ---------------- file helpers ---------------- */
function configPath(folder) { return path.join(folder, CONFIG_FILE); }
function dataPath(folder) { return path.join(folder, DATA_FILE); }
function gridOverridesPath(folder) { return path.join(folder, GRID_OVERRIDES_FILE); }

/* ---------------- logo du cabinet ---------------- */
const LOGO_EXT_RE = /^logo\.(png|jpe?g|gif)$/i;
async function findLogoFile(folder) {
  try {
    const files = await fsp.readdir(folder);
    const found = files.find(f => LOGO_EXT_RE.test(f));
    return found ? path.join(folder, found) : null;
  } catch (e) {
    return null;
  }
}
function mimeForExt(ext) {
  ext = ext.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  return `image/${ext}`;
}
/** Reads just enough of a PNG/JPEG/GIF header to get its pixel dimensions,
 *  so the logo can be embedded in the Word report without being stretched
 *  or squished — no extra dependency needed for something this small. */
function getImageDimensions(buffer, ext) {
  try {
    ext = ext.toLowerCase();
    if (ext === 'png') {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (ext === 'gif') {
      return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
    }
    if (ext === 'jpg' || ext === 'jpeg') {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) { offset++; continue; }
        const marker = buffer[offset + 1];
        if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
        if (marker >= 0xd0 && marker <= 0xd7) { offset += 2; continue; }
        const length = buffer.readUInt16BE(offset + 2);
        const isSOF = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (isSOF) return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
        offset += 2 + length;
      }
    }
  } catch (e) { /* fall through */ }
  return null;
}
/** Fits nativeW×nativeH inside maxW×maxH, preserving aspect ratio (scales
 *  up a tiny logo, scales down a large one — never distorts it). */
function fitImageSize(nativeW, nativeH, maxW, maxH) {
  if (!nativeW || !nativeH) return { width: maxW, height: maxH };
  const ratio = Math.min(maxW / nativeW, maxH / nativeH);
  return { width: Math.round(nativeW * ratio), height: Math.round(nativeH * ratio) };
}
/** Reads this espace's logo (if any) ready to embed in a Word report via
 *  ImageRun — sized to fit a header-sized box. Never throws: a missing or
 *  unreadable logo just means no logo in the report, not a failed report. */
async function loadLogoForDocx(folder) {
  try {
    const p = await findLogoFile(folder);
    if (!p) return null;
    const buffer = await fsp.readFile(p);
    let ext = path.extname(p).slice(1).toLowerCase();
    if (ext === 'jpeg') ext = 'jpg'; // docx's ImageRun only knows "jpg", not "jpeg"
    const dims = getImageDimensions(buffer, ext) || { width: 160, height: 60 };
    const size = fitImageSize(dims.width, dims.height, 170, 70);
    return { buffer, type: ext, width: size.width, height: size.height };
  } catch (e) {
    return null;
  }
}
function backupDir(folder) { return path.join(folder, BACKUP_DIR_NAME); }

async function atomicWrite(filePath, content) {
  const tmp = filePath + '.tmp-' + process.pid;
  await fsp.writeFile(tmp, content, 'utf8');
  await fsp.rename(tmp, filePath);
}

async function readMissions(folder) {
  try {
    const raw = await fsp.readFile(dataPath(folder), 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed; // legacy plaintext file, from before encryption
    if (parsed && parsed.enc === 1 && session.key) return decryptJSON(raw, session.key);
    return [];
  } catch (e) {
    return [];
  }
}

/** Delete dated snapshots older than BACKUP_RETENTION_DAYS, so the shared
 *  folder doesn't grow forever. Never throws. */
async function pruneOldBackups(dir) {
  try {
    const cutoff = Date.now() - BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const files = await fsp.readdir(dir);
    for (const f of files) {
      const m = f.match(/^audits-(\d{4}-\d{2}-\d{2})\.json$/);
      if (!m) continue;
      const t = new Date(m[1] + 'T00:00:00').getTime();
      if (!isNaN(t) && t < cutoff) await fsp.unlink(path.join(dir, f)).catch(() => {});
    }
  } catch (e) { /* best effort */ }
}

/** Snapshot the CURRENT audits.json before it gets overwritten — a safety
 *  net against a bad write, a corrupted OneDrive/Drive sync, or an
 *  accidental deletion. Keeps two things: a rolling copy of the version
 *  right before the last write (undo the very last change) and one dated
 *  snapshot per calendar day (recover from further back), auto-pruned
 *  after BACKUP_RETENTION_DAYS. Never throws — a backup failure must never
 *  block saving the user's actual work. */
async function backupBeforeWrite(folder) {
  try {
    const current = await fsp.readFile(dataPath(folder), 'utf8');
    const dir = backupDir(folder);
    await fsp.mkdir(dir, { recursive: true });
    await atomicWrite(path.join(dir, 'audits.avant-derniere-modif.json'), current);
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const dailyFile = path.join(dir, `audits-${today}.json`);
    if (!fs.existsSync(dailyFile)) await atomicWrite(dailyFile, current);
    await pruneOldBackups(dir);
  } catch (e) {
    // e.g. ENOENT: no audits.json yet on the very first save — nothing to back up.
  }
}

async function writeMissions(folder, missions) {
  await backupBeforeWrite(folder);
  const content = session.key ? encryptJSON(missions, session.key) : JSON.stringify(missions, null, 2);
  await atomicWrite(dataPath(folder), content);
}

/** One-time upgrade path: if audits.json is still a legacy plaintext array
 *  (from before encryption at rest was added), re-save it encrypted now
 *  that we have a key. No-op for an already-encrypted or missing file. */
async function migrateToEncryptedIfNeeded(folder) {
  try {
    const raw = await fsp.readFile(dataPath(folder), 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) await writeMissions(folder, parsed);
  } catch (e) { /* missing file, or already encrypted — nothing to do */ }
}

function requireSession() {
  if (!session.folder) {
    const err = new Error('not_unlocked');
    err.code = 'not_unlocked';
    throw err;
  }
}

/* ---------------- IPC handlers ---------------- */
ipcMain.handle('space:chooseFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Choisir l'emplacement de l'espace d'audits",
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || !result.filePaths[0]) return { canceled: true };
  return { canceled: false, path: result.filePaths[0] };
});

ipcMain.handle('space:info', async (evt, folder) => {
  try {
    const exists = fs.existsSync(configPath(folder));
    return { ok: true, exists, folder };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('space:create', async (evt, { folder, identifiant, code }) => {
  try {
    if (!folder) return { ok: false, error: "Aucun dossier sélectionné." };
    if (!identifiant || !identifiant.trim()) return { ok: false, error: "L'identifiant est requis." };
    if (!code || code.length < 4) return { ok: false, error: "Le code d'accès doit contenir au moins 4 caractères." };
    await fsp.mkdir(folder, { recursive: true });
    if (fs.existsSync(configPath(folder))) {
      return { ok: false, error: "Un espace d'audits existe déjà dans ce dossier. Utilisez plutôt « Rejoindre un espace existant »." };
    }
    const cred = makeCredential(code);
    const encSalt = crypto.randomBytes(16).toString('hex');
    const config = {
      version: 1,
      identifiant: identifiant.trim(),
      salt: cred.salt,
      hash: cred.hash,
      encSalt,
      createdAt: new Date().toISOString(),
    };
    await atomicWrite(configPath(folder), JSON.stringify(config, null, 2));
    session = { folder, identifiant: config.identifiant, key: deriveEncryptionKey(code, encSalt) };
    if (!fs.existsSync(dataPath(folder))) {
      await writeMissions(folder, []);
    }
    writeSettings({ lastFolder: folder });
    return { ok: true, folder };
  } catch (e) {
    return { ok: false, error: "Impossible de créer l'espace : " + e.message };
  }
});

ipcMain.handle('space:unlock', async (evt, { folder, identifiant, code }) => {
  try {
    if (!folder || !fs.existsSync(configPath(folder))) {
      return { ok: false, error: "Aucun espace d'audits trouvé dans ce dossier." };
    }
    let config = JSON.parse(await fsp.readFile(configPath(folder), 'utf8'));
    const idMatch = String(identifiant || '').trim().toLowerCase() === String(config.identifiant || '').trim().toLowerCase();
    const codeMatch = verifyCode(code || '', config.salt, config.hash);
    if (!idMatch || !codeMatch) {
      return { ok: false, error: "Identifiant ou code d'accès incorrect." };
    }
    // Espace created before encryption at rest existed — add a salt now,
    // once, so the data file can start being encrypted from here on.
    if (!config.encSalt) {
      config = Object.assign({}, config, { encSalt: crypto.randomBytes(16).toString('hex') });
      await atomicWrite(configPath(folder), JSON.stringify(config, null, 2));
    }
    session = { folder, identifiant: config.identifiant, key: deriveEncryptionKey(code, config.encSalt) };
    await migrateToEncryptedIfNeeded(folder);
    writeSettings({ lastFolder: folder });
    return { ok: true, folder };
  } catch (e) {
    return { ok: false, error: "Impossible d'ouvrir cet espace : " + e.message };
  }
});

ipcMain.handle('space:changeCode', async (evt, { newIdentifiant, newCode }) => {
  try {
    requireSession();
    if (!newIdentifiant || !newIdentifiant.trim()) return { ok: false, error: "L'identifiant est requis." };
    if (!newCode || newCode.length < 4) return { ok: false, error: "Le code d'accès doit contenir au moins 4 caractères." };
    // The encryption key is derived from the code, so changing it means
    // decrypting audits.json with the OLD key before it's gone, then
    // re-encrypting with the new one — read it first, change nothing until
    // that succeeds.
    const missions = await readMissions(session.folder);
    const cred = makeCredential(newCode);
    const encSalt = crypto.randomBytes(16).toString('hex');
    const config = {
      version: 1,
      identifiant: newIdentifiant.trim(),
      salt: cred.salt,
      hash: cred.hash,
      encSalt,
      createdAt: new Date().toISOString(),
    };
    await atomicWrite(configPath(session.folder), JSON.stringify(config, null, 2));
    session.identifiant = config.identifiant;
    session.key = deriveEncryptionKey(newCode, encSalt);
    await writeMissions(session.folder, missions);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? "Session verrouillée." : e.message };
  }
});

ipcMain.handle('space:current', async () => {
  return { folder: session.folder, identifiant: session.identifiant };
});

ipcMain.handle('space:lastFolder', async () => {
  const s = readSettings();
  return { folder: s.lastFolder || null };
});

ipcMain.handle('space:lock', async () => {
  session = { folder: null, identifiant: null, key: null };
  return { ok: true };
});

ipcMain.handle('space:reveal', async () => {
  if (session.folder) shell.showItemInFolder(dataPath(session.folder));
  return { ok: true };
});

ipcMain.handle('space:openBackups', async () => {
  try {
    requireSession();
    const dir = backupDir(session.folder);
    await fsp.mkdir(dir, { recursive: true });
    const err = await shell.openPath(dir);
    return err ? { ok: false, error: err } : { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : e.message };
  }
});

/** Manual, on-demand full export of everything in this espace's shared
 *  folder — audits.json (still encrypted, as on disk), the grid
 *  customization, attachments and final reports — as a single .zip the
 *  user chooses where to save. A complement to the automatic rolling
 *  backups, e.g. before a risky change or to keep an external copy. */
ipcMain.handle('space:exportAll', async () => {
  try {
    requireSession();
    const defaultName = `Sauvegarde - ${safeFileName(session.identifiant)} - ${new Date().toISOString().slice(0,10)}.zip`;
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Exporter tout l'espace",
      defaultPath: path.join(app.getPath('documents'), defaultName),
      filters: [{ name: 'Archive ZIP', extensions: ['zip'] }],
    });
    if (result.canceled || !result.filePath) return { canceled: true };

    const folder = session.folder;
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(result.filePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
      archive.pipe(output);

      const addIfExists = (rel) => {
        const p = path.join(folder, rel);
        if (!fs.existsSync(p)) return;
        if (fs.statSync(p).isDirectory()) archive.directory(p, rel);
        else archive.file(p, { name: rel });
      };
      addIfExists(DATA_FILE);
      addIfExists(CONFIG_FILE);
      addIfExists(GRID_OVERRIDES_FILE);
      addIfExists('pieces-jointes');
      addIfExists('rapports');

      archive.finalize();
    });
    return { ok: true, path: result.filePath };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : "Échec de l'export : " + e.message };
  }
});

ipcMain.handle('app:openExternal', async (evt, url) => {
  try {
    const parsed = new URL(String(url));
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { ok: false, error: 'URL non autorisée.' };
    }
    await shell.openExternal(parsed.toString());
    return { ok: true };
  } catch (e) {
    return { ok: false, error: 'URL invalide.' };
  }
});

ipcMain.handle('data:list', async () => {
  requireSession();
  return await readMissions(session.folder);
});

ipcMain.handle('data:save', async (evt, payload) => {
  requireSession();
  const { mission, expectedUpdatedAt, force } = payload || {};
  const missions = await readMissions(session.folder);
  const idx = missions.findIndex(m => m.id === mission.id);
  // Optimistic concurrency: if someone else's save already moved this exact
  // mission past the version we last read, refuse to silently overwrite it.
  if (idx >= 0 && !force && expectedUpdatedAt && missions[idx].updatedAt && missions[idx].updatedAt !== expectedUpdatedAt) {
    return {
      ok: false,
      conflict: true,
      error: "Cet audit a été modifié par quelqu'un d'autre depuis votre dernière ouverture.",
      current: missions[idx],
    };
  }
  mission.updatedAt = new Date().toISOString();
  if (idx >= 0) missions[idx] = mission; else missions.push(mission);
  await writeMissions(session.folder, missions);
  return { ok: true, updatedAt: mission.updatedAt };
});

ipcMain.handle('data:delete', async (evt, id) => {
  requireSession();
  let missions = await readMissions(session.folder);
  missions = missions.filter(m => m.id !== id);
  await writeMissions(session.folder, missions);
  // Permanent deletion (not the soft-delete/corbeille) — clean up any files
  // attached to this audit's questions so they don't pile up forever.
  await fsp.rm(path.join(session.folder, 'pieces-jointes', safeFileName(id)), { recursive: true, force: true }).catch(() => {});
  return { ok: true };
});

/* ---------------- IA : clé API et génération de rapport ---------------- */
ipcMain.handle('settings:getApiKey', async () => {
  const s = readSettings();
  return { apiKey: s.anthropicApiKey || '' };
});

ipcMain.handle('settings:setApiKey', async (evt, key) => {
  writeSettings({ anthropicApiKey: String(key || '').trim() });
  return { ok: true };
});

/* ---------------- Grille de questions personnalisée par espace ----------------
 * Not encrypted like audits.json — it holds only the questionnaire's own
 * text and reference links, never client data. Missing file = no
 * customization yet (not an error): the app falls back to the built-in
 * grid. */
ipcMain.handle('grid:get', async () => {
  try {
    requireSession();
    const raw = await fsp.readFile(gridOverridesPath(session.folder), 'utf8');
    return { ok: true, overrides: JSON.parse(raw) };
  } catch (e) {
    return { ok: true, overrides: null };
  }
});

ipcMain.handle('grid:save', async (evt, overrides) => {
  try {
    requireSession();
    const payload = Object.assign({}, overrides, { version: 1, updatedAt: new Date().toISOString() });
    await atomicWrite(gridOverridesPath(session.folder), JSON.stringify(payload, null, 2));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : e.message };
  }
});

ipcMain.handle('logo:get', async () => {
  try {
    requireSession();
    const p = await findLogoFile(session.folder);
    if (!p) return { ok: true, dataUrl: null };
    const buf = await fsp.readFile(p);
    const ext = path.extname(p).slice(1);
    return { ok: true, dataUrl: `data:${mimeForExt(ext)};base64,${buf.toString('base64')}` };
  } catch (e) {
    return { ok: true, dataUrl: null };
  }
});

ipcMain.handle('logo:upload', async () => {
  try {
    requireSession();
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Choisir le logo du cabinet',
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] }],
    });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    const existing = await findLogoFile(session.folder);
    if (existing) await fsp.unlink(existing).catch(() => {});
    const ext = (path.extname(result.filePaths[0]) || '.png').toLowerCase();
    await fsp.copyFile(result.filePaths[0], path.join(session.folder, 'logo' + ext));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : e.message };
  }
});

ipcMain.handle('logo:remove', async () => {
  try {
    requireSession();
    const existing = await findLogoFile(session.folder);
    if (existing) await fsp.unlink(existing).catch(() => {});
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : e.message };
  }
});

/* ---------------- "Quoi de neuf" : version vue pour la dernière fois sur ce poste ---------------- */
ipcMain.handle('app:getVersion', async () => app.getVersion());

ipcMain.handle('settings:getLastSeenVersion', async () => {
  const s = readSettings();
  return { version: s.lastSeenVersion || null };
});

ipcMain.handle('settings:setLastSeenVersion', async (evt, version) => {
  writeSettings({ lastSeenVersion: String(version || '') });
  return { ok: true };
});

const GRAVITE_NC = { mineure: 'Mineure', majeure: 'Majeure', critique: 'Critique' };
const STATUT_NC = { ouvert: 'Ouvert', en_cours_nc: 'En cours', clos: 'Clos' };

const ReportSchema = z.object({
  synthese: z.string().describe(
    "Synthèse exécutive de l'audit à destination du client, 2 à 4 paragraphes, ton professionnel et factuel."
  ),
  appreciations: z.array(z.object({
    domaine: z.string().describe("Doit reprendre exactement le nom de domaine fourni."),
    commentaire: z.string().describe(
      "Appréciation qualitative du domaine en 2 à 4 phrases, basée uniquement sur les données fournies (score, écarts). Ne pas inventer de faits."
    ),
  })),
  conclusion: z.string().describe(
    "Conclusion générale et recommandations prioritaires pour le client, 1 à 3 paragraphes."
  ),
});

const NCSuggestionSchema = z.object({
  ecarts: z.array(z.object({
    critereId: z.string().describe("Doit reprendre exactement l'identifiant de critère fourni, sans le modifier."),
    description: z.string().describe(
      "Description factuelle et professionnelle de la non-conformité constatée, en 1 à 2 phrases, basée uniquement sur la question et le commentaire de l'auditeur fournis. Ne rien inventer sur l'entreprise auditée."
    ),
    actionCorrective: z.string().describe(
      "Proposition d'action corrective générique et pertinente pour ce type d'écart, en 1 à 2 phrases — une recommandation de bonne pratique, pas une affirmation sur ce que l'entreprise a déjà fait ou possède."
    ),
  })),
});

function safeFileName(s) {
  return String(s || '').replace(/[\\/:*?"<>|]/g, '-').trim() || 'audit';
}

function textToParagraphs(text, opts) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => new Paragraph({ text: p, spacing: { after: 160 }, ...opts }));
}

function buildReportDocx({ mission, scores, ai, logo }) {
  const children = [];

  if (logo) {
    children.push(new Paragraph({
      children: [new ImageRun({ type: logo.type, data: logo.buffer, transformation: { width: logo.width, height: logo.height } })],
      spacing: { after: 200 },
    }));
  }

  children.push(new Paragraph({
    text: 'Rapport d\'audit de conformité RH',
    heading: HeadingLevel.TITLE,
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: mission.client || 'Entreprise auditée', bold: true, size: 28 })],
    spacing: { after: 80 },
  }));
  children.push(new Paragraph({
    text: [
      `Référence : ${mission.reference || '—'}`,
      `Service audité : ${mission.consultant || '—'}`,
      `Auditeur : ${mission.auditeur || '—'}`,
      `Date d'audit : ${mission.dateAudit || '—'}`,
    ].join('   |   '),
    spacing: { after: 300 },
  }));

  if (mission.perimetre) {
    children.push(new Paragraph({ text: 'Périmètre de l\'audit', heading: HeadingLevel.HEADING_2 }));
    children.push(...textToParagraphs(mission.perimetre));
  }

  children.push(new Paragraph({ text: 'Synthèse', heading: HeadingLevel.HEADING_2 }));
  children.push(...textToParagraphs(ai.synthese));

  children.push(new Paragraph({
    text: `Score global : ${scores.global != null ? scores.global + ' %' : '—'} (${scores.scored} / ${scores.total} critères notés)`,
    spacing: { after: 200 },
  }));

  children.push(new Paragraph({ text: 'Résultats par domaine', heading: HeadingLevel.HEADING_2 }));
  const scoreRows = [new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ children: [new Paragraph({ text: 'Domaine', bold: true })] }),
      new TableCell({ children: [new Paragraph({ text: 'Score', bold: true })] }),
    ],
  })];
  scores.catScores.forEach(cs => {
    scoreRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(cs.nom)] }),
        new TableCell({ children: [new Paragraph(cs.pct != null ? cs.pct + ' %' : '—')] }),
      ],
    }));
  });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: scoreRows }));
  children.push(new Paragraph({ text: '', spacing: { after: 200 } }));

  const apprByDomaine = {};
  (ai.appreciations || []).forEach(a => { apprByDomaine[a.domaine] = a.commentaire; });
  scores.catScores.forEach(cs => {
    children.push(new Paragraph({ text: `${cs.nom} — ${cs.pct != null ? cs.pct + ' %' : 'N/A'}`, heading: HeadingLevel.HEADING_3 }));
    const commentaire = apprByDomaine[cs.nom];
    if (commentaire) children.push(...textToParagraphs(commentaire));
  });

  const nc = mission.nonConformites || [];
  children.push(new Paragraph({ text: 'Non-conformités et plan d\'actions', heading: HeadingLevel.HEADING_2 }));
  if (nc.length === 0) {
    children.push(new Paragraph({ text: 'Aucune non-conformité relevée sur cette mission.' }));
  } else {
    const ncRows = [new TableRow({
      tableHeader: true,
      children: ['Écart', 'Gravité', 'Action corrective', 'Responsable', 'Échéance', 'Statut'].map(h =>
        new TableCell({ children: [new Paragraph({ text: h, bold: true })] })
      ),
    })];
    nc.forEach(n => {
      ncRows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(n.critereLabel || n.description || '—')] }),
          new TableCell({ children: [new Paragraph(GRAVITE_NC[n.gravite] || n.gravite || '—')] }),
          new TableCell({ children: [new Paragraph(n.actionCorrective || '—')] }),
          new TableCell({ children: [new Paragraph(n.responsable || '—')] }),
          new TableCell({ children: [new Paragraph(n.echeance || '—')] }),
          new TableCell({ children: [new Paragraph(STATUT_NC[n.statut] || n.statut || '—')] }),
        ],
      }));
    });
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: ncRows }));
  }
  children.push(new Paragraph({ text: '', spacing: { after: 200 } }));

  children.push(new Paragraph({ text: 'Conclusion et recommandations', heading: HeadingLevel.HEADING_2 }));
  children.push(...textToParagraphs(ai.conclusion));

  return new Document({ sections: [{ children }] });
}

ipcMain.handle('report:generate', async (evt, { mission, scores }) => {
  try {
    requireSession();
    const s = readSettings();
    const apiKey = s.anthropicApiKey;
    if (!apiKey) {
      return { ok: false, error: "Aucune clé API Anthropic configurée. Renseignez-la dans Paramètres avant de générer un rapport." };
    }

    const factuel = {
      entreprise: mission.client || null,
      serviceAudite: mission.consultant || null,
      auditeur: mission.auditeur || null,
      dateAudit: mission.dateAudit || null,
      perimetre: mission.perimetre || null,
      scoreGlobal: scores.global,
      domaines: scores.catScores.map(cs => ({ nom: cs.nom, score: cs.pct, critaireNotes: cs.count, critaireTotal: cs.total })),
      nonConformites: (mission.nonConformites || []).map(n => ({
        critere: n.critereLabel || null,
        gravite: GRAVITE_NC[n.gravite] || n.gravite,
        description: n.description || null,
        actionCorrective: n.actionCorrective || null,
        statut: STATUT_NC[n.statut] || n.statut,
      })),
    };

    const client = new Anthropic({ apiKey });
    const response = await client.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high', format: zodOutputFormat(ReportSchema) },
      system: "Tu es un auditeur RH senior qui rédige, en français et dans un ton professionnel, la partie rédactionnelle d'un rapport d'audit de conformité RH à destination d'un client. Tu t'appuies EXCLUSIVEMENT sur les données factuelles fournies (scores, non-conformités) : n'invente aucun chiffre, aucun fait, aucune non-conformité qui ne serait pas dans les données. Pour chaque domaine, reprends exactement le nom fourni.",
      messages: [{ role: 'user', content: 'Données factuelles de l\'audit (JSON) :\n' + JSON.stringify(factuel, null, 2) }],
    });

    if (!response.parsed_output) {
      return { ok: false, error: "Claude n'a pas renvoyé de contenu exploitable. Réessayez." };
    }

    const doc = buildReportDocx({ mission, scores, ai: response.parsed_output, logo: await loadLogoForDocx(session.folder) });
    const buffer = await Packer.toBuffer(doc);

    const defaultName = `Rapport - ${safeFileName(mission.client)} - ${safeFileName(mission.reference)}.docx`;
    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: 'Enregistrer le rapport',
      defaultPath: path.join(app.getPath('documents'), defaultName),
      filters: [{ name: 'Document Word', extensions: ['docx'] }],
    });
    if (saveResult.canceled || !saveResult.filePath) return { ok: false, canceled: true };

    await fsp.writeFile(saveResult.filePath, buffer);
    return { ok: true, path: saveResult.filePath };
  } catch (e) {
    const msg = e && e.status === 401 ? "Clé API Anthropic invalide." : (e.message || String(e));
    return { ok: false, error: "Échec de la génération du rapport : " + msg };
  }
});

/** Drafts a description + action corrective for a batch of flagged
 *  questions (notées Non conforme / Partiel, sans non-conformité déjà
 *  créée) — `items`: [{ critereId, critereLabel, domaine, comment,
 *  gravite }]. Never touches the mission's data itself; the renderer
 *  merges the suggestions into new non-conformité entries. */
ipcMain.handle('nc:generateAI', async (evt, { items }) => {
  try {
    requireSession();
    const s = readSettings();
    const apiKey = s.anthropicApiKey;
    if (!apiKey) {
      return { ok: false, error: "Aucune clé API Anthropic configurée. Renseignez-la dans Paramètres, ou utilisez l'option gratuite (copier pour claude.ai)." };
    }
    if (!items || items.length === 0) {
      return { ok: false, error: "Aucun écart à documenter." };
    }
    const client = new Anthropic({ apiKey });
    const response = await client.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium', format: zodOutputFormat(NCSuggestionSchema) },
      system: "Tu es un auditeur RH senior qui rédige, en français, la description et l'action corrective de non-conformités pour un rapport d'audit de conformité RH. Pour chaque écart fourni, rédige une description factuelle et une action corrective générique et professionnelle adaptées au type de non-conformité. N'invente aucun fait sur l'entreprise auditée : base-toi uniquement sur le libellé de la question et le commentaire éventuel de l'auditeur. Reprends exactement le critereId fourni pour chaque écart.",
      messages: [{ role: 'user', content: 'Écarts à documenter (JSON) :\n' + JSON.stringify(items, null, 2) }],
    });
    if (!response.parsed_output) {
      return { ok: false, error: "Claude n'a pas renvoyé de contenu exploitable. Réessayez." };
    }
    return { ok: true, ecarts: response.parsed_output.ecarts };
  } catch (e) {
    const msg = e && e.status === 401 ? "Clé API Anthropic invalide." : (e.message || String(e));
    return { ok: false, error: "Échec de la génération : " + msg };
  }
});

/* ---------------- Pièces jointes par question ---------------- */
function attachmentDir(missionId, critId) {
  return path.join(session.folder, 'pieces-jointes', safeFileName(missionId), safeFileName(critId));
}

ipcMain.handle('attachment:add', async (evt, { missionId, critId }) => {
  try {
    requireSession();
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Choisir un fichier à joindre à cette question',
      properties: ['openFile'],
      filters: [
        { name: 'Documents et images', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'heic', 'txt'] },
        { name: 'Tous les fichiers', extensions: ['*'] },
      ],
    });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    const src = result.filePaths[0];
    const originalName = path.basename(src);
    const dir = attachmentDir(missionId, critId);
    await fsp.mkdir(dir, { recursive: true });
    const storedName = Date.now() + '-' + safeFileName(originalName);
    await fsp.copyFile(src, path.join(dir, storedName));
    return { ok: true, file: storedName, name: originalName };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : "Impossible de joindre le fichier : " + e.message };
  }
});

ipcMain.handle('attachment:open', async (evt, { missionId, critId, file }) => {
  try {
    requireSession();
    const dest = path.join(attachmentDir(missionId, critId), safeFileName(file));
    if (!fs.existsSync(dest)) return { ok: false, error: "Ce fichier n'existe plus dans le dossier partagé." };
    const err = await shell.openPath(dest);
    return err ? { ok: false, error: err } : { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : e.message };
  }
});

ipcMain.handle('attachment:remove', async (evt, { missionId, critId, file }) => {
  try {
    requireSession();
    await fsp.unlink(path.join(attachmentDir(missionId, critId), safeFileName(file))).catch(() => {});
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.code === 'not_unlocked' ? 'Session verrouillée.' : e.message };
  }
});

ipcMain.handle('report:attach', async (evt, { reference }) => {
  try {
    requireSession();
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Choisir le fichier du rapport à joindre',
      properties: ['openFile'],
      filters: [{ name: 'Documents', extensions: ['docx', 'doc', 'pdf'] }],
    });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    const src = result.filePaths[0];
    const ext = path.extname(src) || '.docx';
    const dir = path.join(session.folder, 'rapports');
    await fsp.mkdir(dir, { recursive: true });
    const fileName = safeFileName(reference || 'audit') + ' - rapport' + ext;
    await fsp.copyFile(src, path.join(dir, fileName));
    return { ok: true, fileName };
  } catch (e) {
    return { ok: false, error: "Impossible de joindre le fichier : " + e.message };
  }
});

ipcMain.handle('report:open', async (evt, fileName) => {
  try {
    requireSession();
    const dest = path.join(session.folder, 'rapports', fileName);
    if (!fs.existsSync(dest)) return { ok: false, error: "Ce fichier n'existe plus dans le dossier partagé." };
    const err = await shell.openPath(dest);
    if (err) return { ok: false, error: err };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('report:exportPdf', async (evt, { reference }) => {
  try {
    requireSession();
    const data = await mainWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 },
    });
    const defaultName = safeFileName(reference || 'audit') + '.pdf';
    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter en PDF',
      defaultPath: path.join(app.getPath('documents'), defaultName),
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (saveResult.canceled || !saveResult.filePath) return { canceled: true };
    await fsp.writeFile(saveResult.filePath, data);
    return { ok: true, path: saveResult.filePath };
  } catch (e) {
    return { ok: false, error: "Échec de l'export PDF : " + e.message };
  }
});

ipcMain.handle('export:xlsx', async (evt, { sheets }) => {
  try {
    requireSession();
    const wb = XLSX.utils.book_new();
    (sheets || []).forEach(s => {
      const ws = XLSX.utils.json_to_sheet(s.rows || []);
      // Excel sheet names: 31 chars max, no : \ / ? * [ ]
      const name = String(s.name || 'Feuille').replace(/[:\\/?*[\]]/g, '-').slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, name);
    });
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const defaultName = `Export audits - ${new Date().toISOString().slice(0, 10)}.xlsx`;
    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter les audits',
      defaultPath: path.join(app.getPath('documents'), defaultName),
      filters: [{ name: 'Classeur Excel', extensions: ['xlsx'] }],
    });
    if (saveResult.canceled || !saveResult.filePath) return { canceled: true };

    await fsp.writeFile(saveResult.filePath, buffer);
    return { ok: true, path: saveResult.filePath };
  } catch (e) {
    return { ok: false, error: "Échec de l'export : " + e.message };
  }
});

/* ---------------- mise à jour automatique ---------------- */
function setupAutoUpdater() {
  if (!app.isPackaged) return; // no update feed to check against in dev mode

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['Redémarrer maintenant', 'Plus tard'],
      defaultId: 0,
      cancelId: 1,
      title: 'Mise à jour disponible',
      message: `Une nouvelle version d'Audits PCRH (${info.version}) a été téléchargée.`,
      detail: "Redémarrez l'application pour l'installer. Vos audits, dans le dossier partagé, ne sont pas affectés.",
    }).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto-update error:', err && err.message);
  });

  const check = () => autoUpdater.checkForUpdates().catch(err => {
    console.error('checkForUpdates failed:', err && err.message);
  });
  check();
  // The app can stay open for days — re-check periodically, not just at launch.
  setInterval(check, 4 * 60 * 60 * 1000);
}

/* ---------------- window ---------------- */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#f6f3ec',
    title: 'Audits PCRH',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  setTimeout(setupAutoUpdater, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

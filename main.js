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
  TextRun, WidthType, AlignmentType, BorderStyle,
} = require('docx');
const XLSX = require('xlsx');
const { autoUpdater } = require('electron-updater');

const CONFIG_FILE = 'espace.json';
const DATA_FILE = 'audits.json';
const BACKUP_DIR_NAME = 'sauvegardes';
const BACKUP_RETENTION_DAYS = 30;
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

/** In-memory session state, held ONLY in the trusted main process.
 *  The renderer never sets this directly — it is only ever set by a
 *  successful space:create / space:unlock call, and cleared on space:lock. */
let session = { folder: null, identifiant: null };

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

/* ---------------- file helpers ---------------- */
function configPath(folder) { return path.join(folder, CONFIG_FILE); }
function dataPath(folder) { return path.join(folder, DATA_FILE); }
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
    return Array.isArray(parsed) ? parsed : [];
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
  await atomicWrite(dataPath(folder), JSON.stringify(missions, null, 2));
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
    const config = {
      version: 1,
      identifiant: identifiant.trim(),
      salt: cred.salt,
      hash: cred.hash,
      createdAt: new Date().toISOString(),
    };
    await atomicWrite(configPath(folder), JSON.stringify(config, null, 2));
    if (!fs.existsSync(dataPath(folder))) {
      await atomicWrite(dataPath(folder), JSON.stringify([], null, 2));
    }
    session = { folder, identifiant: config.identifiant };
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
    const config = JSON.parse(await fsp.readFile(configPath(folder), 'utf8'));
    const idMatch = String(identifiant || '').trim().toLowerCase() === String(config.identifiant || '').trim().toLowerCase();
    const codeMatch = verifyCode(code || '', config.salt, config.hash);
    if (!idMatch || !codeMatch) {
      return { ok: false, error: "Identifiant ou code d'accès incorrect." };
    }
    session = { folder, identifiant: config.identifiant };
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
    const cred = makeCredential(newCode);
    const config = {
      version: 1,
      identifiant: newIdentifiant.trim(),
      salt: cred.salt,
      hash: cred.hash,
      createdAt: new Date().toISOString(),
    };
    await atomicWrite(configPath(session.folder), JSON.stringify(config, null, 2));
    session.identifiant = config.identifiant;
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
  session = { folder: null, identifiant: null };
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

function buildReportDocx({ mission, scores, ai }) {
  const children = [];

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

    const doc = buildReportDocx({ mission, scores, ai: response.parsed_output });
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

ipcMain.handle('export:xlsx', async (evt, { audits, nonConformites }) => {
  try {
    requireSession();
    const wb = XLSX.utils.book_new();
    const wsAudits = XLSX.utils.json_to_sheet(audits || []);
    XLSX.utils.book_append_sheet(wb, wsAudits, 'Audits');
    const wsNC = XLSX.utils.json_to_sheet(nonConformites || []);
    XLSX.utils.book_append_sheet(wb, wsNC, 'Non-conformités');
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

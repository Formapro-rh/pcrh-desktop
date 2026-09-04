# Comment publier une mise à jour d'Audits PCRH

Depuis la version 1.1.0, l'application se met à jour **toute seule** sur les
postes où elle est installée : elle vérifie au démarrage (puis toutes les
4 heures) si une nouvelle version existe sur GitHub, la télécharge, puis
propose de redémarrer pour l'installer. Il n'y a donc **plus besoin de
renvoyer un installeur à la main** à chaque nouveauté.

Pour publier une nouvelle version, suivez ces étapes.

## 1. Faire les modifications du code

Comme d'habitude (avec Claude ou seul), modifiez `main.js`,
`renderer/app.js`, `renderer/index.html`, etc.

## 2. Augmenter le numéro de version

Ouvrez `package.json` et changez la ligne `"version"` :

```json
"version": "1.2.0",
```

Règle simple : `1.1.0` → `1.2.0` pour une nouveauté, `1.1.0` → `1.1.1` pour
un petit correctif. Le numéro doit être **plus grand** que la version
précédente, sinon la mise à jour ne sera pas détectée par les postes déjà
installés.

## 3. Publier

Ouvrez un terminal **PowerShell**, puis :

```bash
cd "C:\Users\Utilisateur\Documents\pcrh-desktop"
npm.cmd run publish:win
```

Ça prend quelques minutes. À la fin, vous devez voir une ligne du type :

```
creating GitHub release  reason=release doesn't exist  tag=v1.2.0  version=1.2.0
```

C'est signe que tout s'est bien passé : la nouvelle version est disponible
sur GitHub, et tous les postes avec l'app installée la recevront
automatiquement dans les heures qui suivent.

### Si `npm run publish:win` échoue avec une erreur "exécution de scripts
désactivée"

Utilisez `npm.cmd` au lieu de `npm` (comme dans la commande ci-dessus) —
c'est un souci de sécurité PowerShell propre à Windows, sans rapport avec
GitHub.

### Si après publication, l'app ne détecte jamais la mise à jour

Vérifiez sur [github.com/Formapro-rh/pcrh-desktop/releases](https://github.com/Formapro-rh/pcrh-desktop/releases)
que la dernière release n'est **pas** marquée "Draft". Si elle l'est,
ouvrez-la (crayon ✏️) et cliquez sur "Publish release" tout en bas.
Normalement ce cas ne devrait plus se présenter (la configuration a été
corrigée avec `"releaseType": "release"` dans `package.json`), mais si
ça revient, c'est le premier réflexe à avoir.

### Si ça échoue avec une erreur `GitHub Personal Access Token is not set`

Le jeton GitHub (`GH_TOKEN`, enregistré comme variable d'environnement
utilisateur sur ce PC) n'est pas vu par le terminal. Fermez la fenêtre
PowerShell, ouvrez-en une toute nouvelle, et réessayez.

Si le jeton a expiré (ils ont une durée de vie limitée, ~90 jours), il
faudra en générer un nouveau sur
[github.com/settings/tokens](https://github.com/settings/tokens)
(scope `public_repo` uniquement) et remplacer la valeur de la variable
`GH_TOKEN` dans les Variables d'environnement Windows.

### Si la fenêtre "Mise à jour disponible" met du temps à apparaître

C'est normal — le téléchargement de l'installeur (~85 Mo) peut prendre
plusieurs minutes selon la connexion, et se fait en arrière-plan sans
rien afficher tant qu'il n'est pas terminé. Inutile de fermer/rouvrir
l'app en boucle : laissez-la simplement ouverte quelques minutes, la
fenêtre apparaîtra dès que le téléchargement sera fini.

## Notes

- Le dossier partagé des audits (`pcrh-data`) n'est jamais touché par une
  mise à jour de l'application — c'est un dossier totalement séparé du
  code de l'app.
- Le dépôt GitHub `Formapro-rh/pcrh-desktop` contient uniquement le code
  de l'application, jamais les données clients des audits.

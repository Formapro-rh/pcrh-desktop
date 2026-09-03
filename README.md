# Audits PCRH — application de bureau

Application de bureau (Windows / macOS / Linux) pour gérer les audits de conformité
RH de l'entreprise : grille de notation par domaines et sous-domaines,
non-conformités et plan d'actions, tableau de bord et rapports imprimables.
Construite avec [Electron](https://www.electronjs.org/).

## 1. Comment ça marche

- Il n'y a pas de serveur : toutes les données d'un « espace d'audits » sont
  stockées dans **deux fichiers** (`espace.json` et `audits.json`) à l'intérieur
  d'un **dossier que vous choisissez** à la première connexion.
- Pour que plusieurs personnes travaillent sur les mêmes audits, placez ce dossier
  dans un emplacement **partagé et synchronisé** entre les postes de l'équipe
  (lecteur réseau de l'entreprise, OneDrive, Google Drive, Dropbox…). Chaque
  personne installe l'application sur son ordinateur et pointe vers ce même
  dossier partagé.
- À l'ouverture, l'application demande un **identifiant** et un **code d'accès**
  communs à toute l'équipe (définis à la création de l'espace). Ce sont ces deux
  informations qu'il faut transmettre à vos collègues — pas de compte individuel.
- L'application se resynchronise automatiquement toutes les 20 secondes et à
  chaque fois que vous revenez sur son onglet, pour prendre en compte les audits
  ajoutés ou modifiés par vos collègues.

## 2. Installer et lancer en développement

Prérequis : [Node.js](https://nodejs.org/) (version 18 ou plus récente).

```bash
npm install
npm start
```

Une fenêtre s'ouvre : à la première utilisation, choisissez un dossier puis
utilisez l'onglet « Créer un espace » pour définir l'identifiant et le code
d'accès de votre équipe. Les fois suivantes, utilisez « Rejoindre un espace ».

## 3. Générer les fichiers d'installation (.exe / .dmg / .AppImage)

```bash
npm run dist:win     # génère un installeur Windows (.exe) — depuis Windows, ou Linux/macOS avec Wine
npm run dist:mac      # génère un .dmg — doit être exécuté sur un Mac
npm run dist:linux    # génère un .AppImage — depuis Linux
```

Les fichiers générés apparaissent dans le dossier `release/`. Chaque personne
n'a alors qu'à télécharger/installer le fichier correspondant à son système.

**Important** : la génération du `.dmg` macOS (et sa signature/notarisation, si vous
souhaitez éviter l'avertissement Gatekeeper à l'ouverture) doit être faite depuis
un Mac — ce n'est pas possible depuis Windows ou Linux. Le `.exe` Windows peut en
revanche être généré depuis n'importe quel système.

Pour changer l'icône de l'application, remplacez `build/icon.png` (image carrée,
1024×1024 px) avant de lancer `npm run dist:*`.

## 4. À propos de la sécurité du code d'accès

- Le code d'accès n'est jamais stocké en clair : il est haché (scrypt + sel
  aléatoire) dans `espace.json`, comparé côté processus principal de
  l'application (jamais dans la fenêtre affichée).
- Cela protège contre une lecture directe du fichier ou un accès occasionnel au
  dossier partagé, mais **ce n'est pas un système d'authentification individuel**
  ni un chiffrement des données : toute personne ayant accès en lecture au dossier
  partagé peut lire le contenu des audits, et une personne techniquement outillée
  pourrait démonter l'application pour contourner l'écran de connexion. C'est un
  niveau de protection adapté à un usage interne d'équipe, pas à des données
  hautement confidentielles.
- Le bouton **Paramètres → Changer** permet de renouveler l'identifiant et le
  code d'accès à tout moment (utile si l'un d'eux a été partagé trop largement).
- Si vous avez besoin, plus tard, de comptes individuels, d'un contrôle d'accès
  précis par personne, ou d'un chiffrement plus poussé, ce sera une évolution à
  part (ajout d'un vrai serveur d'authentification) — n'hésitez pas à demander.

## 5. Structure du projet

```
main.js            Processus principal Electron (fenêtre, accès disque, authentification)
preload.js          Pont sécurisé entre la fenêtre et le processus principal
renderer/index.html Interface (structure + styles)
renderer/app.js      Logique de l'application (grille d'audit, tableau de bord, rapports)
build/icon.png       Icône de l'application
```

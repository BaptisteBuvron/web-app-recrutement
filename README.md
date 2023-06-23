[![Build result](https://github.com/BaptisteBuvron/SeeISS/actions/workflows/build.yml/badge.svg)](https://github.com/BaptisteBuvron/web-app-recrutement/actions/workflows/node.js.yml)<img src="https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E" alt="JavaScript" width="80"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" width="110"/> <img src="https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white" alt="Express.js" width="100"/> <img src="https://img.shields.io/badge/SQL-4479A1?style=flat&logo=sql&logoColor=white" alt="SQL" width="70"/>

# web-app-recrutement

Application Express.js avec TypeScript pour le système de recrutement dans le cadre de l'UV AI16.


## Étudiants
* [Baptiste Buvron](https://github.com/BaptisteBuvron)
* [Soudarsane Tillai](https://github.com/darsane21)

## Raport de sécurité
Le rapport de sécurité est disponible [ici](securite.md)

## Clonage du projet
```
git clone https://github.com/BaptisteBuvron/web-app-recrutement.git
cd web-app-recrutement
```

## Base de données
Ce projet utilise un fichier `docker-compose.yml` pour gérer la base de données avec Docker. Vous pouvez trouver le fichier [ici](app/docker/docker-compose.yaml).


### Configuration de la base de données
1. Créer un fichier `.env` à la racine du projet.
2. Ajouter les paramètres suivants dans le fichier `.env` :
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
```

## Exécution du fichier table.sql
Exécuter le fichier `table.sql` pour initialiser la base de données.

## Installation et exécution

```
cd app
npm install
npm run dev
```


## Intégration continue
Ce projet utilise une intégration continue avec GitHub Actions. À chaque merge et pull request, le projet est automatiquement compilé et testé. Vous pouvez consulter le statut de la dernière construction en cliquant sur le badge ci-dessous :
[![Build result](https://github.com/BaptisteBuvron/SeeISS/actions/workflows/build.yml/badge.svg)](https://github.com/BaptisteBuvron/web-app-recrutement/actions/workflows/node.js.yml)


## License
Ce projet est sous license GNU General Public License (GPL). Veuillez consulter le fichier [LICENSE](https://www.gnu.org/licenses/gpl-3.0.en.html#license-text) pour plus d'informations.

---

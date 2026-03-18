# TaskFlow — Frontend

Application frontend **TaskFlow** développée avec **Angular 21**.

> Ce dépôt correspond à la partie *frontend*.

## Sommaire

- [Pré-requis](#pré-requis)
- [Installation](#installation)
- [Démarrer en développement](#démarrer-en-développement)
- [Configuration de l’API](#configuration-de-lapi)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Identité visuelle (dark mode)](#identité-visuelle-dark-mode)

## Pré-requis

- **Node.js** (idéalement une version récente LTS)
- **npm** (le projet indique `npm@10.2.5` dans `package.json`)

Si vous n’avez pas Angular CLI en global, pas de souci : les commandes `ng` passent via les dépendances du projet.

## Installation

Depuis la racine du projet :

```bash
npm install
```

## Démarrer en développement

Lancer le serveur de dev :

```bash
npm start
```

Puis ouvrir :

- http://localhost:4200/

Le rechargement est automatique lors des modifications de fichiers.

## Configuration de l’API

Par défaut, le frontend appelle l’API sur :

- `http://localhost:3000`

Cette valeur est définie dans :

- `src/environments/environment.ts` → `environment.apiUrl`

> Adaptez cette URL en fonction de l’adresse/port de votre backend.

## Scripts disponibles

Les scripts principaux (voir `package.json`) :

- `npm start` : lance le serveur de développement (`ng serve`)
- `npm run build` : build de production
- `npm run watch` : build en mode watch (configuration *development*)
- `npm test` : exécute les tests unitaires (builder Angular + Vitest)

## Structure du projet

Points d’entrée et répertoires utiles :

- `src/main.ts` : bootstrap Angular
- `src/app/core` : éléments transverses (services, stores, interceptors, guards, modèles…)
- `src/app/features` : modules/pages fonctionnels (auth, dashboard, tasks, categories…)
- `src/app/shared` : composants partagés (navbar, sidebar, toasts…)
- `public/` : assets statiques

## Identité visuelle (dark mode)

Une référence de palette / règles UI est disponible ici :

- `DARK_MODE_IDENTITY.md`

---

## À propos d’Angular CLI

Le projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) (version `21.0.4`).

Commandes utiles :

```bash
# Générer un composant
ng generate component component-name

# Liste des schematics
ng generate --help
```

Documentation : https://angular.dev/tools/cli

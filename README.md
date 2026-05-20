# Acquae Giardini — Bons de commande

Application web pour créer, gérer et imprimer les bons de commande des clients
(activité bassins · fontaines · aménagements aquatiques).

## Fonctionnalités

- **Création de bons de commande** : numérotation automatique (`BC-AAAA-001`),
  client, dates, statut, conditions de règlement.
- **Lignes d'articles** avec quantité, unité, prix unitaire et taux de TVA par
  ligne (20 %, 10 %, 5,5 %, 0 %).
- **Calcul automatique** des totaux : HT, TVA détaillée par taux, TTC, acompte
  et reste à payer.
- **Catalogue rapide** d'articles courants (bâche, pompe, filtration, fontaine,
  main-d'œuvre, etc.) à ajouter en un clic.
- **Historique** : tous les bons sont enregistrés dans le navigateur
  (localStorage) et consultables, modifiables, duplicables.
- **Aperçu et impression PDF** : mise en page A4 propre, impression ou
  enregistrement en PDF via le navigateur.
- **Coordonnées de l'entreprise** configurables (apparaissent en en-tête de
  chaque document).

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

L'application est ensuite accessible sur http://localhost:5173.

## Build de production

```bash
npm run build
npm run preview
```

## Stack technique

- React 18 + Vite
- Aucune base de données : les données sont stockées localement dans le
  navigateur (localStorage).

## Notes

- Les prix du catalogue sont indicatifs et entièrement modifiables sur chaque
  bon de commande.
- Pour générer un PDF, utilisez le bouton **Imprimer / Enregistrer en PDF**
  puis choisissez « Enregistrer en PDF » comme imprimante.

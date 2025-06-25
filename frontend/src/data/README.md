# Système de Gestion des Chapitres

## Vue d'ensemble

Ce système permet la gestion complète des chapitres d'un roman avec un flux de vérification et d'édition robuste.

## Structure des données

### Fichier `chaptersData.json`

Contient un objet avec un tableau `chapters` où chaque chapitre a la structure suivante :

```json
{
  "id": number,                    // Identifiant unique
  "title": string,                 // Titre du chapitre
  "chapterNumber": number,         // Numéro du chapitre
  "romanId": number,              // ID du roman parent
  "romanTitle": string,           // Titre du roman
  "author": string,               // Nom de l'auteur
  "authorId": number,             // ID de l'auteur
  "status": string,               // Statut du chapitre
  "content": string,              // Contenu complet du chapitre
  "wordCount": number,            // Nombre de mots
  "submittedAt": string,          // Date de soumission (ISO)
  "publishedAt": string|null,     // Date de publication (ISO)
  "views": number,                // Nombre de lectures
  "isVerified": boolean,          // Si vérifié par un modérateur
  "comment": string|null,         // Commentaire de modération
  "moderationStatus": string,     // État de modération
  "moderatedAt": string|null,     // Date de modération
  "moderatedBy": string|null      // Modérateur qui a traité
}
```

### Statuts disponibles

- `pending` : En attente de vérification
- `accepted_unpublished` : Accepté mais non publié
- `published` : Publié et visible
- `unpublished` : Dépublié (était publié mais retiré)

### États de modération

- `pending` : En attente
- `approved` : Approuvé
- `revision_requested` : Révision demandée

## Fonctionnalités

### 1. Lecture des chapitres (`ChapterDetailsModal`)

- **Affichage complet** : Contenu avec métadonnées
- **Outils de lecture** :
  - Ajustement de la taille de police (12-24px)
  - Copie dans le presse-papier
  - Téléchargement en fichier .txt
- **Interface responsive** : Mobile et desktop
- **Bouton Modifier** : Ouvre la modale d'édition

### 2. Édition des chapitres (`ChapterEditModal`)

- **Formulaire complet** :
  - Titre (min 5 caractères)
  - Contenu (min 100 caractères)
  - Commentaire pour les modérateurs (optionnel)
- **Validation en temps réel**
- **Compteur de mots automatique**
- **Système de re-vérification** : Tout chapitre modifié passe en statut `pending`

### 3. Flux de vérification

1. **Soumission** : Chapitre créé avec statut `pending`
2. **Modération** : Admin examine et approuve/demande révision
3. **Publication** : Passage de `accepted_unpublished` à `published`
4. **Re-vérification** : Toute modification remet en `pending`

## Usage technique

### Import des données

```javascript
import chaptersData from '../../data/chaptersData.json';

// Utilisation
const chapters = chaptersData.chapters;
```

### Filtrage par roman

```javascript
const chaptersByRoman = chaptersData.chapters.filter(
  chapter => chapter.romanId === romanId
);
```

### Mise à jour après édition

```javascript
const handleChapterEdit = (updatedChapter) => {
  setChapters(prevChapters => 
    prevChapters.map(chapter => 
      chapter.id === updatedChapter.id ? updatedChapter : chapter
    )
  );
};
```

## Interface utilisateur

### Navigation

1. **Page Authors** → Voir les chapitres d'un roman
2. **Page Chapters** → Liste des chapitres avec filtres
3. **Clic sur chapitre** → Modale de détails
4. **Bouton Modifier** → Modale d'édition

### Responsive Design

- **Mobile** : Cartes empilées avec informations essentielles
- **Desktop** : Tableau complet avec toutes les colonnes
- **Modales** : Adaptatifs avec sticky headers/footers

## Sécurité et validation

### Côté client

- Validation des formulaires (longueur, contenu requis)
- Sanitisation des entrées utilisateur
- États de chargement et gestion d'erreurs

### Workflow de modération

- Avertissement automatique lors de l'édition
- Changement de statut obligatoire après modification
- Traçabilité des modifications avec dates et modérateurs

## Performance

- **Pagination** : 10 chapitres par page
- **Filtrage** : Recherche par titre/numéro + statut
- **Lazy loading** : Contenu chargé à la demande
- **Optimisation mobile** : Interface adaptée aux petits écrans 
 
 
 
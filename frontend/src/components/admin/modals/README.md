# Admin Modals

Collection de modales pour l'interface d'administration.

## ChapterDetailsModal

Modale dédiée à l'affichage détaillé d'un chapitre avec fonctionnalités de lecture avancées.

### Fonctionnalités

- **Affichage complet** : Titre, statut, métadonnées, contenu
- **Outils de lecture** : Ajustement de la taille de police (12-24px)
- **Actions** : Copier le contenu, télécharger en .txt
- **Interface responsive** : Adapté mobile et desktop
- **Design glassmorphism** : Cohérent avec le thème admin

### Utilisation

```jsx
import { ChapterDetailsModal } from './modals';

<ChapterDetailsModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  chapter={chapterData}
/>
```

### Props

- `isOpen` (boolean) : État d'ouverture de la modale
- `onClose` (function) : Callback de fermeture
- `chapter` (object) : Données du chapitre à afficher

### Structure des données chapitre

```javascript
{
  id: number,
  title: string,
  chapterNumber: number,
  romanTitle: string,
  author: string,
  status: 'pending' | 'accepted_unpublished' | 'published' | 'unpublished',
  content: string,
  wordCount: number,
  views: number,
  submittedAt: string,
  publishedAt?: string,
  comment?: string
}
```

## Autres modales

- `DetailsModal` : Modale générale pour les détails
- `EditModal` : Modale d'édition
- `QuickActionModal` : Modale d'actions rapides 
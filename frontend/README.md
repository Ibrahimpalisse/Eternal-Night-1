# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Frontend - Eternal Night

## Améliorations récentes - Validation Zod

### 🔒 Nouveaux schémas de validation

Les validations regex manuelles ont été remplacées par des schémas Zod robustes :

#### Schémas ajoutés :
- **`timeSchema`** : Validation d'heure au format HH:MM
- **`verificationCodeSchema`** : Validation de codes à 6 chiffres
- **`digitSchema`** : Validation de chiffres individuels
- **`chapterTitleSchema`** : Validation de titres de chapitre
- **`chapterContentSchema`** : Validation de contenu de chapitre
- **`chapterNumberSchema`** : Validation de numéros de chapitre
- **`chapterEditSchema`** : Schéma complet pour l'édition de chapitre
- **`searchQuerySchema`** : Validation de requêtes de recherche
- **`fileNameSchema`** : Validation sécurisée de noms de fichier
- **`dateTimeSchema`** : Validation de date/heure combinée
- **`paginationSchema`** : Validation de paramètres de pagination

#### Fonctions utilitaires ajoutées :
- `validateVerificationCode()`
- `validateTime()`
- `validateFileName()`
- `validateSearchQuery()`
- `validatePagination()`
- `validateChapter()`
- `validateFieldLive()` pour validation en temps réel

### 🚀 Composants modifiés

#### DatePicker (`components/ui/datepicker.jsx`)
- ✅ Validation Zod pour l'heure (HH:MM)
- ✅ Messages d'erreur en temps réel
- ✅ Gestion d'erreurs avec styling conditionnel

#### ChapterEditModal (`components/admin/modals/ChapterEditModal.jsx`)
- ✅ Validation Zod complète du formulaire
- ✅ Gestion centralisée des erreurs
- ✅ Validation des données avant soumission

#### EmailChangeModal (`components/modals/EmailChangeModal.jsx`)
- ✅ Validation Zod pour codes de vérification
- ✅ Validation des chiffres individuels
- ✅ Validation lors du collage de code

#### SearchDialog (`components/SearchDialog.jsx`)
- ✅ Validation Zod des requêtes de recherche
- ✅ Validation en temps réel
- ✅ Gestion d'erreurs avec feedback visuel
- ✅ Historique des recherches avec localStorage

### 🔧 Avantages de cette migration

1. **Sécurité renforcée** : Validation côté client plus robuste
2. **Messages d'erreur cohérents** : Tous en français et contextualisés
3. **Performance** : Validation optimisée avec cache
4. **Maintenabilité** : Schémas centralisés et réutilisables
5. **TypeScript-ready** : Prêt pour une migration TypeScript future
6. **Validation en temps réel** : Feedback immédiat pour l'utilisateur

### 📚 Utilisation

```javascript
// Validation simple
const validation = FormValidation.validateSearchQuery("ma recherche");
if (!validation.success) {
  console.error(validation.error);
}

// Validation en temps réel
const liveValidation = FormValidation.validateFieldLive(
  FormValidation.timeSchema, 
  "14:30"
);
if (!liveValidation.isValid) {
  setError(liveValidation.error);
}

// Validation de formulaire complet
const chapterValidation = FormValidation.validateChapter({
  chapterNumber: 1,
  title: "Mon chapitre",
  content: "Contenu du chapitre...",
  comment: "Commentaire optionnel"
});
```

Cette migration constitue une base solide pour l'évolutivité et la maintenance du projet. ✨

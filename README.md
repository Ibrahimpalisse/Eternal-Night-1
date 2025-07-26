# Night Novels - Setup

## Description
Night Novels est une plateforme de lecture de romans en ligne avec un système d'auteurs et de lecteurs.

## Structure du projet
- `frontend/` - Application React avec Vite
- `backend/` - API Node.js avec Express
- `database-structure.sql` - Structure de la base de données

## Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- MySQL/MariaDB
- XAMPP (optionnel, pour le développement local)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Configuration
1. Copiez `.env.example` vers `.env` dans le dossier backend
2. Configurez les variables d'environnement (base de données, JWT, etc.)
3. Importez `database-structure.sql` dans votre base de données MySQL

## Technologies utilisées
- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, MySQL, JWT
- **Base de données**: MySQL/MariaDB
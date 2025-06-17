# Guide de Configuration AWS S3 pour l'Upload d'Avatar

## 1. Variables d'environnement requises

Créez un fichier `.env` dans le dossier `backend/` avec ces variables :

```env
# Configuration AWS S3 (obligatoire pour l'upload d'avatar)
AWS_ACCESS_KEY_ID=votre_access_key_id
AWS_SECRET_ACCESS_KEY=votre_secret_access_key
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=eternal-night-avatars

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=eternal_night
DB_USER=votre_utilisateur_db
DB_PASSWORD=votre_mot_de_passe_db

# Configuration JWT
JWT_SECRET=votre_cle_secrete_jwt

# Configuration du serveur
PORT=4000
FRONTEND_URL=http://localhost:5173
```

## 2. Configuration AWS S3

### Étape 1: Créer un compte AWS
1. Allez sur [aws.amazon.com](https://aws.amazon.com)
2. Créez un compte ou connectez-vous

### Étape 2: Créer un bucket S3
1. Allez dans la console AWS S3
2. Cliquez sur "Create bucket"
3. Nom du bucket : `eternal-night-avatars` (ou votre choix)
4. Région : `eu-west-1` (ou votre choix)
5. Désactivez "Block all public access" pour permettre l'accès public aux avatars
6. Activez "ACLs" dans Object Ownership

### Étape 3: Configurer les permissions du bucket
Dans les permissions du bucket, ajoutez cette Bucket Policy :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::eternal-night-avatars/avatars/*"
        }
    ]
}
```

### Étape 4: Créer un utilisateur IAM
1. Allez dans IAM -> Users -> Create user
2. Nom : `eternal-night-app`
3. Attachez cette politique inline :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::eternal-night-avatars",
                "arn:aws:s3:::eternal-night-avatars/*"
            ]
        }
    ]
}
```

### Étape 5: Générer les clés d'accès
1. Dans l'utilisateur IAM créé, allez dans "Security credentials"
2. Cliquez sur "Create access key"
3. Choisissez "Application running outside AWS"
4. Copiez `Access key ID` et `Secret access key`

## 3. Test de configuration

Exécutez le script de test :

```bash
cd backend
node test-avatar-upload.js
```

Si tout est configuré correctement, vous devriez voir :
```
✅ Connexion S3 réussie
✅ Connexion base de données réussie
✅ Tous les tests passent. Le système devrait fonctionner.
```

## 4. Alternative : Configuration locale (pour développement)

Si vous ne voulez pas utiliser AWS S3 pour le développement, vous pouvez :

1. Installer MinIO (serveur S3 local)
2. Utiliser ces variables d'environnement :

```env
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=avatars
AWS_ENDPOINT=http://localhost:9000
AWS_FORCE_PATH_STYLE=true
```

## 5. Dépannage

### Erreur "NoSuchBucket"
- Vérifiez que le bucket existe
- Vérifiez que la région est correcte

### Erreur "AccessDenied"
- Vérifiez les permissions IAM
- Vérifiez la Bucket Policy

### Erreur "InvalidAccessKeyId"
- Vérifiez que les clés d'accès sont correctes
- Vérifiez qu'elles ne contiennent pas d'espaces

### Erreur "SignatureDoesNotMatch"
- Vérifiez la clé secrète
- Vérifiez que l'horloge système est correcte 
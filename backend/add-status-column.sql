-- Ajouter la colonne status à la table authors
ALTER TABLE authors ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER instagram_url;

-- Mettre à jour les auteurs existants pour qu'ils soient approuvés
UPDATE authors SET status = 'approved' WHERE status IS NULL OR status = 'pending'; 
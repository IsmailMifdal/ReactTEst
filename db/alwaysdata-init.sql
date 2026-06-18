-- ───────────────────────────────────────────────────────────────────────────
-- Script d'initialisation pour la base de PRODUCTION sur AlwaysData.
--
-- À importer via phpMyAdmin d'AlwaysData APRÈS avoir sélectionné ta base
-- (ex: <compte>_ynov_ci). On NE fait PAS de CREATE DATABASE / USE : la base
-- est déjà créée depuis le panneau AlwaysData.
--
-- L'administrateur est inséré directement (mot de passe déjà hashé en SHA-256),
-- identifiants : loise.fenoll@ynov.com / PvdrTAzTeR247sDnAZBr
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    date_naissance DATE,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    password VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrateur (SHA-256 de "PvdrTAzTeR247sDnAZBr")
INSERT INTO utilisateur (nom, prenom, email, password, is_admin)
VALUES (
    'Admin', 'Ynov', 'loise.fenoll@ynov.com',
    'c0920ea2b5454b9be5a70e5f9000cadffdd18159ed9a4c23bc6fa7d6b96a4e9e', TRUE
)
ON DUPLICATE KEY UPDATE email = email;

-- Quelques utilisateurs de démonstration
INSERT INTO utilisateur (nom, prenom, email, date_naissance, ville, code_postal, is_admin)
VALUES
    ('Martin', 'Alice', 'alice.martin@example.com', '1995-04-12', 'Paris', '75001', FALSE),
    ('Durand', 'Bob', 'bob.durand@example.com', '1990-09-30', 'Lyon', '69001', FALSE)
ON DUPLICATE KEY UPDATE email = email;

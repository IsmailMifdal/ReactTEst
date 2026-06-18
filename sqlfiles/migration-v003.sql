USE ynov_ci;

-- Quelques utilisateurs de démonstration (non admin)
INSERT INTO utilisateur (nom, prenom, email, date_naissance, ville, code_postal, is_admin)
VALUES
    ('Martin', 'Alice', 'alice.martin@example.com', '1995-04-12', 'Paris', '75001', FALSE),
    ('Durand', 'Bob', 'bob.durand@example.com', '1990-09-30', 'Lyon', '69001', FALSE)
AS new
ON DUPLICATE KEY UPDATE email = new.email;

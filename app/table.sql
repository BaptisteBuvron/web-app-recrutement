DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS FicheDePoste;
DROP TABLE IF EXISTS OffreDePoste;
DROP TABLE IF EXISTS Organisation;
DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Utilisateur;

-- --------------------------------------------------------

--
-- Structure de la table `JobDescription`
--

CREATE TABLE `FicheDePoste` (
        `numero` int(11) NOT NULL AUTO_INCREMENT,
        `status` varchar(64) NOT NULL,
        `responsable` varchar(64) NOT NULL,
        `type_metier` varchar(64) NOT NULL,
        `lieu` varchar(64) NOT NULL,
        `teletravail` tinyint(1) NOT NULL,
        `nb_heures` int(11) NOT NULL,
        `salaire` varchar(64) NOT NULL,
        `description` text NOT NULL,
        `siren` int(11) NOT NULL REFERENCES Organisation(siren),
        UNIQUE (siren),
        PRIMARY KEY (numero)
);

-- --------------------------------------------------------

--
-- Structure de la table `OffreDePoste`
--

CREATE TABLE `OffreDePoste` (
        `numero` int(11) NOT NULL AUTO_INCREMENT,
        `etat` varchar(64) NOT NULL CHECK (etat IN ('non publiée', 'publiée', 'expiré')),
        `date_validite` date NOT NULL,
        `nb_piece` int(11) NOT NULL,
        `liste_piece` text NOT NULL,
        `fiche` int(11) NOT NULL REFERENCES FicheDePoste(numero),
        PRIMARY KEY (numero)
);


-- --------------------------------------------------------

--
-- Structure de la table `Organisation`
--

CREATE TABLE `Organisation`
(
    `siren` int(11)      NOT NULL,
    `nom`   varchar(64)  NOT NULL,
    `type`  varchar(64)  NOT NULL,
    `siege` varchar(128) NOT NULL,
    PRIMARY KEY (siren)
);
--
-- Déchargement des données de la table `Organisation`
--

INSERT INTO `Organisation` (`siren`, `nom`, `type`, `siege`) VALUES
(123456, 'La banque', 'SARL', 'La défense'),
(3345, 'Carrefour', 'SCI', 'Reuil Malmaison');

-- --------------------------------------------------------

--
-- Structure de la table `Piece`
--

CREATE TABLE `Piece` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `nom` varchar(128) NOT NULL,
     `fichier` varchar(128) NOT NULL,
     `candidature` int(11) NOT NULL REFERENCES Candidature(candidat),
     PRIMARY KEY (id)
);

--
-- Déchargement des données de la table `Piece`
--

INSERT INTO `Piece` (`nom`, `fichier`, `candidature`) VALUES
('CV', 'CV_Soudarsane', 1),
('Lettre de motivation', 'LM_Soudarsane', 1),
('CV', 'CV_Rene', 2),
('Lettre de motivation', 'LM_Rene', 2);

-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
       `mail` varchar(128) NOT NULL,
       `nom` varchar(64) NOT NULL,
       `prenom` varchar(64) NOT NULL,
       `telephone` varchar(64) NOT NULL,
       `date_creation` date NOT NULL,
       `statut` tinyint(1) NOT NULL,
       `password` varchar(128) NOT NULL,
       `type` varchar(64) NOT NULL CHECK (type IN ('Candidat', 'Recruteur', 'Administrateur')),
       demande_organisation varchar(64)  CHECK (demande_organisation IN ('En cours', 'accepté', 'refusé')),
       `siren` int(11) REFERENCES Organisation(siren),
       PRIMARY KEY (mail),

       CHECK (
           ((demande_organisation = 'En cours' OR demande_organisation = 'accepté' OR type = 'Recruteur') AND siren IS NOT NULL)
           OR
           ((demande_organisation = 'refusé' OR type = 'Administrateur' OR type = 'Candidat') AND siren IS NULL)
        )
);

-- --------------------------------------------------------

--
-- Structure de la table `Candidature`
--

CREATE TABLE `Candidature` (
       `date_candidature` date NOT NULL,
       `candidat` int(11) NOT NULL REFERENCES Utilisateur(mail),
       `poste` int(11) NOT NULL REFERENCES OffreDePoste(numero),
       PRIMARY KEY (candidat, poste)
);

-- --------------------------------------------------------
#Insertion des données
INSERT INTO FicheDePoste VALUES (0, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, '2000', 'Description', 123456789);
INSERT INTO FicheDePoste VALUES (0, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, '2000', 'Description', 123456788);

INSERT INTO OffreDePoste VALUES (0, 'non publiée', '2020-12-31', 2, 'CV, LM', 1);
INSERT INTO OffreDePoste VALUES (0, 'non publiée', '2020-12-31', 2, 'CV, LM', 2);

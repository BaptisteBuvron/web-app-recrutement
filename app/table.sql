DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS FicheDePoste;
DROP TABLE IF EXISTS OffreDePoste;
DROP TABLE IF EXISTS Organisation;
DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Utilisateur;

-- --------------------------------------------------------

--
-- Structure de la table `FicheDePoste`
--

CREATE TABLE `FicheDePoste` (
        `numero` int(11) NOT NULL AUTO_INCREMENT,
        `status` varchar(64) NOT NULL,
        `responsable` varchar(64) NOT NULL,
        `type_metier` varchar(64) NOT NULL,
        `lieu` varchar(64) NOT NULL,
        `teletravail` tinyint(1) NOT NULL,
        `nbheure` int(11) NOT NULL,
        `salaire` varchar(64) NOT NULL,
        `description` text NOT NULL,
        PRIMARY KEY (numero)
);
INSERT INTO `FicheDePoste` (`numero`, `status`, `responsable`, `type_metier`, `lieu`, `teletravail`, `nbheure`, `salaire`, `description`) VALUES
                                                                                                                                              (1, '1', 'Henri', 'ingénieur', 'Dijon', 1, 35, '35k', 'Poste de développeur full stack chef de projet, etc ..\r\n'),
                                                                                                                                              (2, '1', 'Sébastien', 'Cadre Manager', 'Paris', 1, 35, '50-55k', 'Management equipe de 15 personnes\r\n');

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
        `siren` int(11) NOT NULL REFERENCES Organisation(siren),
        `fiche` int(11) NOT NULL REFERENCES FicheDePoste(numero),
        PRIMARY KEY (numero),
        UNIQUE (siren)
);
INSERT INTO `OffreDePoste` (`numero`, `etat`, `date_validite`, `nb_piece`, `liste_piece`, `siren`, `fiche`) VALUES
                                                                                                                (1, 'publiée', '2023-05-19', 2, 'CV LM', 123456, 1),
                                                                                                                (2, 'publiée', '2023-05-19', 2, 'CV LM', 3345, 2);

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

INSERT INTO `Piece` (`id`, `nom`, `fichier`, `candidature`) VALUES
(1, 'CV', 'CV_Soudarsane', 1),
(2, 'Lettre de motivation', 'LM_Soudarsane', 1),
(3, 'CV', 'CV_Rene', 2),
(4, 'Lettre de motivation', 'LM_Rene', 2);

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
       `demandeOrganisation` varchar(64)  CHECK (demandeOrganisation IN ('En cours', 'accepté', 'refusé')),
       `siren` int(11) REFERENCES Organisation(siren),
       PRIMARY KEY (mail),

       CHECK (
           ((demandeOrganisation = 'En cours' OR demandeOrganisation = 'accepté' OR type = 'Recruteur') AND siren IS NOT NULL)
           OR
           ((demandeOrganisation = 'refusé' OR type = 'Administrateur' OR type = 'Candidat') AND siren IS NULL)
        )
);
INSERT INTO `Utilisateur` (`mail`, `nom`, `prenom`, `telephone`, `date_creation`, `statut`, `password`, `type`, `demandeOrganisation`, `siren`) VALUES
    ('tsoudar21@gmail.com', 'Til', 'Sou', '0652645299', '2023-03-30', 1, 'truc', 'Candidat', NULL, NULL);
('rene@truc.com', 'Rene', 'Villiers', '0654245299', '2023-03-30', 1, 'machin', 'Candidat', NULL, NULL);

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
INSERT INTO `Candidature` (`date_candidature`, `candidat`, `poste`) VALUES
    ('2023-03-30', 1, 1);
('2023-03-30', 2, 2);


-- --------------------------------------------------------
#Insertion des données
INSERT INTO FicheDePoste VALUES (1, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, '2000', 'Description');
INSERT INTO FicheDePoste VALUES (2, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, '2000', 'Description');

INSERT INTO OffreDePoste VALUES (1, 'non publiée', '2020-12-31', 2, 'CV, LM', 123456789, 1);

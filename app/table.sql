DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS OffreDePoste;
DROP TABLE IF EXISTS FicheDePoste;
DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS Organisation;


-- --------------------------------------------------------

--
-- Structure de la table `Organisation`
--

CREATE TABLE `Organisation`
(
    `siren` varchar(11)  NOT NULL,
    `nom`   varchar(64)  NOT NULL,
    `type`  varchar(64)  NOT NULL,
    `siege` varchar(128) NOT NULL,
    PRIMARY KEY (siren)
);
--
-- Déchargement des données de la table `Organisation`
--

INSERT INTO `Organisation` (`siren`, `nom`, `type`, `siege`)
VALUES ('123456', 'La banque', 'SARL', 'La défense'),
       ('3345', 'Carrefour', 'SCI', 'Reuil Malmaison');


-- --------------------------------------------------------

--
-- Structure de la table `JobDescription`
--


CREATE TABLE `FicheDePoste`
(
    `numero`      int(11)     NOT NULL AUTO_INCREMENT,
    `status`      varchar(64) NOT NULL,
    `responsable` varchar(64) NOT NULL,
    `type_metier` varchar(64) NOT NULL,
    `lieu`        varchar(64) NOT NULL,
    `teletravail` tinyint(1)  NOT NULL,
    `nb_heures`   int(11)     NOT NULL,
    `salaire`     varchar(64) NOT NULL,
    `description` text        NOT NULL,
    `siren`       varchar(11) NOT NULL,
    FOREIGN KEY (siren) REFERENCES Organisation (siren),
    PRIMARY KEY (numero)
);

-- --------------------------------------------------------

--
-- Structure de la table `OffreDePoste`
--

CREATE TABLE `OffreDePoste`
(
    `numero`        int(11)     NOT NULL AUTO_INCREMENT,
    `etat`          varchar(64) NOT NULL CHECK (etat IN ('non publiée', 'publiée', 'expirée')),
    `date_validite` date        NOT NULL,
    `nb_piece`      int(11)     NOT NULL,
    `liste_piece`   text        NOT NULL,
    `fiche`         int(11)     NOT NULL,
    FOREIGN KEY (fiche) REFERENCES FicheDePoste (numero),
    PRIMARY KEY (numero)
);



-- --------------------------------------------------------

--
-- Structure de la table `Piece`
--


-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--


CREATE TABLE `Utilisateur`
(
    `email`              varchar(128) NOT NULL,
    `nom`                varchar(64)  NOT NULL,
    `prenom`             varchar(64)  NOT NULL,
    `telephone`          varchar(64)  NOT NULL,
    `date_creation`      date         NOT NULL,
    `statut`             tinyint(1)   NOT NULL,
    `password`           varchar(128) NOT NULL,
    `role`               varchar(64)  NOT NULL CHECK (role IN ('Candidat', 'Recruteur', 'Administrateur')),
    demande_organisation varchar(64) CHECK (demande_organisation IN ('En cours', 'accepté', 'refusé')),
    `siren`              varchar(11),
    FOREIGN KEY (siren) REFERENCES Organisation (siren),
    PRIMARY KEY (email),

    CHECK (
            ((demande_organisation = 'En cours' OR demande_organisation = 'accepté' OR role = 'Recruteur') AND
             siren IS NOT NULL)
            OR
            ((demande_organisation = 'refusé' OR role = 'Administrateur' OR role = 'Candidat') AND siren IS NULL)
        )
);

-- Utilisateur 1
INSERT INTO Utilisateur (email, nom, prenom, telephone, date_creation, statut, password, role, demande_organisation,
                         siren)
VALUES ('candidat1@example.com', 'Doe', 'John', '123456789', CURDATE(), 1, 'password123', 'Candidat', NULL, NULL);

-- Utilisateur 2
INSERT INTO Utilisateur (email, nom, prenom, telephone, date_creation, statut, password, role, demande_organisation,
                         siren)
VALUES ('candidat2@example.com', 'Smith', 'Jane', '987654321', CURDATE(), 1, 'password456', 'Candidat', NULL, NULL);


-- --------------------------------------------------------

--
-- Structure de la table `Candidature`
--

CREATE TABLE `Candidature`
(
    `date_candidature` date         NOT NULL,
    `candidat`         varchar(128) NOT NULL,
    `offre`            int(11)      NOT NULL,
    `statut`           ENUM ('En analyse', 'Acceptée', 'Refusée', 'En attente'),
    `motivation`       text         NOT NULL,
    FOREIGN KEY (candidat) REFERENCES Utilisateur (email),
    FOREIGN KEY (offre) REFERENCES OffreDePoste (numero),
    PRIMARY KEY (candidat, offre)
);

CREATE TABLE `Piece`
(
    `id`       int(11)      NOT NULL AUTO_INCREMENT,
    `nom`      varchar(128) NOT NULL,
    `url`      varchar(128) NOT NULL,
    `candidat` varchar(128) NOT NULL,
    `offre`    int(11)      NOT NULL,
    FOREIGN KEY (candidat, offre) REFERENCES Candidature (candidat, offre),
    PRIMARY KEY (id)
);

--
-- Déchargement des données de la table `Piece`
--



-- --------------------------------------------------------
#Insertion des données

INSERT INTO FicheDePoste
VALUES (0, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, '2000', 'Description', '123456');
INSERT INTO FicheDePoste
VALUES (0, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, '2000', 'Description', '3345');

INSERT INTO OffreDePoste
VALUES (0, 'non publiée', '2020-12-31', 2, 'CV, LM', 1);
INSERT INTO OffreDePoste
VALUES (0, 'non publiée', '2020-12-31', 2, 'CV, LM', 2);

INSERT INTO Utilisateur
VALUES ('tsoudar21@gmail.com', 'Tillai', 'Soudarsane', '0652645299', '2020-10-10', 1, 'mdp', 'Candidat', NULL, 123456);

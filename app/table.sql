DROP TABLE IF EXISTS Candidature;
DROP TABLE IF EXISTS FicheDePoste;
DROP TABLE IF EXISTS OffreDePoste;
DROP TABLE IF EXISTS Organisation;
DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Utilisateur;

-- --------------------------------------------------------

--
-- Structure de la table `Candidature`
--

CREATE TABLE `Candidature` (
       `date_candidature` date NOT NULL,
       `candidat` int(11) NOT NULL REFERENCES Utilisateur(mail),
       `poste` int(11) NOT NULL REFERENCES OffreDePoste(numero),
       PRIMARY KEY (candidat, poste),
       CHECK (Utilisateur.type = 'Candidat')
);

-- --------------------------------------------------------

--
-- Structure de la table `FicheDePoste`
--

CREATE TABLE `FicheDePoste` (
        `numero` int(11) NOT NULL,
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

-- --------------------------------------------------------

--
-- Structure de la table `OffreDePoste`
--

CREATE TABLE `OffreDePoste` (
        `numero` int(11) NOT NULL,
        `etat` varchar(64) NOT NULL CHECK (etat IN ('non publiée', 'publiée', 'expiré'),
        `date_validite` date NOT NULL,
        `nb_piece` int(11) NOT NULL,
        `liste_piece` text NOT NULL,
        `siren` int(11) NOT NULL REFERENCES Organisation(siren),
        `fiche` int(11) NOT NULL REFERENCES FicheDePoste(numero),
        PRIMARY KEY (numero),
        UNIQUE (siren)
);

-- --------------------------------------------------------

--
-- Structure de la table `Organisation`
--

CREATE TABLE `Organisation` (
    `siren` int(11) NOT NULL,
    `nom` varchar(64) NOT NULL,
    `type` varchar(64) NOT NULL,
    `siege` varchar(128) NOT NULL,
    PRIMARY KEY (siren)
);

-- --------------------------------------------------------

--
-- Structure de la table `Piece`
--

CREATE TABLE `Piece` (
     `id` int(11) NOT NULL,
     `nom` varchar(128) NOT NULL,
     `fichier` varchar(128) NOT NULL,
     `candidature` int(11) NOT NULL REFERENCES Candidature(candidat),
     PRIMARY KEY (id)
);

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
           ((demandeOrganisation = 'En cours' OR demandeOrganisation = 'accepté' OR type = 'Recruteur') AND siren NOT NULL)
           OR
           ((demandeOrganisation = 'refusé' OR type = 'Administrateur' OR type = 'Candidat') AND siren NULL)
        )
);

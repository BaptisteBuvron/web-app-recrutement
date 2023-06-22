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
    `salaire`     int(11)     NOT NULL,
    `description` text        NOT NULL,
    `siren`       varchar(11) NOT NULL,
    FOREIGN KEY (siren) REFERENCES Organisation (siren) ON DELETE CASCADE,
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
    FOREIGN KEY (fiche) REFERENCES FicheDePoste (numero) ON DELETE CASCADE,
    PRIMARY KEY (numero)
);


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
    demande_organisation varchar(64) CHECK (demande_organisation IN ('En cours', 'acceptation', 'refus')),
    `siren`              varchar(11),
    FOREIGN KEY (siren) REFERENCES Organisation (siren),
    PRIMARY KEY (email),

    CHECK (
            ((demande_organisation = 'En cours' OR demande_organisation = 'acceptation' OR role = 'Recruteur') AND
             siren IS NOT NULL)
            OR
            ((demande_organisation = 'refus' OR role = 'Administrateur' OR role = 'Candidat'))
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
    FOREIGN KEY (candidat) REFERENCES Utilisateur (email) ON DELETE CASCADE,
    FOREIGN KEY (offre) REFERENCES OffreDePoste (numero) ON DELETE CASCADE,
    PRIMARY KEY (candidat, offre)
    ##cascade delete for candidat and offre

);


-- --------------------------------------------------------

--
-- Structure de la table `Piece`
--


CREATE TABLE `Piece`
(
    `id`       int(11)      NOT NULL AUTO_INCREMENT,
    `nom`      varchar(128) NOT NULL,
    `url`      varchar(128) NOT NULL,
    `candidat` varchar(128) NOT NULL,
    `offre`    int(11)      NOT NULL,
    FOREIGN KEY (candidat, offre) REFERENCES Candidature (candidat, offre) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

--
-- Déchargement des données de la table `Piece`
--

-- --------------------------------------------------------
#Insertion des données


INSERT INTO `Organisation` (`siren`, `nom`, `type`, `siege`)
VALUES ('123456', 'La banque', 'SARL', 'La défense'),
       ('3345', 'Carrefour', 'SCI', 'Reuil Malmaison');

INSERT INTO FicheDePoste
VALUES (0, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, 2000, 'Description', '123456');
INSERT INTO FicheDePoste
VALUES (0, 'En cours', 'Joe Doe', 'Développeur', 'Paris', 1, 35, 2000, 'Description', '3345');

INSERT INTO OffreDePoste
VALUES (0, 'non publiée', '2020-12-31', 2, 'CV, LM', 1);
INSERT INTO OffreDePoste
VALUES (0, 'non publiée', '2020-12-31', 2, 'CV, LM', 2);

-- Insertion des organisations
INSERT INTO Organisation (siren, nom, type, siege)
VALUES ('123456789', 'Acme Corporation', 'Technologie', 'Paris'),
       ('987654321', 'Global Industries', 'Industrie', 'New York'),
       ('567890123', 'Green Solutions', 'Environnement', 'Londres');

-- Insertion des fiches de poste pour Organisation A
INSERT INTO FicheDePoste (status, responsable, type_metier, lieu, teletravail, nb_heures, salaire, description, siren)
VALUES ('Ouverte', 'John Doe', 'Développeur Web', 'Paris', 1, 40, 50000,
        'Nous recherchons un développeur web expérimenté pour rejoindre notre équipe dynamique chez Acme Corporation. Le candidat idéal aura une solide expérience en développement front-end et back-end, ainsi qu\'une connaissance approfondie des langages de programmation tels que HTML, CSS, JavaScript et PHP. Vous serez responsable de la conception, du développement et de la maintenance de nos applications web, en travaillant en étroite collaboration avec les autres membres de l\'équipe.',
        '123456789'),
       ('Ouverte', 'Jane Smith', 'Ingénieur Logiciel', 'Paris', 0, 35, 60000,
        'Acme Corporation recherche un ingénieur logiciel passionné pour contribuer à la conception et au développement de nos produits logiciels. Vous serez responsable de la création de spécifications techniques, de la résolution de problèmes complexes et de l\'optimisation des performances des logiciels. Le candidat idéal aura une solide expérience en développement logiciel, une connaissance approfondie des langages de programmation tels que Java et C++, et une aptitude à travailler en équipe.',
        '123456789'),
       ('Fermée', 'Mark Johnson', 'Analyste financier', 'Paris', 1, 30, 45000,
        'Nous recherchons un analyste financier expérimenté pour rejoindre notre équipe chez Acme Corporation. Vos responsabilités comprendront l\'analyse des données financières, l\'évaluation des performances passées et la projection des résultats futurs. Le candidat idéal aura une solide compréhension des concepts financiers, une connaissance approfondie des outils d\'analyse financière et une capacité à fournir des recommandations stratégiques basées sur les résultats de l\'analyse.',
        '123456789'),
       ('Ouverte', 'Emily Wilson', 'Chef de projet', 'Paris', 1, 25, 55000,
        'Acme Corporation recherche un chef de projet talentueux pour superviser la planification, la mise en \œuvre et l\'exécution de nos projets. Vous serez responsable de la gestion de l\'équipe, de l\'affectation des ressources, du suivi des délais et de la communication avec les parties prenantes. Le candidat idéal aura une expérience avérée en gestion de projet, une solide compétence en leadership et une excellente capacité à résoudre les problèmes.',
        '123456789'),
       ('Ouverte', 'Daniel Brown', 'Spécialiste en marketing', 'Paris', 0, 20, 40000,
        'Acme Corporation cherche un spécialiste en marketing créatif pour développer et exécuter des stratégies de marketing innovantes. Vos responsabilités incluront la création de campagnes publicitaires, la gestion des médias sociaux, l\'analyse des données marketing et la collaboration avec les équipes internes pour atteindre les objectifs de vente et de notoriété de la marque. Le candidat idéal aura une connaissance approfondie du marketing numérique, des compétences en création de contenu et une capacité à travailler dans un environnement dynamique.',
        '123456789');

-- Insertion des fiches de poste pour Organisation B
INSERT INTO FicheDePoste (status, responsable, type_metier, lieu, teletravail, nb_heures, salaire, description, siren)
VALUES ('Ouverte', 'Sarah Davis', 'Développeur Java', 'New York', 1, 40, 55000,
        'Global Industries est à la recherche d\'un développeur Java expérimenté pour rejoindre notre équipe talentueuse. Vous serez responsable du développement et de la maintenance de nos applications basées sur Java, ainsi que de la résolution des problèmes complexes et de l\'optimisation des performances. Le candidat idéal aura une solide expérience en développement Java, une connaissance approfondie des frameworks tels que Spring et Hibernate, et une passion pour la création de logiciels de qualité.',
        '987654321'),
       ('Ouverte', 'Michael Wilson', 'Analyste de données', 'New York', 0, 35, 60000,
        'Global Industries recherche un analyste de données compétent pour contribuer à l\'extraction, à l\'analyse et à l\'interprétation des données afin de fournir des informations exploitables à l\'entreprise. Vous serez responsable de la création de modèles analytiques, de la visualisation des données et de la génération de rapports pour soutenir la prise de décision stratégique. Le candidat idéal aura une solide expérience en analyse de données, une maîtrise des outils d\'analyse et une capacité à communiquer efficacement les résultats.',
        '987654321'),
       ('Ouverte', 'Jessica Taylor', 'Designer graphique', 'New York', 1, 30, 45000,
        'Nous recherchons un designer graphique créatif pour rejoindre notre équipe de design chez Global Industries. Vos responsabilités comprendront la création d\'éléments visuels attrayants, tels que des illustrations, des infographies et des maquettes, en utilisant des outils de conception graphique tels que Adobe Photoshop et Illustrator. Le candidat idéal aura une solide expérience en design graphique, une créativité exceptionnelle et une sensibilité esthétique.',
        '987654321'),
       ('Fermée', 'Andrew Clark', 'Gestionnaire de projet', 'New York', 1, 25, 50000,
        'Global Industries recherche un gestionnaire de projet expérimenté pour diriger et coordonner la réalisation de nos projets. Vous serez responsable de la planification, de l\'exécution et du suivi des projets, en veillant à ce qu\'ils respectent les délais, les budgets et les exigences de qualité. Le candidat idéal aura une solide expérience en gestion de projet, d\'excellentes compétences en leadership et une capacité à gérer efficacement les ressources.',
        '987654321'),
       ('Fermée', 'Olivia Green', 'Spécialiste en sécurité informatique', 'New York', 0, 20, 55000,
        'Global Industries est à la recherche d\'un spécialiste en sécurité informatique compétent pour protéger nos systèmes et données contre les menaces. Vous serez responsable de l\'évaluation des vulnérabilités, de la mise en place de mesures de sécurité, de la surveillance des activités suspectes et de la sensibilisation à la sécurité auprès du personnel. Le candidat idéal aura une solide expérience en sécurité informatique, une connaissance approfondie des normes et des outils de sécurité, et une capacité à rester à jour sur les dernières tendances en matière de sécurité.',
        '987654321');

-- Insertion des fiches de poste pour Organisation C
INSERT INTO FicheDePoste (status, responsable, type_metier, lieu, teletravail, nb_heures, salaire, description, siren)
VALUES ('Fermée', 'Robert Johnson', 'Ingénieur en énergies renouvelables', 'Londres', 1, 30, 50000,
        'Green Solutions est à la recherche d\'un ingénieur en énergies renouvelables pour contribuer à la conception et à la mise en œuvre de solutions durables. Vous serez responsable de l\'évaluation des ressources énergétiques, de la planification des projets et de la supervision de l\'installation des équipements. Le candidat idéal aura une solide expertise en énergies renouvelables, une compréhension des technologies telles que l\'énergie solaire et éolienne, et un engagement envers la préservation de l\'environnement.',
        '567890123'),
       ('Ouverte', 'Sophia Roberts', 'Spécialiste en développement durable', 'Londres', 1, 25, 45000,
        'Green Solutions recherche un spécialiste en développement durable pour promouvoir des pratiques respectueuses de l\'environnement au sein de notre organisation. Vous serez responsable de l\'élaboration et de la mise en œuvre de stratégies de durabilité, de l\'évaluation des impacts environnementaux et de la sensibilisation aux enjeux environnementaux. Le candidat idéal aura une solide compréhension du développement durable, une connaissance des réglementations environnementales et une capacité à influencer positivement le comportement des employés et des partenaires.',
        '567890123'),
       ('Fermée', 'Alexander Brown', 'Analyste en gestion de l\'eau', 'Londres', 0, 20, 40000,
        'Green Solutions recherche un analyste en gestion de l\'eau pour évaluer l\'utilisation de l\'eau, identifier les opportunités d\'efficacité et proposer des solutions durables. Vos responsabilités comprendront l\'analyse des données sur l\'utilisation de l\'eau, la réalisation d\'études de faisabilité et la recommandation de pratiques d\'utilisation responsable de l\'eau. Le candidat idéal aura une expertise en gestion de l\'eau, une connaissance des technologies et des politiques liées à la gestion de l\'eau, et un intérêt pour la préservation des ressources en eau.',
        '567890123');

-- Insertion des offres de poste pour les fiches de poste de l'Organisation A
INSERT INTO OffreDePoste (etat, date_validite, nb_piece, liste_piece, fiche)
VALUES ('Publiée', '2023-06-30', 2, 'Lettre de motivation, CV', 3),
       ('Non publiée', '2023-06-25', 1, 'CV', 4),
       ('Publiée', '2023-06-28', 3, 'Lettre de motivation, CV, Références', 5),
       ('Non publiée', '2023-06-23', 2, 'Lettre de motivation, CV', 6),
       ('Non publiée', '2023-06-26', 1, 'CV', 7);

-- Insertion des offres de poste pour les fiches de poste de l'Organisation B
INSERT INTO OffreDePoste (etat, date_validite, nb_piece, liste_piece, fiche)
VALUES ('Non publiée', '2023-06-25', 2, 'Lettre de motivation, CV', 8),
       ('Publiée', '2023-06-30', 1, 'CV', 9),
       ('Non publiée', '2023-06-23', 2, 'Lettre de motivation, CV', 10),
       ('Publiée', '2023-06-28', 3, 'Lettre de motivation, CV, Références', 11),
       ('Non publiée', '2023-06-26', 1, 'CV', 12);

-- Insertion des offres de poste pour les fiches de poste de l'Organisation C
INSERT INTO OffreDePoste (etat, date_validite, nb_piece, liste_piece, fiche)
VALUES ('Publiée', '2023-06-30', 2, 'Lettre de motivation, CV', 13),
       ('Non publiée', '2023-06-25', 1, 'CV', 14),
       ('Publiée', '2023-06-28', 3, 'Lettre de motivation, CV, Références', 15);

INSERT INTO recrutement.Utilisateur (email, nom, prenom, telephone, date_creation, statut, password, role,
                                     demande_organisation, siren)
VALUES ('admin@gmail.com', 'admin', 'admin', '060606060606', '2023-06-22', 1,
        '$2b$10$.OeaoEtUOh290X2k.XE4pupqehMqM/bQe7EOLgrbgWxzXodVPKc0.', 'Administrateur', null, null);
INSERT INTO recrutement.Utilisateur (email, nom, prenom, telephone, date_creation, statut, password, role,
                                     demande_organisation, siren)
VALUES ('recruteur@gmail.com', 'recruteur', 'recruteur', '0606060606', '2023-06-22', 1,
        '$2b$10$bDBqTsUJTV53pXMcHdA1iOEfe/rbQHaQtHimjOjbDQiIndujsGuc2', 'Recruteur', 'acceptation', '567890123');
INSERT INTO recrutement.Utilisateur (email, nom, prenom, telephone, date_creation, statut, password, role,
                                     demande_organisation, siren)
VALUES ('candidat@gmail.com', 'candidat', 'candidat', '0606060606', '2023-06-22', 1,
        '$2b$10$bDBqTsUJTV53pXMcHdA1iOEfe/rbQHaQtHimjOjbDQiIndujsGuc2', 'Candidat', null, null);
INSERT INTO recrutement.Utilisateur (email, nom, prenom, telephone, date_creation, statut, password, role,
                                     demande_organisation, siren)
VALUES ('candidat2@gmail.com', 'candidat2', 'candidat2', '0606060606', '2023-06-22', 1,
        '$2b$10$bDBqTsUJTV53pXMcHdA1iOEfe/rbQHaQtHimjOjbDQiIndujsGuc2', 'Candidat', null, null);

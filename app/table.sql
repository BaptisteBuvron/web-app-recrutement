-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 30 mars 2023 à 14:58
-- Version du serveur :  10.3.29-MariaDB-0+deb10u1
-- Version de PHP : 7.3.29-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ai16p003`
--

-- --------------------------------------------------------

--
-- Structure de la table `Candidature`
--

CREATE TABLE `Candidature` (
  `date_candidature` date NOT NULL,
  `candidat` int(11) NOT NULL,
  `poste` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `Candidature`
--

INSERT INTO `Candidature` (`date_candidature`, `candidat`, `poste`) VALUES
('2023-03-30', 1, 1);
('2023-03-30', 2, 2);

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
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `FicheDePoste`
--

INSERT INTO `FicheDePoste` (`numero`, `status`, `responsable`, `type_metier`, `lieu`, `teletravail`, `nbheure`, `salaire`, `description`) VALUES
(1, '1', 'Henri', 'ingénieur', 'Dijon', 1, 35, '35k', 'Poste de développeur full stack chef de projet, etc ..\r\n'),
(2, '1', 'Sébastien', 'Cadre Manager', 'Paris', 1, 35, '50-55k', 'Management equipe de 15 personnes\r\n');

-- --------------------------------------------------------

--
-- Structure de la table `OffreDePoste`
--

CREATE TABLE `OffreDePoste` (
  `numero` int(11) NOT NULL,
  `etat` varchar(64) NOT NULL CHECK (`etat` in ('non publiée','publiée','expiré')),
  `date_validite` date NOT NULL,
  `nb_piece` int(11) NOT NULL,
  `liste_piece` text NOT NULL,
  `siren` int(11) NOT NULL,
  `fiche` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `OffreDePoste`
--

INSERT INTO `OffreDePoste` (`numero`, `etat`, `date_validite`, `nb_piece`, `liste_piece`, `siren`, `fiche`) VALUES
(1, 'publiée', '2023-05-19', 2, 'CV LM', 123456, 1),
(2, 'publiée', '2023-05-19', 2, 'CV LM', 3345, 2);

-- --------------------------------------------------------

--
-- Structure de la table `Organisation`
--

CREATE TABLE `Organisation` (
  `siren` int(11) NOT NULL,
  `nom` varchar(64) NOT NULL,
  `type` varchar(64) NOT NULL,
  `siege` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `id` int(11) NOT NULL,
  `nom` varchar(128) NOT NULL,
  `fichier` varchar(128) NOT NULL,
  `candidature` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `type` varchar(64) NOT NULL CHECK (`type` in ('Candidat','Recruteur','Administrateur')),
  `demandeOrganisation` varchar(64) DEFAULT NULL CHECK (`demandeOrganisation` in ('En cours','accepté','refusé')),
  `siren` int(11) DEFAULT NULL
) ;

--
-- Déchargement des données de la table `Utilisateur`
--

INSERT INTO `Utilisateur` (`mail`, `nom`, `prenom`, `telephone`, `date_creation`, `statut`, `password`, `type`, `demandeOrganisation`, `siren`) VALUES
('tsoudar21@gmail.com', 'Til', 'Sou', '0652645299', '2023-03-30', 1, 'truc', 'Candidat', NULL, NULL);
('rene@truc.com', 'Rene', 'Villiers', '0654245299', '2023-03-30', 1, 'machin', 'Candidat', NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Candidature`
--
ALTER TABLE `Candidature`
  ADD PRIMARY KEY (`candidat`,`poste`);

--
-- Index pour la table `FicheDePoste`
--
ALTER TABLE `FicheDePoste`
  ADD PRIMARY KEY (`numero`);

--
-- Index pour la table `OffreDePoste`
--
ALTER TABLE `OffreDePoste`
  ADD PRIMARY KEY (`numero`),
  ADD UNIQUE KEY `siren` (`siren`);

--
-- Index pour la table `Organisation`
--
ALTER TABLE `Organisation`
  ADD PRIMARY KEY (`siren`);

--
-- Index pour la table `Piece`
--
ALTER TABLE `Piece`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`mail`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

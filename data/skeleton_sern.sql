-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  lun. 30 jan. 2023 à 13:28
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `skeleton_sern`
--

-- --------------------------------------------------------

--
-- Structure de la table `elements`
--

DROP TABLE IF EXISTS `elements`;
CREATE TABLE IF NOT EXISTS `elements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `rank` varchar(255) DEFAULT NULL,
  `activated` tinyint(1) DEFAULT NULL,
  `availability_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `budget_line` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `elements`
--

INSERT INTO `elements` (`id`, `username`, `rank`, `activated`, `availability_date`, `end_date`, `createdAt`, `updatedAt`, `budget_line`) VALUES
(19, 'Regis', 'rank_A', 1, '2004-09-01', '2023-09-01', '2023-01-24 13:45:15', '2023-01-26 13:51:44', 'PUPH0001'),
(20, 'Florent', 'rank_B', 1, '2023-09-01', '2043-08-31', '2023-01-24 14:06:49', '2023-01-24 15:43:18', 'MCUPH0001'),
(21, 'Bertrand', 'rank_A', 1, '2004-09-01', '2024-09-01', '2023-01-24 14:09:07', '2023-01-26 13:52:23', 'PUPH0002'),
(22, 'Guillaume', 'rank_B', 1, '2024-09-01', '2044-09-01', '2023-01-24 14:09:59', '2023-01-24 15:43:28', 'MCUPH0002'),
(23, 'Laure', 'rank_B', 1, '2022-09-01', '2041-09-01', '2023-01-26 08:41:52', '2023-01-26 08:43:34', 'MCUPH0003'),
(24, 'Claudette', 'rank_A', 1, '1995-09-01', '2023-09-01', '2023-01-26 08:43:18', '2023-01-26 08:43:38', 'PUPH0003'),
(25, 'Yann', 'rank_B', 1, '2023-09-01', '2045-09-01', '2023-01-30 12:43:18', '2023-01-30 12:43:29', 'MCUPH004');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

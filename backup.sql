-- MySQL dump 10.13  Distrib 9.6.0, for macos26.3 (arm64)
--
-- Host: localhost    Database: WatchFinderDB
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '5eb74278-2e4a-11f1-b008-e67fc972df07:1-246';

--
-- Table structure for table `ADMINS`
--

DROP TABLE IF EXISTS `ADMINS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADMINS` (
  `AdminID` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `AdminID` (`AdminID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMINS`
--

LOCK TABLES `ADMINS` WRITE;
/*!40000 ALTER TABLE `ADMINS` DISABLE KEYS */;
INSERT INTO `ADMINS` VALUES (1),(2);
/*!40000 ALTER TABLE `ADMINS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AVAILABLE_IN`
--

DROP TABLE IF EXISTS `AVAILABLE_IN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AVAILABLE_IN` (
  `MediaID` bigint unsigned NOT NULL,
  `CountryName` varchar(80) NOT NULL,
  PRIMARY KEY (`MediaID`,`CountryName`),
  KEY `CountryName` (`CountryName`),
  CONSTRAINT `available_in_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE,
  CONSTRAINT `available_in_ibfk_2` FOREIGN KEY (`CountryName`) REFERENCES `REGIONS` (`CountryName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AVAILABLE_IN`
--

LOCK TABLES `AVAILABLE_IN` WRITE;
/*!40000 ALTER TABLE `AVAILABLE_IN` DISABLE KEYS */;
INSERT INTO `AVAILABLE_IN` VALUES (1,'Canada'),(2,'Canada'),(4,'Canada'),(12,'Canada'),(13,'Canada'),(2,'Japan'),(1,'USA'),(3,'USA'),(4,'USA'),(6,'USA'),(12,'USA'),(13,'USA');
/*!40000 ALTER TABLE `AVAILABLE_IN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IS_ADMIN`
--

DROP TABLE IF EXISTS `IS_ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IS_ADMIN` (
  `Email` varchar(255) NOT NULL,
  `AdminID` bigint unsigned NOT NULL,
  PRIMARY KEY (`Email`,`AdminID`),
  KEY `AdminID` (`AdminID`),
  CONSTRAINT `is_admin_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `USERS` (`Email`) ON DELETE CASCADE,
  CONSTRAINT `is_admin_ibfk_2` FOREIGN KEY (`AdminID`) REFERENCES `ADMINS` (`AdminID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IS_ADMIN`
--

LOCK TABLES `IS_ADMIN` WRITE;
/*!40000 ALTER TABLE `IS_ADMIN` DISABLE KEYS */;
INSERT INTO `IS_ADMIN` VALUES ('john2@email.com',1);
/*!40000 ALTER TABLE `IS_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MANAGES`
--

DROP TABLE IF EXISTS `MANAGES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MANAGES` (
  `MediaID` bigint unsigned NOT NULL,
  `AdminID` bigint unsigned NOT NULL,
  PRIMARY KEY (`MediaID`,`AdminID`),
  KEY `AdminID` (`AdminID`),
  CONSTRAINT `manages_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE,
  CONSTRAINT `manages_ibfk_2` FOREIGN KEY (`AdminID`) REFERENCES `ADMINS` (`AdminID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MANAGES`
--

LOCK TABLES `MANAGES` WRITE;
/*!40000 ALTER TABLE `MANAGES` DISABLE KEYS */;
INSERT INTO `MANAGES` VALUES (1,1),(2,1),(3,1),(4,2),(6,2);
/*!40000 ALTER TABLE `MANAGES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MEDIA_GENRES`
--

DROP TABLE IF EXISTS `MEDIA_GENRES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MEDIA_GENRES` (
  `MediaID` bigint unsigned NOT NULL,
  `Genre` varchar(80) NOT NULL,
  PRIMARY KEY (`MediaID`,`Genre`),
  CONSTRAINT `media_genres_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MEDIA_GENRES`
--

LOCK TABLES `MEDIA_GENRES` WRITE;
/*!40000 ALTER TABLE `MEDIA_GENRES` DISABLE KEYS */;
INSERT INTO `MEDIA_GENRES` VALUES (1,'Adventure'),(1,'Fantasy'),(2,'Action'),(2,'Dark Fantasy'),(3,'Crime'),(3,'Mystery'),(3,'Thriller'),(4,'Drama'),(6,'Adventure'),(6,'Epic'),(6,'Sci-Fi');
/*!40000 ALTER TABLE `MEDIA_GENRES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MEDIA_TITLES`
--

DROP TABLE IF EXISTS `MEDIA_TITLES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MEDIA_TITLES` (
  `MediaID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `TitleName` varchar(255) NOT NULL,
  `ReleaseYear` year DEFAULT NULL,
  `Creator` varchar(255) DEFAULT NULL,
  `AgeRating` varchar(10) DEFAULT NULL,
  `Rating` decimal(3,1) DEFAULT NULL,
  `Description` text,
  `Image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MediaID`),
  UNIQUE KEY `MediaID` (`MediaID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MEDIA_TITLES`
--

LOCK TABLES `MEDIA_TITLES` WRITE;
/*!40000 ALTER TABLE `MEDIA_TITLES` DISABLE KEYS */;
INSERT INTO `MEDIA_TITLES` VALUES (1,'Avatar: The Last Airbender',2005,'Michael Dante DiMartino','TV-Y7-FV',9.3,'In a war-torn world of elemental powers, a young boy reawakens to undertake a dangerous mystic quest to fulfill his destiny as the Avatar, and bring peace to the world.',NULL),(2,'Attack on Titan',2013,'Yasuko Kobayashi','TV-MA',9.1,'In a world where humanity shelters behind towering walls from man-eating Titans, a determined teen joins the elite Survey Corps to fight the giants and uncover the secrets of their origin.',NULL),(3,'Sherlock',2010,'Mark Gatiss','TV-14',9.0,'In modern-day London, brilliant but eccentric detective Sherlock Holmes teams with war veteran Dr. John Watson to crack baffling crimes, outwit formidable foes, and aid Scotland Yard with razor-sharp deduction.',NULL),(4,'The Shawshank Redemption',1994,'Frank Darabont','R',9.3,'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.',NULL),(6,'Interstellar',2014,'Christopher Nolan','PG-13',8.7,'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',NULL),(12,'The Bear',2022,'Christopher Storer','TV-MA',8.6,'A chef returns home to run a family sandwich shop.',NULL),(13,'Stranger Things',2016,'The Duffer Brothers','TV-14',8.7,'When a young boy disappears, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.','media_13.jpg');
/*!40000 ALTER TABLE `MEDIA_TITLES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MOVIES`
--

DROP TABLE IF EXISTS `MOVIES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MOVIES` (
  `MediaID` bigint unsigned NOT NULL,
  `Duration` smallint unsigned NOT NULL,
  PRIMARY KEY (`MediaID`),
  CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MOVIES`
--

LOCK TABLES `MOVIES` WRITE;
/*!40000 ALTER TABLE `MOVIES` DISABLE KEYS */;
INSERT INTO `MOVIES` VALUES (4,142),(6,169);
/*!40000 ALTER TABLE `MOVIES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OFFERED_BY`
--

DROP TABLE IF EXISTS `OFFERED_BY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OFFERED_BY` (
  `MediaID` bigint unsigned NOT NULL,
  `StreamingServiceName` varchar(255) NOT NULL,
  PRIMARY KEY (`MediaID`,`StreamingServiceName`),
  KEY `StreamingServiceName` (`StreamingServiceName`),
  CONSTRAINT `offered_by_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE,
  CONSTRAINT `offered_by_ibfk_2` FOREIGN KEY (`StreamingServiceName`) REFERENCES `STREAMING_SERVICES` (`StreamingServiceName`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OFFERED_BY`
--

LOCK TABLES `OFFERED_BY` WRITE;
/*!40000 ALTER TABLE `OFFERED_BY` DISABLE KEYS */;
INSERT INTO `OFFERED_BY` VALUES (6,'Disney+'),(12,'Disney+'),(12,'Hulu'),(1,'Netflix'),(2,'Netflix'),(13,'Netflix'),(3,'Prime Video'),(4,'Prime Video'),(13,'Prime Video');
/*!40000 ALTER TABLE `OFFERED_BY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OPERATES_IN`
--

DROP TABLE IF EXISTS `OPERATES_IN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OPERATES_IN` (
  `StreamingServiceName` varchar(255) NOT NULL,
  `CountryName` varchar(80) NOT NULL,
  PRIMARY KEY (`StreamingServiceName`,`CountryName`),
  KEY `CountryName` (`CountryName`),
  CONSTRAINT `operates_in_ibfk_1` FOREIGN KEY (`StreamingServiceName`) REFERENCES `STREAMING_SERVICES` (`StreamingServiceName`) ON DELETE CASCADE,
  CONSTRAINT `operates_in_ibfk_2` FOREIGN KEY (`CountryName`) REFERENCES `REGIONS` (`CountryName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OPERATES_IN`
--

LOCK TABLES `OPERATES_IN` WRITE;
/*!40000 ALTER TABLE `OPERATES_IN` DISABLE KEYS */;
INSERT INTO `OPERATES_IN` VALUES ('Netflix','Canada'),('Prime Video','Canada'),('Netflix','USA');
/*!40000 ALTER TABLE `OPERATES_IN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REGIONS`
--

DROP TABLE IF EXISTS `REGIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REGIONS` (
  `CountryName` varchar(80) NOT NULL,
  PRIMARY KEY (`CountryName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REGIONS`
--

LOCK TABLES `REGIONS` WRITE;
/*!40000 ALTER TABLE `REGIONS` DISABLE KEYS */;
INSERT INTO `REGIONS` VALUES ('Canada'),('France'),('Japan'),('UK'),('USA');
/*!40000 ALTER TABLE `REGIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOWS`
--

DROP TABLE IF EXISTS `SHOWS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOWS` (
  `MediaID` bigint unsigned NOT NULL,
  `NumberOfSeasons` tinyint unsigned NOT NULL,
  PRIMARY KEY (`MediaID`),
  CONSTRAINT `shows_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOWS`
--

LOCK TABLES `SHOWS` WRITE;
/*!40000 ALTER TABLE `SHOWS` DISABLE KEYS */;
INSERT INTO `SHOWS` VALUES (1,3),(2,5),(3,4),(12,3),(13,5);
/*!40000 ALTER TABLE `SHOWS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STREAMING_SERVICES`
--

DROP TABLE IF EXISTS `STREAMING_SERVICES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `STREAMING_SERVICES` (
  `StreamingServiceName` varchar(255) NOT NULL,
  `WebsiteURL` varchar(255) NOT NULL,
  PRIMARY KEY (`StreamingServiceName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STREAMING_SERVICES`
--

LOCK TABLES `STREAMING_SERVICES` WRITE;
/*!40000 ALTER TABLE `STREAMING_SERVICES` DISABLE KEYS */;
INSERT INTO `STREAMING_SERVICES` VALUES ('Disney+','https://www.disneyplus.com'),('Hulu','https://www.hulu.com'),('Netflix','https://www.netflix.com'),('Prime Video','https://www.primevideo.com');
/*!40000 ALTER TABLE `STREAMING_SERVICES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SUBSCRIBED_TO`
--

DROP TABLE IF EXISTS `SUBSCRIBED_TO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SUBSCRIBED_TO` (
  `Email` varchar(255) NOT NULL,
  `StreamingServiceName` varchar(255) NOT NULL,
  PRIMARY KEY (`Email`,`StreamingServiceName`),
  KEY `StreamingServiceName` (`StreamingServiceName`),
  CONSTRAINT `subscribed_to_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `USERS` (`Email`) ON DELETE CASCADE,
  CONSTRAINT `subscribed_to_ibfk_2` FOREIGN KEY (`StreamingServiceName`) REFERENCES `STREAMING_SERVICES` (`StreamingServiceName`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SUBSCRIBED_TO`
--

LOCK TABLES `SUBSCRIBED_TO` WRITE;
/*!40000 ALTER TABLE `SUBSCRIBED_TO` DISABLE KEYS */;
INSERT INTO `SUBSCRIBED_TO` VALUES ('alice@email.com','Netflix'),('john2@email.com','Prime Video');
/*!40000 ALTER TABLE `SUBSCRIBED_TO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERS`
--

DROP TABLE IF EXISTS `USERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USERS` (
  `Email` varchar(255) NOT NULL,
  `CountryName` varchar(80) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  PRIMARY KEY (`Email`),
  KEY `CountryName` (`CountryName`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`CountryName`) REFERENCES `REGIONS` (`CountryName`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERS`
--

LOCK TABLES `USERS` WRITE;
/*!40000 ALTER TABLE `USERS` DISABLE KEYS */;
INSERT INTO `USERS` VALUES ('alice@email.com','Canada','insecure_password','Alice','Smith'),('jane.doe@ucalgary.ca','Canada','password','Jane','Doe'),('john2@email.com','USA','unhashed_plaintext_password','John','Doe');
/*!40000 ALTER TABLE `USERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WATCHDATA`
--

DROP TABLE IF EXISTS `WATCHDATA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WATCHDATA` (
  `Email` varchar(255) NOT NULL,
  `MediaID` bigint unsigned NOT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `CompletionStatus` enum('P','W','C') DEFAULT 'P',
  `PersonalRating` enum('0','1','2','3','4','5') DEFAULT NULL,
  PRIMARY KEY (`Email`,`MediaID`),
  KEY `MediaID` (`MediaID`),
  CONSTRAINT `watchdata_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `USERS` (`Email`) ON DELETE CASCADE,
  CONSTRAINT `watchdata_ibfk_2` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WATCHDATA`
--

LOCK TABLES `WATCHDATA` WRITE;
/*!40000 ALTER TABLE `WATCHDATA` DISABLE KEYS */;
INSERT INTO `WATCHDATA` VALUES ('jane.doe@ucalgary.ca',3,'2026-04-03','2026-04-03','W','0'),('jane.doe@ucalgary.ca',6,'2026-04-01','2026-04-02','C','2'),('john2@email.com',4,'2026-03-19','2026-03-19','C','4');
/*!40000 ALTER TABLE `WATCHDATA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WATCHLIST_CONTAINS`
--

DROP TABLE IF EXISTS `WATCHLIST_CONTAINS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WATCHLIST_CONTAINS` (
  `WatchlistID` bigint unsigned NOT NULL,
  `MediaID` bigint unsigned NOT NULL,
  PRIMARY KEY (`WatchlistID`,`MediaID`),
  KEY `MediaID` (`MediaID`),
  CONSTRAINT `watchlist_contains_ibfk_1` FOREIGN KEY (`WatchlistID`) REFERENCES `WATCHLISTS` (`WatchlistID`) ON DELETE CASCADE,
  CONSTRAINT `watchlist_contains_ibfk_2` FOREIGN KEY (`MediaID`) REFERENCES `MEDIA_TITLES` (`MediaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WATCHLIST_CONTAINS`
--

LOCK TABLES `WATCHLIST_CONTAINS` WRITE;
/*!40000 ALTER TABLE `WATCHLIST_CONTAINS` DISABLE KEYS */;
INSERT INTO `WATCHLIST_CONTAINS` VALUES (5,3),(2,4);
/*!40000 ALTER TABLE `WATCHLIST_CONTAINS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WATCHLISTS`
--

DROP TABLE IF EXISTS `WATCHLISTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WATCHLISTS` (
  `Email` varchar(255) NOT NULL,
  `WatchlistName` varchar(255) NOT NULL,
  `WatchlistID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `DateAdded` date NOT NULL,
  PRIMARY KEY (`WatchlistID`),
  UNIQUE KEY `WatchlistID` (`WatchlistID`),
  KEY `Email` (`Email`),
  CONSTRAINT `watchlists_ibfk_1` FOREIGN KEY (`Email`) REFERENCES `USERS` (`Email`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WATCHLISTS`
--

LOCK TABLES `WATCHLISTS` WRITE;
/*!40000 ALTER TABLE `WATCHLISTS` DISABLE KEYS */;
INSERT INTO `WATCHLISTS` VALUES ('john2@email.com','Johns Watchlist',2,'2026-04-02'),('jane.doe@ucalgary.ca','Test Watchlist 4',5,'2026-04-03'),('jane.doe@ucalgary.ca','Testing',6,'2026-04-03'),('jane.doe@ucalgary.ca','Testing 2',7,'2026-04-03'),('jane.doe@ucalgary.ca','testing 3',8,'2026-04-03'),('jane.doe@ucalgary.ca','Testing 4',9,'2026-04-03'),('jane.doe@ucalgary.ca','Testing',10,'2026-04-06');
/*!40000 ALTER TABLE `WATCHLISTS` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-08 19:30:58

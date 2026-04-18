--  script can be used using a command such as the following:
-- mysql -p WatchFinderDB < db_setup.sql
-- Alternatively, another user can be specified if needed for privileges, 
-- with `-u root` to run as root, for example:
-- mysql -u root -p WatchFinderDB < db_setup.sql

-- This script resets the database (if existing), creates the database, 
-- creates all tables, as well as populating db with example data, 
-- so the app can be tested with all functionalities immediately.
DROP DATABASE WatchFinderDB;
CREATE DATABASE WatchFinderDB;
USE WatchFinderDB;

-- Ensure tables used for foreign key relations are defined first
CREATE TABLE REGIONS (
    CountryName VARCHAR(80)     NOT NULL,
    PRIMARY KEY (CountryName)
);

-- NOTE: SERIAL in MySQL is alias for "BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE"
-- Any references to a SERIAL value should use "BIGINT UNSIGNED", not "SERIAL" again
CREATE TABLE MEDIA_TITLES (
    MediaID     SERIAL          ,
    TitleName   VARCHAR(255)    NOT NULL,
    ReleaseYear YEAR    		,
    Creator     VARCHAR(255)    ,
    AgeRating   VARCHAR(10)     ,
    Rating      DECIMAL(3,1)    ,
    Description TEXT            ,
    Image       VARCHAR(255)    ,
    PRIMARY KEY (MediaID)
);

-- NOTE: Generally unused, as it was not a part of any core user/admin feature
CREATE TABLE MEDIA_GENRES (
    MediaID BIGINT UNSIGNED ,
    Genre   VARCHAR(80)     NOT NULL,
    PRIMARY KEY (MediaID, Genre),
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE
);

CREATE TABLE SHOWS (
    MediaID             BIGINT UNSIGNED     NOT NULL,
    NumberOfSeasons     TINYINT UNSIGNED   NOT NULL,
    PRIMARY KEY (MediaID),
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE
);

-- NOTE: Duration is currently stored in minutes
CREATE TABLE MOVIES (
    MediaID     BIGINT UNSIGNED     NOT NULL,
    Duration    SMALLINT UNSIGNED   NOT NULL,
    PRIMARY KEY (MediaID),
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE
);

CREATE TABLE STREAMING_SERVICES (
    StreamingServiceName    VARCHAR(255)    NOT NULL,
    WebsiteURL              VARCHAR(255)    NOT NULL,
    PRIMARY KEY (StreamingServiceName)
);

CREATE TABLE ADMINS (
    AdminID SERIAL,
    PRIMARY KEY (AdminID)
);

CREATE TABLE USERS (
    Email           VARCHAR(255)    NOT NULL,
    CountryName     VARCHAR(80)     NOT NULL,
    Password        VARCHAR(255)    NOT NULL,
    FirstName       VARCHAR(255)    NOT NULL,
    LastName        VARCHAR(255)    NOT NULL,
    PRIMARY KEY (Email),
    FOREIGN KEY (CountryName) REFERENCES REGIONS(CountryName) ON UPDATE CASCADE
);

CREATE TABLE IS_ADMIN (
    Email           VARCHAR(255)    NOT NULL,
    AdminID         BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (Email, AdminID),
    FOREIGN KEY (Email) REFERENCES USERS(Email) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES ADMINS(AdminID) ON DELETE CASCADE
);

-- NOTE: Changed Email to no longer be part of primary key, not needed with ID
CREATE TABLE WATCHLISTS (
    Email           VARCHAR(255)    NOT NULL,
    WatchlistName   VARCHAR(255)    NOT NULL,
    WatchlistID     SERIAL          ,
    DateAdded       DATE            NOT NULL,
    PRIMARY KEY (WatchlistID),
    FOREIGN KEY (Email) REFERENCES USERS(Email) ON DELETE CASCADE
);

CREATE TABLE WATCHLIST_CONTAINS (
    WatchlistID BIGINT UNSIGNED NOT NULL,
    MediaID     BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (WatchlistID, MediaID),
    FOREIGN KEY (WatchlistID) REFERENCES WATCHLISTS(WatchlistID) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE
);

-- NOTE: CompletionStatus values: 
-- (P)lan to watch, 
-- (W)atching/in-progress,
-- (C)ompleted
CREATE TABLE WATCHDATA (
    Email               VARCHAR(255)                        NOT NULL,
    MediaID             BIGINT UNSIGNED                     NOT NULL,
    StartDate           DATE                                ,
    EndDate             DATE                                ,
    CompletionStatus    ENUM('P', 'W', 'C')                 DEFAULT 'P',
    PersonalRating      ENUM('0', '1', '2', '3', '4', '5')  ,
    PRIMARY KEY (Email, MediaID),
    FOREIGN KEY (Email) REFERENCES USERS(Email) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE
);

-- NOTE: Generally unused, as it was found to be unimportant to planned core features for user/admin
CREATE TABLE SUBSCRIBED_TO (
    Email                   VARCHAR(255)    NOT NULL,
    StreamingServiceName    VARCHAR(255)    NOT NULL,
    PRIMARY KEY (Email, StreamingServiceName),
    FOREIGN KEY (Email) REFERENCES USERS(Email) ON DELETE CASCADE,
    FOREIGN KEY (StreamingServiceName) REFERENCES STREAMING_SERVICES(StreamingServiceName) ON DELETE CASCADE
);

CREATE TABLE AVAILABLE_IN (
    MediaID     BIGINT UNSIGNED NOT NULL,
    CountryName VARCHAR(80)     NOT NULL,
    PRIMARY KEY (MediaID, CountryName),
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (CountryName) REFERENCES REGIONS(CountryName) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE OFFERED_BY (
    MediaID                 BIGINT UNSIGNED NOT NULL,
    StreamingServiceName    VARCHAR(255)    NOT NULL,
    PRIMARY KEY (MediaID, StreamingServiceName),
    FOREIGN KEY (MediaID) REFERENCES MEDIA_TITLES(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (StreamingServiceName) REFERENCES STREAMING_SERVICES(StreamingServiceName) ON DELETE CASCADE
);

CREATE TABLE OPERATES_IN (
    StreamingServiceName    VARCHAR(255)    NOT NULL,
    CountryName             VARCHAR(80)     NOT NULL,
    PRIMARY KEY (StreamingServiceName, CountryName),
    FOREIGN KEY (StreamingServiceName) REFERENCES STREAMING_SERVICES(StreamingServiceName) ON DELETE CASCADE,
    FOREIGN KEY (CountryName) REFERENCES REGIONS(CountryName) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Example Data
INSERT INTO REGIONS
VALUES ('Canada'), ('China'), ('USA'), ('UK'), ('Japan'), ('France');

INSERT INTO STREAMING_SERVICES
VALUES
    ('Netflix', 'https://www.netflix.com'),
    ('Disney+', 'https://www.disneyplus.com'),
    ('Hulu', 'https://www.hulu.com'),
    ('Prime Video', 'https://www.primevideo.com');

-- NOTE: AdminID is SERIAL, which includes auto increment, so it does not need to be specified
-- Admin with AdminID 1 generated here
INSERT INTO ADMINS
VALUES ();

-- NOTE: MediaID is also SERIAL, these will be MediaID 1..13 respectively
-- TODO: Normalize MediaID & corresponding image (and rename images to match)
-- TODO: For Mario movie, make sure to add image if needed
INSERT INTO MEDIA_TITLES (TitleName, ReleaseYear, Creator, AgeRating, Rating, Description, Image)
VALUES
    ('Avatar: The Last Airbender',2005,'Michael Dante DiMartino','TV-Y7-FV',9.3,'In a war-torn world of elemental powers, a young boy reawakens to undertake a dangerous mystic quest to fulfill his destiny as the Avatar, and bring peace to the world.','media_1.jpg'),
    ('Attack on Titan',2013,'Yasuko Kobayashi','TV-MA',9.1,'In a world where humanity shelters behind towering walls from man-eating Titans, a determined teen joins the elite Survey Corps to fight the giants and uncover the secrets of their origin.','media_2.jpg'),
    ('Sherlock',2010,'Mark Gatiss','TV-14',9.0,'In modern-day London, brilliant but eccentric detective Sherlock Holmes teams with war veteran Dr. John Watson to crack baffling crimes, outwit formidable foes, and aid Scotland Yard with razor-sharp deduction.','media_3.jpg'),
    ('The Shawshank Redemption',1994,'Frank Darabont','R',9.3,'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.','media_4.jpg'),
    ('Forrest Gump', 1994, 'Robert Zemeckis', 'PG-13', '8.8', "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.", 'media_5.jpg'),
    ('Interstellar',2014,'Christopher Nolan','PG-13',8.7,'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.','media_6.jpg'),
    ('The Bear',2022,'Christopher Storer','TV-MA',8.6,'A chef returns home to run a family sandwich shop.','media_7.jpg'),
    ('Stranger Things',2016,'The Duffer Brothers','TV-14',8.7,'When a young boy disappears, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.','media_8.jpg'),
    ('Breaking Bad',2008,'Vince Gilligan','TV-MA',9.5,"A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",'media_9.jpg'),
    ('Game of Thrones',2011,'David Benioff and D.B. Weiss','TV-MA',9.2,'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.','media_10.jpg'),
    ('Money Heist',2017,'Álex Pina','TV-MA',9.2,'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.','media_11.jpg'),
    ('Oppenheimer',2023,'Christopher Nolan','R',8.2,'A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large hand in the development of the atomic bombs that brought an end to World War II.','media_12.jpg'),
    ('The Super Mario Galaxy Movie',2026,'Aaron Horvath','PG',6.4,'Mario ventures into space, exploring cosmic worlds and tackling galactic challenges far from the familiar Mushroom Kingdom.','media_13.jpg');

-- Specialize media titles as either Show or Movie
INSERT INTO SHOWS (MediaID, NumberOfSeasons)
VALUES (1,3),(2,4),(3,4),(7,3),(8,5),(9,5),(10,3),(11,3);

-- Shawshank, Forrest Gump, Interstellar, Oppenheimer, Mario Movie
INSERT INTO MOVIES (MediaID, Duration)
VALUES (4,142),(5,142),(6,169),(12,180),(13,98);

INSERT INTO AVAILABLE_IN (MediaID, CountryName) 
VALUES
    (1,'Canada'),(2,'Canada'),(4,'Canada'),(7,'Canada'),(8,'Canada'),(9,'Canada'),(11,'Canada'),(13,'Canada'),
    (8,'China'),
    (11,'France'),
    (2,'Japan'),(13,'Japan'),
    (12,'UK'),
    (1,'USA'),(3,'USA'),(4,'USA'),(6,'USA'),(7,'USA'),(8,'USA'),(10,'USA'),(11,'USA'),(12,'USA'),(13,'USA');


INSERT INTO OFFERED_BY (MediaID, StreamingServiceName)
VALUES 
(1,'Netflix'),(1,'Prime Video'),
(2,'Netflix'),
(3,'Prime Video'),
(4,'Netflix'),(4,'Prime Video'),
(5,'Netflix'),(5,'Prime Video'),
(6,'Hulu'),
(7,'Hulu'),
(8,'Disney+'),(8,'Hulu'),(8,'Netflix'),(8,'Prime Video'),
(9,'Netflix'),
(10,'Disney+'),
(11,'Netflix'),
(12,'Netflix'),
(13,'Netflix'),(13,'Disney+');

-- INSERT INTO MEDIA_GENRES (MediaID, Genre)
-- VALUES
--     (1, 'Adventure'), (1, 'Fantasy'),
--     (2, 'Action'), (2, 'Dark Fantasy'),
--     (3, 'Thriller'), (3, 'Crime'), (3, 'Mystery'),
--     (4, 'Drama'),
--     (5, 'Drama'), (5, 'Romance'),
--     (6, 'Epic'), (6, 'Sci-Fi'), (6, 'Adventure');

-- NOTE: passwords are hashed & salted before stored in DB. Corresponding passwords for test users are:
-- `password12` for Ada,
-- `insecure_password` for Alice,
-- `password` for Jane,
-- `unhashed_plaintext_password` for John (admin user)
INSERT INTO USERS (Email, CountryName, Password, FirstName, LastName)
VALUES 
    ('ada.lovelace@ucalgary.ca','UK','$argon2id$v=19$m=65536,t=3,p=4$W0yHBVuCf4afAaMqo0RDYw$3vqf0x8lQ9G1MDKUqUHjauwOZzFTAQrZMH/4RXnNlms','Ada','Lovelace'),
    ('alice@email.com','Canada','$argon2id$v=19$m=65536,t=3,p=4$+xMNKdHr22t+Am84YeUrNw$q/MftKTakA08yhksEPPsd/8POxmNmpx+ssoyH3YiCfo','Alice','Smith'),
    ('jane.doe@ucalgary.ca','Canada','$argon2id$v=19$m=65536,t=3,p=4$pIsAz3ZsD46BeleQ6t/ZPw$wg9r+0H0e+gQLwBhxednEOBVv5rSLewik1crrgU75Z0','Jane','Doe'),
    ('john2@email.com','USA','$argon2id$v=19$m=65536,t=3,p=4$DNFNr45rlAK/GDq53Bv/Ww$Eo4ThfYDA41ddQt+aoAJLRRepsmg9058wETZN0edbMo','John','Doe');

INSERT INTO SUBSCRIBED_TO (Email, StreamingServiceName)
VALUES ('alice@email.com', 'Netflix'), ('john2@email.com', 'Prime Video');

INSERT INTO WATCHLISTS (Email, WatchlistName, DateAdded)
VALUES 
    ('john2@email.com','Johns Watchlist','2026-04-02'),
    ('jane.doe@ucalgary.ca','Test Watchlist 4','2026-04-03'),
    ('alice@email.com','Alices Watchlist','2026-04-08'),
    ('alice@email.com','Alices Watchlist','2026-04-08');

INSERT INTO WATCHLIST_CONTAINS (WatchlistID, MediaID)
VALUES 
    (2, 4),
    (2, 8);

INSERT INTO WATCHDATA (Email, MediaID, StartDate, EndDate, CompletionStatus, PersonalRating)
VALUES
    ('jane.doe@ucalgary.ca',3,'2026-04-03','2026-04-03','W','0'),
    ('jane.doe@ucalgary.ca',6,'2026-04-01','2026-04-02','C','2'),
    ('john2@email.com',4,'2026-03-19','2026-03-19','C','4'),
    ('john2@email.com',8,'2025-10-07',NULL,'W','5');

-- Make John an admin user (rest of users are normal end-users)
INSERT INTO IS_ADMIN (Email, AdminID)
VALUES ('john2@email.com', 1)

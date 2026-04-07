-- Reference MySQL file, which models.py is based on
-- DDL Statements

CREATE DATABASE IF NOT EXISTS WatchFinderDB;
USE WatchFinderDB;

-- Ensure tables used for foreign key relations are defined first
CREATE TABLE REGIONS (
    CountryName VARCHAR(80)     NOT NULL,
    PRIMARY KEY (CountryName)
);

-- NOTE: SERIAL in MySQL is alias for "BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE"
CREATE TABLE MEDIA_TITLES (
    MediaID     SERIAL          ,
    TitleName   VARCHAR(255)    NOT NULL,
    ReleaseYear YEAR    		,
    Creator     VARCHAR(255)    ,
    AgeRating   VARCHAR(10)     ,
    Rating      DECIMAL(3,1)    ,
    Description TEXT            ,
    PRIMARY KEY (MediaID)
);

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
VALUES ('Canada'), ('USA'), ('UK'), ('Japan'), ('France');

INSERT INTO STREAMING_SERVICES
VALUES
    ('Netflix', 'https://www.netflix.com'),
    ('Disney+', 'https://www.disneyplus.com'),
    ('Prime Video', 'https://www.primevideo.com');

-- NOTE: AdminID is SERIAL, which includes auto increment, so it does not need to be specified
-- Admins with AdminID 1,2 generated here
INSERT INTO ADMINS
VALUES (), ();

-- NOTE: MediaID is also SERIAL, these will be MediaID 1..6 respectively
INSERT INTO MEDIA_TITLES (TitleName, ReleaseYear, Creator, AgeRating, Rating, Description)
VALUES 
('Avatar: The Last Airbender', 2005, 'Michael Dante DiMartino', 'TV-Y7-FV', '9.3', 'In a war-torn world of elemental powers, a young boy reawakens to undertake a dangerous mystic quest to fulfill his destiny as the Avatar, and bring peace to the world.'),
('Attack on Titan', 2013, 'Yasuko Kobayashi', 'TV-MA', '9.1', 'In a world where humanity shelters behind towering walls from man-eating Titans, a determined teen joins the elite Survey Corps to fight the giants and uncover the secrets of their origin.'),
('Sherlock', 2010, 'Mark Gatiss', 'TV-14', '9.0', 'In modern-day London, brilliant but eccentric detective Sherlock Holmes teams with war veteran Dr. John Watson to crack baffling crimes, outwit formidable foes, and aid Scotland Yard with razor-sharp deduction.'),
('The Shawshank Redemption', 1994, 'Frank Darabont', 'R', '9.3', 'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.'),
('Forrest Gump', 1994, 'Robert Zemeckis', 'PG-13', '8.8', "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart."),
('Interstellar', 2014, 'Christopher Nolan', 'PG-13', '8.7', 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.');

-- Specialize media titles as either Show or Movie
INSERT INTO SHOWS (MediaID, NumberOfSeasons)
VALUES (1,3), (2, 4), (3, 4);

INSERT INTO MOVIES (MediaID, Duration)
VALUES (4, 142), (5, 142), (6, 169);

INSERT INTO AVAILABLE_IN (MediaID, CountryName) 
VALUES (1, 'USA'), (1, 'Canada'), (2, 'Japan'), (2, 'Canada'), (3, 'USA'), (4, 'USA'), (4, 'Canada'), (5, 'USA'), ('6', 'USA');

INSERT INTO OFFERED_BY (MediaID, StreamingServiceName)
VALUES (1, 'Netflix'), (2, 'Netflix'), (3, 'Prime Video'), (4, 'Prime Video'), (5, 'Prime Video'), (6, 'Disney+');

INSERT INTO MEDIA_GENRES (MediaID, Genre)
VALUES
    (1, 'Adventure'), (1, 'Fantasy'),
    (2, 'Action'), (2, 'Dark Fantasy'),
    (3, 'Thriller'), (3, 'Crime'), (3, 'Mystery'),
    (4, 'Drama'),
    (5, 'Drama'), (5, 'Romance'),
    (6, 'Epic'), (6, 'Sci-Fi'), (6, 'Adventure');

INSERT INTO USERS (Email, CountryName, Password, FirstName, LastName)
VALUES 
    ('alice@email.com', 'Canada', 'insecure_password', 'Alice', 'Smith'),
    ('john2@email.com', 'USA', 'unhashed_plaintext_password', 'John', 'Doe');

INSERT INTO SUBSCRIBED_TO (Email, StreamingServiceName)
VALUES ('alice@email.com', 'Netflix'), ('john2@email.com', 'Prime Video');

INSERT INTO WATCHLISTS (Email, WatchlistName, DateAdded) 
VALUES 
    ('alice@email.com', 'Alices Watchlist', CURDATE()), 
    ('john2@email.com', 'Johns Watchlist', CURDATE());

INSERT INTO WATCHLIST_CONTAINS (WatchlistID, MediaID) 
VALUES 
    (1, 1),
    (2, 4);

INSERT INTO WATCHDATA (Email, MediaID, StartDate, CompletionStatus, PersonalRating)
VALUES ('john2@email.com', 4, '2026-03-19', 'W', 5);

INSERT INTO IS_ADMIN (Email, AdminID)
VALUES ('john2email.com', 1)

-- DML Statements
-- Retrieve all media titles from watchlist of user with email 'john2@email.com'
-- SELECT U.FirstName, MT.TitleName, W.DateAdded
-- FROM USERS U, WATCHLISTS W, WATCHLIST_CONTAINS WC, MEDIA_TITLES MT
-- WHERE U.Email = 'john2@email.com' AND U.Email = W.Email AND W.WatchlistID = WC.WatchlistID AND WC.MediaID = MT.MediaID;
--
-- -- Retrieve all media titles available in region 'Canada'
-- SELECT M.TitleName, M.ReleaseYear, M.Rating
-- FROM MEDIA_TITLES AS M, AVAILABLE_IN AS A
-- WHERE A.CountryName = 'Canada' AND M.MediaID = A.MediaID;
--
-- -- Update user watchdata for a media title
-- UPDATE WATCHDATA 
-- SET CompletionStatus = 'C', 
--     EndDate = '2026-03-19', 
--     PersonalRating = 5
-- WHERE Email = 'john2@email.com' AND MediaID = 4;
--
-- -- Increment number of seasons of a given show, using its title
-- UPDATE SHOWS
-- SET NumberOfSeasons = NumberOfSeasons + 1
-- WHERE MediaID = (SELECT MediaID FROM MEDIA_TITLES WHERE TitleName = 'Attack on Titan');
--
-- -- Remove a media title from user's watchlist
-- DELETE FROM WATCHLIST_CONTAINS
-- WHERE WatchlistID = 1 AND MediaID = 1;
--
-- -- Delete entire watchlist for given user and watchlist
-- -- NOTE: ON DELETE CASCADE will take care of WATCHLIST_CONTAINS
-- DELETE FROM WATCHLISTS
-- WHERE WatchlistID = 1 AND Email = 'alice@email.com';

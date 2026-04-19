from __future__ import annotations

from datetime import UTC, date
from decimal import Decimal
from enum import Enum

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, DECIMAL, CheckConstraint, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mysql import YEAR, BIGINT, SMALLINT, ENUM, TINYINT

from database import Base

# Model definitions for database, in SQLAlchemy


class Regions(Base):
    __tablename__ = "REGIONS"
    country_name: Mapped[str] = mapped_column("CountryName",
                                              String(80),
                                              primary_key=True)


class MediaTitles(Base):
    __tablename__ = "MEDIA_TITLES"
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          primary_key=True,
                                          autoincrement=True)
    title_name: Mapped[str] = mapped_column("TitleName",
                                            String(255),
                                            nullable=False,
                                            index=True)
    release_year: Mapped[int | None] = mapped_column("ReleaseYear", YEAR)
    creator: Mapped[str | None] = mapped_column("Creator", String(255))
    age_rating: Mapped[str | None] = mapped_column("AgeRating", String(10))
    rating: Mapped[float | None] = mapped_column("Rating", DECIMAL(3, 1))
    description: Mapped[str | None] = mapped_column("Description", Text)
    image_file: Mapped[str | None] = mapped_column("Image", String(255))

    @property
    def image_path(self) -> str:
        if self.image_file:
            return f'/media_images/{self.image_file}'


class Shows(Base):
    __tablename__ = "SHOWS"
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("MEDIA_TITLES.MediaID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)
    number_of_seasons: Mapped[int] = mapped_column("NumberOfSeasons",
                                                   TINYINT(unsigned=True),
                                                   nullable=False)


class Movies(Base):
    __tablename__ = "MOVIES"
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("MEDIA_TITLES.MediaID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)
    duration: Mapped[int] = mapped_column("Duration",
                                          SMALLINT(unsigned=True),
                                          nullable=False)


class StreamingServices(Base):
    __tablename__ = "STREAMING_SERVICES"
    streaming_service_name: Mapped[str] = mapped_column("StreamingServiceName",
                                                        String(255),
                                                        primary_key=True)
    website_url: Mapped[str] = mapped_column("WebsiteURL",
                                             String(255),
                                             nullable=False)


class Admins(Base):
    __tablename__ = "ADMINS"
    admin_id: Mapped[int] = mapped_column("AdminID",
                                          BIGINT(unsigned=True),
                                          autoincrement=True,
                                          primary_key=True)


class Users(Base):
    __tablename__ = "USERS"
    email: Mapped[str] = mapped_column("Email", String(255), primary_key=True)
    country_name: Mapped[str] = mapped_column("CountryName",
                                              ForeignKey("REGIONS.CountryName",
                                                         onupdate="CASCADE"),
                                              nullable=False)
    password: Mapped[str] = mapped_column("Password",
                                          String(255),
                                          nullable=False)
    firstname: Mapped[str] = mapped_column("FirstName",
                                           String(255),
                                           nullable=False)
    lastname: Mapped[str] = mapped_column("LastName",
                                          String(255),
                                          nullable=False)


class IsAdmin(Base):
    __tablename__ = "IS_ADMIN"
    email: Mapped[str] = mapped_column("Email",
                                       String(255),
                                       ForeignKey("USERS.Email",
                                                  ondelete="CASCADE"),
                                       primary_key=True)
    admin_id: Mapped[int] = mapped_column("AdminID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("ADMINS.AdminID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)


class Watchlists(Base):
    __tablename__ = "WATCHLISTS"
    email: Mapped[str] = mapped_column("Email",
                                       String(255),
                                       ForeignKey("USERS.Email",
                                                  ondelete="CASCADE"),
                                       primary_key=True)
    watchlist_id: Mapped[int] = mapped_column("WatchlistID",
                                              BIGINT(unsigned=True),
                                              autoincrement=True,
                                              primary_key=True)
    watchlist_name: Mapped[str] = mapped_column("WatchlistName",
                                                String(255),
                                                nullable=False)
    date_added: Mapped[date] = mapped_column(
        "DateAdded",
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"))


class WatchlistContains(Base):
    __tablename__ = "WATCHLIST_CONTAINS"
    watchlist_id: Mapped[int] = mapped_column("WatchlistID",
                                              BIGINT(unsigned=True),
                                              ForeignKey(
                                                  "WATCHLISTS.WatchlistID",
                                                  ondelete="CASCADE"),
                                              primary_key=True)
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("MEDIA_TITLES.MediaID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)


# Enums for usage in WatchData:
# Status of a certain media title for given user
class CompletionStatus(Enum):
    P = "P"  # (P)lan to watch
    W = "W"  # (W)atching/in-progress
    C = "C"  # (C)ompleted


# Scale of 1-5*, plus zero/empty star
class PersonalRating(Enum):
    ZERO = "0"
    ONE = "1"
    TWO = "2"
    THREE = "3"
    FOUR = "4"
    FIVE = "5"


class WatchData(Base):
    __tablename__ = "WATCHDATA"
    email: Mapped[str] = mapped_column("Email",
                                       String(255),
                                       ForeignKey("USERS.Email",
                                                  ondelete="CASCADE"),
                                       primary_key=True)
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("MEDIA_TITLES.MediaID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)
    start_date: Mapped[date | None] = mapped_column("StartDate", Date)
    end_date: Mapped[date | None] = mapped_column("EndDate", Date)
    completion_status: Mapped[CompletionStatus] = mapped_column(
        "CompletionStatus",
        ENUM(CompletionStatus),
        server_default=CompletionStatus.P.value)
    personal_rating: Mapped[PersonalRating] = mapped_column(
        "PersonalRating",
        ENUM(PersonalRating, values_callable=lambda x: [e.value for e in x]),
        server_default=PersonalRating.ZERO.value)


class SubscribedTo(Base):
    __tablename__ = "SUBSCRIBED_TO"
    email: Mapped[str] = mapped_column("Email",
                                       String(255),
                                       ForeignKey("USERS.Email",
                                                  ondelete="CASCADE"),
                                       primary_key=True)
    streaming_service_name: Mapped[str] = mapped_column(
        "StreamingServiceName",
        String(255),
        ForeignKey("STREAMING_SERVICES.StreamingServiceName",
                   ondelete="CASCADE"),
        primary_key=True)


class AvailableIn(Base):
    __tablename__ = "AVAILABLE_IN"
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("MEDIA_TITLES.MediaID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)
    country_name: Mapped[str] = mapped_column("CountryName",
                                              ForeignKey("REGIONS.CountryName",
                                                         onupdate="CASCADE",
                                                         ondelete="CASCADE"),
                                              primary_key=True)


class OfferedBy(Base):
    __tablename__ = "OFFERED_BY"
    media_id: Mapped[int] = mapped_column("MediaID",
                                          BIGINT(unsigned=True),
                                          ForeignKey("MEDIA_TITLES.MediaID",
                                                     ondelete="CASCADE"),
                                          primary_key=True)
    streaming_service_name: Mapped[str] = mapped_column(
        "StreamingServiceName",
        String(255),
        ForeignKey("STREAMING_SERVICES.StreamingServiceName",
                   ondelete="CASCADE"),
        primary_key=True)


class OperatesIn(Base):
    __tablename__ = "OPERATES_IN"
    streaming_service_name: Mapped[str] = mapped_column(
        "StreamingServiceName",
        String(255),
        ForeignKey("STREAMING_SERVICES.StreamingServiceName",
                   ondelete="CASCADE"),
        primary_key=True)
    country_name: Mapped[str] = mapped_column("CountryName",
                                              ForeignKey("REGIONS.CountryName",
                                                         onupdate="CASCADE",
                                                         ondelete="CASCADE"),
                                              primary_key=True)

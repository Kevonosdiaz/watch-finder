from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, DECIMAL, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialect import YEAR, BIGINT, SMALLINT

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
                                            nullable=False)
    release_year: Mapped[int | None] = mapped_column("ReleaseYear", YEAR)
    creator: Mapped[str | None] = mapped_column("Creator", String(255))
    age_rating: Mapped[str | None] = mapped_column("AgeRating", String(10))
    rating: Mapped[float | None] = mapped_column("Rating", DECIMAL(3, 1))
    description: Mapped[str | None] = mapped_column("Description", Text)


class MediaGenres(Base):
    __tablename__ = "MEDIA_GENRES"
    media_id: Mapped[int] = mapped_column("MediaID", BIGINT(unsigned=True), ForeignKey("MEDIA_TITLES.MediaID", primary_key=True, ondelete="CASCADE")
    genre: Mapped[str] = mapped_column("Genre", String(80), primary_key=True)


class Shows(Base):
    __tablename__ = "SHOWS"
    media_id: Mapped[int] = mapped_column("MediaID", BIGINT(unsigned=True), ForeignKey("MEDIA_TITLES.MediaID", primary_key=True, ondelete="CASCADE")
    number_of_seasons: Mapped[int] = mapped_column("NumberOfSeasons", SMALLINT(unsigned=True), nullable=False)


class Movies(Base):
    __tablename__ = "MOVIES"
    media_id: Mapped[int] = mapped_column("MediaID", BIGINT(unsigned=True), ForeignKey("MEDIA_TITLES.MediaID", primary_key=True, ondelete="CASCADE")
    duration: Mapped[int] = mapped_column("Duration", SMALLINT(unsigned=True), nullable=False)

class Users(Base):
    __tablename__ = "USERS"
    email: Mapped[str] = mapped_column(String(255),
                                       primary_key=True,
                                       index=True)
    countryname: Mapped[str] = mapped_column(ForeignKey("regions.countryname"),
                                             nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    firstname: Mapped[str] = mapped_column(String(255), nullable=False)
    lastname: Mapped[str] = mapped_column(String(255), nullable=False)

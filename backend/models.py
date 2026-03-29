from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Regions(Base):
    __tablename__ = "regions"
    countryname: Mapped[str] = mapped_column(String(80), primary_key=True)


class Users(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255),
                                       primary_key=True,
                                       index=True)
    countryname: Mapped[str] = mapped_column(ForeignKey("regions.countryname"),
                                             nullable=False,
                                             index=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    firstname: Mapped[str] = mapped_column(String(255), nullable=False)
    lastname: Mapped[str] = mapped_column(String(255), nullable=False)

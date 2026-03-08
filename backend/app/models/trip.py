from datetime import date
from typing import Optional

from sqlalchemy import Date, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Trip(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "trips"

    name: Mapped[str] = mapped_column(String(255))
    destination: Mapped[str] = mapped_column(String(255))
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    budget: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    status: Mapped[str] = mapped_column(String(20), default="planning")

    # Relationships
    activities = relationship(
        "Activity", back_populates="trip", cascade="all, delete-orphan"
    )
    expenses = relationship(
        "Expense", back_populates="trip", cascade="all, delete-orphan"
    )
    accommodations = relationship(
        "Accommodation", back_populates="trip", cascade="all, delete-orphan"
    )
    flights = relationship(
        "Flight", back_populates="trip", cascade="all, delete-orphan"
    )
    transports = relationship(
        "Transport", back_populates="trip", cascade="all, delete-orphan"
    )
    itinerary_items = relationship(
        "ItineraryItem", back_populates="trip", cascade="all, delete-orphan"
    )
    travel_info = relationship(
        "TravelInfo", back_populates="trip", cascade="all, delete-orphan", uselist=False
    )
    weather_info = relationship(
        "WeatherInfo", back_populates="trip", cascade="all, delete-orphan"
    )
    packing_items = relationship(
        "PackingItem", back_populates="trip", cascade="all, delete-orphan"
    )

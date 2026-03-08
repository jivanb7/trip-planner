from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Flight(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "flights"

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    airline: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    flight_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    departure_airport: Mapped[str] = mapped_column(String(10))
    arrival_airport: Mapped[str] = mapped_column(String(10))
    departure_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True
    )
    arrival_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    cost: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    confirmation_number: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True
    )
    booking_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    trip = relationship("Trip", back_populates="flights")

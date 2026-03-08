from datetime import date
from typing import Optional

from sqlalchemy import Date, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Accommodation(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "accommodations"

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    check_in: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    check_out: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    cost_per_night: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    confirmation_number: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True
    )
    booking_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    trip = relationship("Trip", back_populates="accommodations")

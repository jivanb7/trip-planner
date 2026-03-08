from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Transport(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "transports"

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    type: Mapped[str] = mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    from_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    to_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    departure_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True
    )
    arrival_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    cost: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    confirmation_number: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    trip = relationship("Trip", back_populates="transports")

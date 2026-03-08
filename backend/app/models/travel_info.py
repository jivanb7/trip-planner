from typing import Any, Optional

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.models.base import Base, TimestampMixin, UUIDMixin


class TravelInfo(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "travel_info"
    __table_args__ = (UniqueConstraint("trip_id"),)

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    visa_requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    vaccination_info: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    travel_insurance: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    local_currency: Mapped[Optional[str]] = mapped_column(String(3), nullable=True)
    language: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    timezone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    power_outlet: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    emergency_numbers: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    useful_phrases: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    trip = relationship("Trip", back_populates="travel_info")

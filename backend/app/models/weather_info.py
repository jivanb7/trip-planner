from datetime import date
from typing import Optional

from sqlalchemy import Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class WeatherInfo(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "weather_info"

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    date: Mapped[date] = mapped_column(Date)
    condition: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    high_temp: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    low_temp: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    humidity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    precipitation_chance: Mapped[Optional[float]] = mapped_column(
        Float, nullable=True
    )
    wind_speed: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    trip = relationship("Trip", back_populates="weather_info")

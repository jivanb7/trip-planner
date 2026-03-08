from datetime import date
from typing import Optional

from sqlalchemy import Date, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Expense(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "expenses"

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    description: Mapped[str] = mapped_column(String(255))
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    amount_usd: Mapped[float] = mapped_column(Float)
    category: Mapped[str] = mapped_column(String(50))
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    paid_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    trip = relationship("Trip", back_populates="expenses")

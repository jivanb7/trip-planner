from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class PackingItem(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "packing_items"

    trip_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("trips.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(50), default="general")
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    packed: Mapped[bool] = mapped_column(Boolean, default=False)

    trip = relationship("Trip", back_populates="packing_items")

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.expense import Expense
from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate
from app.utils import raise_not_found


class CRUDTrip(CRUDBase[Trip, TripCreate, TripUpdate]):
    def get_or_404(self, db: Session, trip_id: str) -> Trip:
        trip = self.get(db, trip_id)
        if not trip:
            raise_not_found("Trip", trip_id)
        return trip  # type: ignore[return-value]

    def get_total_spent_usd(self, db: Session, trip_id: str) -> float:
        result = db.execute(
            select(func.coalesce(func.sum(Expense.amount_usd), 0.0)).where(
                Expense.trip_id == trip_id
            )
        ).scalar()
        return float(result or 0.0)


trips = CRUDTrip(Trip)

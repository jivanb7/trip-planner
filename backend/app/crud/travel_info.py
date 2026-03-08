from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.travel_info import TravelInfo
from app.schemas.travel_info import TravelInfoCreate, TravelInfoUpdate


class CRUDTravelInfo(CRUDBase[TravelInfo, TravelInfoCreate, TravelInfoUpdate]):
    def get_by_trip(self, db: Session, trip_id: str) -> TravelInfo | None:
        return db.execute(
            select(TravelInfo).where(TravelInfo.trip_id == trip_id)
        ).scalar_one_or_none()

    def upsert(self, db: Session, trip_id: str, obj_in: TravelInfoUpdate) -> TravelInfo:
        existing = self.get_by_trip(db, trip_id)
        if existing:
            return self.update(db, db_obj=existing, obj_in=obj_in)
        create_data = TravelInfoCreate(**obj_in.model_dump(exclude_unset=False))
        return self.create(db, obj_in=create_data, trip_id=trip_id)


travel_info = CRUDTravelInfo(TravelInfo)

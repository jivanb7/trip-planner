from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.itinerary_item import ItineraryItem
from app.schemas.itinerary_item import ItineraryItemCreate, ItineraryItemUpdate, ItineraryReorderRequest


class CRUDItinerary(CRUDBase[ItineraryItem, ItineraryItemCreate, ItineraryItemUpdate]):
    def reorder(self, db: Session, reorder_req: ItineraryReorderRequest) -> list[ItineraryItem]:
        updated = []
        for item_order in reorder_req.items:
            db_item = db.get(ItineraryItem, item_order.id)
            if db_item:
                db_item.sort_order = item_order.sort_order
                updated.append(db_item)
        db.commit()
        for item in updated:
            db.refresh(item)
        return updated


itinerary = CRUDItinerary(ItineraryItem)

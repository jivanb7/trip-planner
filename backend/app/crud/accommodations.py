from app.crud.base import CRUDBase
from app.models.accommodation import Accommodation
from app.schemas.accommodation import AccommodationCreate, AccommodationUpdate


class CRUDAccommodation(CRUDBase[Accommodation, AccommodationCreate, AccommodationUpdate]):
    pass


accommodations = CRUDAccommodation(Accommodation)

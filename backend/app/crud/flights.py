from app.crud.base import CRUDBase
from app.models.flight import Flight
from app.schemas.flight import FlightCreate, FlightUpdate


class CRUDFlight(CRUDBase[Flight, FlightCreate, FlightUpdate]):
    pass


flights = CRUDFlight(Flight)

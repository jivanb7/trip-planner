from app.crud.base import CRUDBase
from app.models.transport import Transport
from app.schemas.transport import TransportCreate, TransportUpdate


class CRUDTransport(CRUDBase[Transport, TransportCreate, TransportUpdate]):
    pass


transports = CRUDTransport(Transport)

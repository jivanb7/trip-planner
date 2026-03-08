from app.crud.base import CRUDBase
from app.models.packing_item import PackingItem
from app.schemas.packing_item import PackingItemCreate, PackingItemUpdate


class CRUDPacking(CRUDBase[PackingItem, PackingItemCreate, PackingItemUpdate]):
    pass


packing = CRUDPacking(PackingItem)

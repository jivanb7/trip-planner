from app.routers.trips import router as trips_router
from app.routers.activities import router as activities_router
from app.routers.expenses import router as expenses_router
from app.routers.accommodations import router as accommodations_router
from app.routers.flights import router as flights_router
from app.routers.transports import router as transports_router
from app.routers.itinerary import router as itinerary_router
from app.routers.travel_info import router as travel_info_router
from app.routers.weather import router as weather_router
from app.routers.packing import router as packing_router

__all__ = [
    "trips_router",
    "activities_router",
    "expenses_router",
    "accommodations_router",
    "flights_router",
    "transports_router",
    "itinerary_router",
    "travel_info_router",
    "weather_router",
    "packing_router",
]

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.models.base import Base
from app.routers import (
    accommodations_router,
    activities_router,
    expenses_router,
    flights_router,
    itinerary_router,
    packing_router,
    transports_router,
    travel_info_router,
    trips_router,
    weather_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (dev convenience; prod uses Alembic)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="AI Trip Planner API",
    description="Backend API for the AI Trip Planner application",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(trips_router)
app.include_router(activities_router)
app.include_router(expenses_router)
app.include_router(accommodations_router)
app.include_router(flights_router)
app.include_router(transports_router)
app.include_router(itinerary_router)
app.include_router(travel_info_router)
app.include_router(weather_router)
app.include_router(packing_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}

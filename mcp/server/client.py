"""Async HTTP client for the Trip Planner backend API."""

from __future__ import annotations

from typing import Any

import httpx

from server.config import API_BASE

_TIMEOUT = httpx.Timeout(30.0, connect=10.0)


class TripPlannerClient:
    """Thin wrapper around httpx for all backend API calls."""

    def __init__(self) -> None:
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(base_url=API_BASE, timeout=_TIMEOUT)
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ── Generic helpers ──────────────────────────────────────────────

    async def _get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        client = await self._get_client()
        resp = await client.get(path, params=params)
        resp.raise_for_status()
        return resp.json()

    async def _post(self, path: str, json: dict[str, Any] | None = None) -> Any:
        client = await self._get_client()
        resp = await client.post(path, json=json)
        resp.raise_for_status()
        return resp.json()

    async def _put(self, path: str, json: dict[str, Any] | None = None) -> Any:
        client = await self._get_client()
        resp = await client.put(path, json=json)
        resp.raise_for_status()
        return resp.json()

    async def _delete(self, path: str) -> int:
        client = await self._get_client()
        resp = await client.delete(path)
        resp.raise_for_status()
        return resp.status_code

    # ── Trips ────────────────────────────────────────────────────────

    async def list_trips(self) -> list[dict]:
        return await self._get("/trips")

    async def create_trip(self, data: dict) -> dict:
        return await self._post("/trips", json=data)

    async def get_trip(self, trip_id: str) -> dict:
        return await self._get(f"/trips/{trip_id}")

    async def update_trip(self, trip_id: str, data: dict) -> dict:
        return await self._put(f"/trips/{trip_id}", json=data)

    async def delete_trip(self, trip_id: str) -> int:
        return await self._delete(f"/trips/{trip_id}")

    async def get_trip_summary(self, trip_id: str) -> dict:
        return await self._get(f"/trips/{trip_id}/summary")

    async def get_trip_budget(self, trip_id: str) -> dict:
        return await self._get(f"/trips/{trip_id}/budget")

    async def update_trip_budget(self, trip_id: str, data: dict) -> dict:
        return await self._put(f"/trips/{trip_id}/budget", json=data)

    # ── Activities ───────────────────────────────────────────────────

    async def list_activities(self, trip_id: str) -> list[dict]:
        return await self._get(f"/trips/{trip_id}/activities")

    async def create_activity(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/activities", json=data)

    async def delete_activity(self, activity_id: str, trip_id: str) -> int:
        return await self._delete(f"/trips/{trip_id}/activities/{activity_id}")

    # ── Expenses ─────────────────────────────────────────────────────

    async def list_expenses(self, trip_id: str) -> list[dict]:
        return await self._get(f"/trips/{trip_id}/expenses")

    async def create_expense(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/expenses", json=data)

    async def get_expense_summary(self, trip_id: str) -> dict:
        return await self._get(f"/trips/{trip_id}/expenses/summary")

    # ── Flights ──────────────────────────────────────────────────────

    async def list_flights(self, trip_id: str) -> list[dict]:
        return await self._get(f"/trips/{trip_id}/flights")

    async def create_flight(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/flights", json=data)

    # ── Accommodations ───────────────────────────────────────────────

    async def list_accommodations(self, trip_id: str) -> list[dict]:
        return await self._get(f"/trips/{trip_id}/accommodations")

    async def create_accommodation(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/accommodations", json=data)

    # ── Transports ───────────────────────────────────────────────────

    async def list_transports(self, trip_id: str) -> list[dict]:
        return await self._get(f"/trips/{trip_id}/transports")

    async def create_transport(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/transports", json=data)

    # ── Travel Info ──────────────────────────────────────────────────

    async def set_travel_info(self, trip_id: str, data: dict) -> dict:
        return await self._put(f"/trips/{trip_id}/travel-info", json=data)

    # ── Weather ──────────────────────────────────────────────────────

    async def create_weather(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/weather", json=data)

    # ── Packing ──────────────────────────────────────────────────────

    async def list_packing_items(self, trip_id: str) -> list[dict]:
        return await self._get(f"/trips/{trip_id}/packing")

    async def create_packing_item(self, trip_id: str, data: dict) -> dict:
        return await self._post(f"/trips/{trip_id}/packing", json=data)


# Module-level singleton
api = TripPlannerClient()

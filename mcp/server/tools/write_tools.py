"""Write tools for the Trip Planner MCP server.

These tools create, update, and delete trip data via the backend API.
Claude Desktop reads the docstrings to understand what each tool does.
"""

from __future__ import annotations

from typing import Any

from mcp.server.fastmcp import FastMCP

from server.client import api


def register_write_tools(mcp: FastMCP) -> None:
    """Register all write tools on the given FastMCP server."""

    # ── Trip Management ──────────────────────────────────────────────

    @mcp.tool()
    async def create_trip(
        name: str,
        destination: str,
        start_date: str,
        end_date: str,
        description: str = "",
        currency: str = "USD",
        budget: float | None = None,
    ) -> str:
        """Create a new trip.

        Args:
            name: Trip name (e.g. "Tokyo Adventure")
            destination: Main destination city/country
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            description: Optional trip description
            currency: Currency code for budget tracking (default USD)
            budget: Optional total budget amount
        """
        data: dict[str, Any] = {
            "name": name,
            "destination": destination,
            "start_date": start_date,
            "end_date": end_date,
            "description": description,
            "currency": currency,
        }
        if budget is not None:
            data["budget"] = budget
        trip = await api.create_trip(data)
        return (
            f"Trip created successfully!\n"
            f"  Name: {trip['name']}\n"
            f"  Destination: {trip['destination']}\n"
            f"  Dates: {trip['start_date']} to {trip['end_date']}\n"
            f"  Currency: {trip.get('currency', currency)}\n"
            f"  Budget: {trip.get('budget', 'Not set')}\n"
            f"  ID: {trip['id']}"
        )

    @mcp.tool()
    async def update_trip(
        trip_id: str,
        name: str | None = None,
        destination: str | None = None,
        start_date: str | None = None,
        end_date: str | None = None,
        description: str | None = None,
        currency: str | None = None,
    ) -> str:
        """Update an existing trip's details.

        Args:
            trip_id: The trip ID to update
            name: New trip name
            destination: New destination
            start_date: New start date (YYYY-MM-DD)
            end_date: New end date (YYYY-MM-DD)
            description: New description
            currency: New currency code
        """
        data: dict[str, Any] = {}
        if name is not None:
            data["name"] = name
        if destination is not None:
            data["destination"] = destination
        if start_date is not None:
            data["start_date"] = start_date
        if end_date is not None:
            data["end_date"] = end_date
        if description is not None:
            data["description"] = description
        if currency is not None:
            data["currency"] = currency

        if not data:
            return "No fields to update. Provide at least one field to change."

        trip = await api.update_trip(trip_id, data)
        return (
            f"Trip updated successfully!\n"
            f"  Name: {trip['name']}\n"
            f"  Destination: {trip['destination']}\n"
            f"  Dates: {trip['start_date']} to {trip['end_date']}"
        )

    @mcp.tool()
    async def delete_trip(trip_id: str) -> str:
        """Permanently delete a trip and all its associated data (activities, expenses, flights, etc.).

        Args:
            trip_id: The trip ID to delete
        """
        await api.delete_trip(trip_id)
        return f"Trip {trip_id} and all associated data have been deleted."

    @mcp.tool()
    async def list_trips() -> str:
        """List all trips with their basic details. Use this to find trip IDs."""
        trips = await api.list_trips()
        if not trips:
            return "No trips found. Create one with create_trip."

        lines = [f"Found {len(trips)} trip(s):\n"]
        for t in trips:
            budget_str = f"${t['budget']:.2f}" if t.get("budget") else "No budget"
            lines.append(
                f"  - {t['name']} ({t['destination']})\n"
                f"    Dates: {t['start_date']} to {t['end_date']}\n"
                f"    Budget: {budget_str} {t.get('currency', 'USD')}\n"
                f"    ID: {t['id']}"
            )
        return "\n".join(lines)

    # ── Activities ───────────────────────────────────────────────────

    @mcp.tool()
    async def add_activity(
        trip_id: str,
        name: str,
        category: str = "sightseeing",
        date: str | None = None,
        start_time: str | None = None,
        end_time: str | None = None,
        location: str | None = None,
        notes: str | None = None,
        cost: float | None = None,
        booking_url: str | None = None,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> str:
        """Add a single activity to a trip.

        Args:
            trip_id: The trip to add the activity to
            name: Activity name (e.g. "Visit Senso-ji Temple")
            category: One of: sightseeing, food, adventure, shopping, relaxation, nightlife, cultural, transport, other
            date: Date of activity (YYYY-MM-DD)
            start_time: Start time (HH:MM)
            end_time: End time (HH:MM)
            location: Location or address
            notes: Additional notes
            cost: Estimated cost
            booking_url: URL for booking/tickets
            latitude: GPS latitude for map pin
            longitude: GPS longitude for map pin
        """
        data: dict[str, Any] = {"name": name, "category": category}
        for key, val in [
            ("date", date),
            ("start_time", start_time),
            ("end_time", end_time),
            ("location", location),
            ("notes", notes),
            ("cost", cost),
            ("booking_url", booking_url),
            ("latitude", latitude),
            ("longitude", longitude),
        ]:
            if val is not None:
                data[key] = val

        activity = await api.create_activity(trip_id, data)
        return (
            f"Activity added!\n"
            f"  Name: {activity['name']}\n"
            f"  Category: {activity.get('category', category)}\n"
            f"  Date: {activity.get('date', 'Not set')}\n"
            f"  Location: {activity.get('location', 'Not set')}\n"
            f"  ID: {activity['id']}"
        )

    @mcp.tool()
    async def suggest_activities(
        trip_id: str,
        activities: list[dict[str, Any]],
    ) -> str:
        """Add multiple suggested activities to a trip at once.

        Claude generates the activity suggestions based on the trip destination and dates,
        then this tool persists them all. Each activity dict should have at minimum a 'name'
        and 'category' field.

        Args:
            trip_id: The trip to add activities to
            activities: List of activity dicts, each with keys: name (required), category, date, start_time, end_time, location, notes, cost, latitude, longitude
        """
        results = []
        for act in activities:
            if "name" not in act:
                results.append("  - SKIPPED: missing 'name' field")
                continue
            act.setdefault("category", "sightseeing")
            created = await api.create_activity(trip_id, act)
            results.append(f"  - {created['name']} ({created.get('category', 'other')})")

        return (
            f"Added {len(results)} activities to the trip:\n"
            + "\n".join(results)
        )

    @mcp.tool()
    async def remove_activity(trip_id: str, activity_id: str) -> str:
        """Remove an activity from a trip.

        Args:
            trip_id: The trip the activity belongs to
            activity_id: The activity ID to remove
        """
        await api.delete_activity(activity_id, trip_id)
        return f"Activity {activity_id} removed from trip."

    # ── Expenses ─────────────────────────────────────────────────────

    @mcp.tool()
    async def add_expense(
        trip_id: str,
        description: str,
        amount: float,
        category: str = "other",
        currency: str | None = None,
        date: str | None = None,
        notes: str | None = None,
    ) -> str:
        """Add an expense to a trip for budget tracking.

        Args:
            trip_id: The trip to add the expense to
            description: What the expense is for (e.g. "Hotel booking")
            amount: Amount in the specified currency
            category: One of: accommodation, transport, food, activities, shopping, insurance, visa, communication, other
            currency: Currency code (defaults to trip currency if not set)
            date: Date of expense (YYYY-MM-DD)
            notes: Additional notes
        """
        data: dict[str, Any] = {
            "description": description,
            "amount": amount,
            "category": category,
        }
        for key, val in [("currency", currency), ("date", date), ("notes", notes)]:
            if val is not None:
                data[key] = val

        expense = await api.create_expense(trip_id, data)
        return (
            f"Expense added!\n"
            f"  Description: {expense['description']}\n"
            f"  Amount: {expense['amount']} {expense.get('currency', '')}\n"
            f"  Category: {expense.get('category', category)}\n"
            f"  ID: {expense['id']}"
        )

    # ── Budget ───────────────────────────────────────────────────────

    @mcp.tool()
    async def set_budget(trip_id: str, budget: float, currency: str | None = None) -> str:
        """Set or update the total budget for a trip.

        Args:
            trip_id: The trip to set the budget for
            budget: Total budget amount
            currency: Currency code (optional, updates trip currency if provided)
        """
        data: dict[str, Any] = {"budget": budget}
        if currency is not None:
            data["currency"] = currency
        result = await api.update_trip_budget(trip_id, data)
        return (
            f"Budget updated!\n"
            f"  Budget: ${result.get('budget', budget):.2f} {result.get('currency', currency or 'USD')}\n"
            f"  Total spent: ${result.get('total_spent', 0):.2f}\n"
            f"  Remaining: ${result.get('remaining', budget):.2f}"
        )

    # ── Flights ──────────────────────────────────────────────────────

    @mcp.tool()
    async def add_flight(
        trip_id: str,
        airline: str,
        flight_number: str,
        departure_airport: str,
        arrival_airport: str,
        departure_time: str,
        arrival_time: str,
        booking_reference: str | None = None,
        cost: float | None = None,
        notes: str | None = None,
    ) -> str:
        """Add a flight to a trip.

        Args:
            trip_id: The trip to add the flight to
            airline: Airline name (e.g. "Japan Airlines")
            flight_number: Flight number (e.g. "JL5")
            departure_airport: Departure airport code (e.g. "SFO")
            arrival_airport: Arrival airport code (e.g. "NRT")
            departure_time: Departure datetime (YYYY-MM-DDTHH:MM)
            arrival_time: Arrival datetime (YYYY-MM-DDTHH:MM)
            booking_reference: Booking confirmation code
            cost: Flight cost
            notes: Additional notes
        """
        data: dict[str, Any] = {
            "airline": airline,
            "flight_number": flight_number,
            "departure_airport": departure_airport,
            "arrival_airport": arrival_airport,
            "departure_time": departure_time,
            "arrival_time": arrival_time,
        }
        for key, val in [
            ("booking_reference", booking_reference),
            ("cost", cost),
            ("notes", notes),
        ]:
            if val is not None:
                data[key] = val

        flight = await api.create_flight(trip_id, data)
        return (
            f"Flight added!\n"
            f"  {flight.get('airline', airline)} {flight.get('flight_number', flight_number)}\n"
            f"  {flight.get('departure_airport', departure_airport)} -> {flight.get('arrival_airport', arrival_airport)}\n"
            f"  Departs: {flight.get('departure_time', departure_time)}\n"
            f"  Arrives: {flight.get('arrival_time', arrival_time)}\n"
            f"  ID: {flight['id']}"
        )

    # ── Accommodations ───────────────────────────────────────────────

    @mcp.tool()
    async def add_accommodation(
        trip_id: str,
        name: str,
        accommodation_type: str = "hotel",
        check_in: str | None = None,
        check_out: str | None = None,
        address: str | None = None,
        booking_reference: str | None = None,
        cost_per_night: float | None = None,
        total_cost: float | None = None,
        notes: str | None = None,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> str:
        """Add an accommodation to a trip.

        Args:
            trip_id: The trip to add the accommodation to
            name: Hotel/hostel/rental name
            accommodation_type: One of: hotel, hostel, airbnb, resort, apartment, camping, other
            check_in: Check-in date (YYYY-MM-DD)
            check_out: Check-out date (YYYY-MM-DD)
            address: Full address
            booking_reference: Booking confirmation code
            cost_per_night: Cost per night
            total_cost: Total cost for the stay
            notes: Additional notes
            latitude: GPS latitude for map pin
            longitude: GPS longitude for map pin
        """
        data: dict[str, Any] = {"name": name, "accommodation_type": accommodation_type}
        for key, val in [
            ("check_in", check_in),
            ("check_out", check_out),
            ("address", address),
            ("booking_reference", booking_reference),
            ("cost_per_night", cost_per_night),
            ("total_cost", total_cost),
            ("notes", notes),
            ("latitude", latitude),
            ("longitude", longitude),
        ]:
            if val is not None:
                data[key] = val

        acc = await api.create_accommodation(trip_id, data)
        return (
            f"Accommodation added!\n"
            f"  Name: {acc['name']}\n"
            f"  Type: {acc.get('accommodation_type', accommodation_type)}\n"
            f"  Check-in: {acc.get('check_in', 'Not set')}\n"
            f"  Check-out: {acc.get('check_out', 'Not set')}\n"
            f"  ID: {acc['id']}"
        )

    # ── Transport ────────────────────────────────────────────────────

    @mcp.tool()
    async def add_transport(
        trip_id: str,
        transport_type: str,
        from_location: str,
        to_location: str,
        departure_time: str | None = None,
        arrival_time: str | None = None,
        cost: float | None = None,
        booking_reference: str | None = None,
        notes: str | None = None,
    ) -> str:
        """Add a ground/sea transport leg to a trip (train, bus, taxi, ferry, etc.).

        Args:
            trip_id: The trip to add the transport to
            transport_type: One of: train, bus, taxi, rideshare, ferry, rental_car, subway, other
            from_location: Departure location
            to_location: Arrival location
            departure_time: Departure datetime (YYYY-MM-DDTHH:MM)
            arrival_time: Arrival datetime (YYYY-MM-DDTHH:MM)
            cost: Cost
            booking_reference: Booking reference
            notes: Additional notes
        """
        data: dict[str, Any] = {
            "transport_type": transport_type,
            "from_location": from_location,
            "to_location": to_location,
        }
        for key, val in [
            ("departure_time", departure_time),
            ("arrival_time", arrival_time),
            ("cost", cost),
            ("booking_reference", booking_reference),
            ("notes", notes),
        ]:
            if val is not None:
                data[key] = val

        transport = await api.create_transport(trip_id, data)
        return (
            f"Transport added!\n"
            f"  Type: {transport.get('transport_type', transport_type)}\n"
            f"  From: {transport.get('from_location', from_location)}\n"
            f"  To: {transport.get('to_location', to_location)}\n"
            f"  ID: {transport['id']}"
        )

    # ── Travel Info ──────────────────────────────────────────────────

    @mcp.tool()
    async def set_travel_info(
        trip_id: str,
        visa_requirements: str | None = None,
        passport_notes: str | None = None,
        vaccination_info: str | None = None,
        travel_insurance: str | None = None,
        emergency_numbers: dict[str, str] | None = None,
        useful_phrases: dict[str, str] | None = None,
        timezone: str | None = None,
        language: str | None = None,
        plug_type: str | None = None,
        notes: str | None = None,
    ) -> str:
        """Set or update travel information for a trip (visa, health, emergency info, etc.).

        This creates or updates a single travel info record per trip (upsert).

        Args:
            trip_id: The trip to set travel info for
            visa_requirements: Visa requirements description
            passport_notes: Passport-related notes
            vaccination_info: Required/recommended vaccinations
            travel_insurance: Insurance details or policy number
            emergency_numbers: Dict of label->number (e.g. {"Police": "110", "Ambulance": "119"})
            useful_phrases: Dict of English->local language (e.g. {"Hello": "Konnichiwa"})
            timezone: Destination timezone (e.g. "Asia/Tokyo")
            language: Primary local language
            plug_type: Electrical plug type (e.g. "Type A/B")
            notes: Additional travel notes
        """
        data: dict[str, Any] = {}
        for key, val in [
            ("visa_requirements", visa_requirements),
            ("passport_notes", passport_notes),
            ("vaccination_info", vaccination_info),
            ("travel_insurance", travel_insurance),
            ("emergency_numbers", emergency_numbers),
            ("useful_phrases", useful_phrases),
            ("timezone", timezone),
            ("language", language),
            ("plug_type", plug_type),
            ("notes", notes),
        ]:
            if val is not None:
                data[key] = val

        if not data:
            return "No travel info fields provided. Specify at least one field."

        info = await api.set_travel_info(trip_id, data)
        fields = [f"  {k}: {v}" for k, v in info.items() if k not in ("id", "trip_id", "created_at", "updated_at") and v]
        return "Travel info updated!\n" + "\n".join(fields)

    # ── Weather ──────────────────────────────────────────────────────

    @mcp.tool()
    async def add_weather_forecast(
        trip_id: str,
        date: str,
        high_temp: float,
        low_temp: float,
        condition: str,
        precipitation_chance: float | None = None,
        humidity: float | None = None,
        notes: str | None = None,
    ) -> str:
        """Add a weather forecast entry for a specific date during the trip.

        Args:
            trip_id: The trip to add the forecast to
            date: Date of the forecast (YYYY-MM-DD)
            high_temp: High temperature (Celsius)
            low_temp: Low temperature (Celsius)
            condition: Weather condition (e.g. "Sunny", "Rainy", "Cloudy", "Partly Cloudy")
            precipitation_chance: Chance of rain/snow as a percentage (0-100)
            humidity: Humidity percentage (0-100)
            notes: Additional weather notes
        """
        data: dict[str, Any] = {
            "date": date,
            "high_temp": high_temp,
            "low_temp": low_temp,
            "condition": condition,
        }
        for key, val in [
            ("precipitation_chance", precipitation_chance),
            ("humidity", humidity),
            ("notes", notes),
        ]:
            if val is not None:
                data[key] = val

        weather = await api.create_weather(trip_id, data)
        return (
            f"Weather forecast added!\n"
            f"  Date: {weather.get('date', date)}\n"
            f"  Condition: {weather.get('condition', condition)}\n"
            f"  High: {weather.get('high_temp', high_temp)}C / Low: {weather.get('low_temp', low_temp)}C\n"
            f"  Precipitation: {weather.get('precipitation_chance', 'N/A')}%"
        )

    # ── Packing ──────────────────────────────────────────────────────

    @mcp.tool()
    async def add_packing_items(
        trip_id: str,
        items: list[dict[str, Any]],
    ) -> str:
        """Add multiple packing items to a trip at once.

        Args:
            trip_id: The trip to add packing items to
            items: List of item dicts with keys: name (required), category (e.g. "clothing", "electronics", "toiletries", "documents", "misc"), quantity (default 1), packed (default false)
        """
        results = []
        for item in items:
            if "name" not in item:
                results.append("  - SKIPPED: missing 'name'")
                continue
            item.setdefault("category", "misc")
            item.setdefault("quantity", 1)
            item.setdefault("packed", False)
            created = await api.create_packing_item(trip_id, item)
            results.append(f"  - {created['name']} ({created.get('category', 'misc')}) x{created.get('quantity', 1)}")

        return f"Added {len(results)} packing items:\n" + "\n".join(results)

    @mcp.tool()
    async def suggest_packing_list(
        trip_id: str,
        items: list[dict[str, Any]],
    ) -> str:
        """Add a complete AI-suggested packing list to a trip.

        Claude generates the packing suggestions based on the trip destination, dates,
        weather, and planned activities, then this tool persists them all.

        Args:
            trip_id: The trip to add the packing list to
            items: List of packing item dicts, each with: name (required), category (clothing/electronics/toiletries/documents/first_aid/misc), quantity (default 1)
        """
        results = []
        for item in items:
            if "name" not in item:
                continue
            item.setdefault("category", "misc")
            item.setdefault("quantity", 1)
            item.setdefault("packed", False)
            created = await api.create_packing_item(trip_id, item)
            results.append(f"  - [{created.get('category', 'misc')}] {created['name']} x{created.get('quantity', 1)}")

        # Group by category for display
        return (
            f"Packing list created with {len(results)} items:\n"
            + "\n".join(results)
            + "\n\nUse the web app to check off items as you pack!"
        )

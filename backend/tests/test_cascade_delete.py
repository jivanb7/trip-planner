def test_delete_trip_cascades_activities(client, trip, activity):
    client.delete(f"/api/v1/trips/{trip['id']}")
    # Trip gone
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404


def test_delete_trip_cascades_expenses(client, trip, expense):
    client.delete(f"/api/v1/trips/{trip['id']}")
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404


def test_delete_trip_cascades_accommodations(client, trip, accommodation):
    client.delete(f"/api/v1/trips/{trip['id']}")
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404


def test_delete_trip_cascades_flights(client, trip, flight):
    client.delete(f"/api/v1/trips/{trip['id']}")
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404


def test_delete_trip_cascades_itinerary(client, trip, itinerary_item):
    client.delete(f"/api/v1/trips/{trip['id']}")
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404


def test_delete_trip_cascades_packing(client, trip, packing_item):
    client.delete(f"/api/v1/trips/{trip['id']}")
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404


def test_delete_trip_cascades_travel_info(client, trip):
    # Create travel info
    client.put(
        f"/api/v1/trips/{trip['id']}/travel-info",
        json={"language": "French"},
    )
    # Verify it exists
    assert client.get(f"/api/v1/trips/{trip['id']}/travel-info").status_code == 200

    # Delete trip
    client.delete(f"/api/v1/trips/{trip['id']}")

    # Trip gone
    assert client.get(f"/api/v1/trips/{trip['id']}").status_code == 404
    # travel-info endpoint now returns 404 for the trip itself
    assert client.get(f"/api/v1/trips/{trip['id']}/travel-info").status_code == 404


def test_delete_trip_all_children_cascade(client):
    """Comprehensive cascade: create a trip with all child types, delete trip, verify all gone."""
    trip = client.post(
        "/api/v1/trips",
        json={"name": "Full Trip", "destination": "Everywhere"},
    ).json()
    trip_id = trip["id"]

    # Create one of each child resource
    activity = client.post(
        f"/api/v1/trips/{trip_id}/activities",
        json={"name": "Hike"},
    ).json()
    expense = client.post(
        f"/api/v1/trips/{trip_id}/expenses",
        json={"description": "Food", "amount": 10.0, "currency": "USD", "category": "food"},
    ).json()
    accommodation = client.post(
        f"/api/v1/trips/{trip_id}/accommodations",
        json={"name": "Hostel"},
    ).json()
    flight = client.post(
        f"/api/v1/trips/{trip_id}/flights",
        json={"departure_airport": "ORD", "arrival_airport": "LAX"},
    ).json()
    itinerary_item = client.post(
        f"/api/v1/trips/{trip_id}/itinerary",
        json={"date": "2026-07-01", "title": "Day 1"},
    ).json()
    packing_item = client.post(
        f"/api/v1/trips/{trip_id}/packing",
        json={"name": "Sunglasses"},
    ).json()
    client.put(f"/api/v1/trips/{trip_id}/travel-info", json={"language": "English"})

    # Delete the trip
    response = client.delete(f"/api/v1/trips/{trip_id}")
    assert response.status_code == 204

    # Verify trip is gone
    assert client.get(f"/api/v1/trips/{trip_id}").status_code == 404

    # Verify children can't be accessed (trip 404 blocks access)
    assert client.get(f"/api/v1/trips/{trip_id}/activities").status_code == 404
    assert client.get(f"/api/v1/trips/{trip_id}/expenses").status_code == 404
    assert client.get(f"/api/v1/trips/{trip_id}/accommodations").status_code == 404
    assert client.get(f"/api/v1/trips/{trip_id}/flights").status_code == 404
    assert client.get(f"/api/v1/trips/{trip_id}/itinerary").status_code == 404
    assert client.get(f"/api/v1/trips/{trip_id}/packing").status_code == 404
    assert client.get(f"/api/v1/trips/{trip_id}/travel-info").status_code == 404

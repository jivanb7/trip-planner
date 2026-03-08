def test_get_travel_info_not_found(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/travel-info")
    assert response.status_code == 404


def test_get_travel_info_trip_not_found(client):
    response = client.get("/api/v1/trips/nonexistent-id/travel-info")
    assert response.status_code == 404


def test_put_travel_info_creates(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/travel-info",
        json={
            "visa_requirements": "No visa required",
            "language": "French",
            "timezone": "Europe/Paris",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["visa_requirements"] == "No visa required"
    assert data["language"] == "French"
    assert data["timezone"] == "Europe/Paris"
    assert data["trip_id"] == trip["id"]


def test_put_travel_info_updates(client, trip):
    # First PUT creates
    client.put(
        f"/api/v1/trips/{trip['id']}/travel-info",
        json={"language": "French", "timezone": "Europe/Paris"},
    )
    # Second PUT updates
    response = client.put(
        f"/api/v1/trips/{trip['id']}/travel-info",
        json={"language": "French (updated)", "power_outlet": "Type E"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "French (updated)"
    assert data["power_outlet"] == "Type E"


def test_get_travel_info_after_put(client, trip):
    client.put(
        f"/api/v1/trips/{trip['id']}/travel-info",
        json={"language": "French", "local_currency": "EUR"},
    )
    response = client.get(f"/api/v1/trips/{trip['id']}/travel-info")
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "French"
    assert data["local_currency"] == "EUR"


def test_put_travel_info_with_json_fields(client, trip):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/travel-info",
        json={
            "emergency_numbers": {"police": "17", "ambulance": "15"},
            "useful_phrases": ["Bonjour", "Merci", "Au revoir"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["emergency_numbers"] == {"police": "17", "ambulance": "15"}
    assert data["useful_phrases"] == ["Bonjour", "Merci", "Au revoir"]


def test_put_travel_info_trip_not_found(client):
    response = client.put(
        "/api/v1/trips/nonexistent-id/travel-info",
        json={"language": "French"},
    )
    assert response.status_code == 404


def test_one_travel_info_per_trip(client, trip):
    # Multiple PUTs should upsert, not create multiple records
    for _ in range(3):
        client.put(
            f"/api/v1/trips/{trip['id']}/travel-info",
            json={"language": "French"},
        )
    response = client.get(f"/api/v1/trips/{trip['id']}/travel-info")
    assert response.status_code == 200
    # Only one record exists — GET returns it, not a list
    data = response.json()
    assert isinstance(data, dict)
    assert data["trip_id"] == trip["id"]

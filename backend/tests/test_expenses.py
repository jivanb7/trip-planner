def test_create_expense(client, trip):
    response = client.post(
        f"/api/v1/trips/{trip['id']}/expenses",
        json={"description": "Lunch", "amount": 20.0, "currency": "USD", "category": "food"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "Lunch"
    assert data["amount"] == 20.0
    assert data["currency"] == "USD"
    assert data["amount_usd"] == 20.0
    assert data["trip_id"] == trip["id"]


def test_create_expense_currency_conversion(client, trip):
    # 100 EUR at 1.08 rate = 108 USD
    response = client.post(
        f"/api/v1/trips/{trip['id']}/expenses",
        json={"description": "Museum", "amount": 100.0, "currency": "EUR", "category": "entertainment"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount_usd"] == 108.0


def test_create_expense_trip_not_found(client):
    response = client.post(
        "/api/v1/trips/nonexistent-id/expenses",
        json={"description": "Coffee", "amount": 5.0, "currency": "USD", "category": "food"},
    )
    assert response.status_code == 404


def test_list_expenses_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/expenses")
    assert response.status_code == 200
    assert response.json() == []


def test_list_expenses(client, trip, expense):
    response = client.get(f"/api/v1/trips/{trip['id']}/expenses")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == expense["id"]


def test_get_expense(client, trip, expense):
    response = client.get(f"/api/v1/trips/{trip['id']}/expenses/{expense['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == expense["id"]


def test_get_expense_not_found(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/expenses/nonexistent-id")
    assert response.status_code == 404


def test_update_expense(client, trip, expense):
    response = client.put(
        f"/api/v1/trips/{trip['id']}/expenses/{expense['id']}",
        json={"description": "Fancy Dinner", "amount": 100.0},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Fancy Dinner"
    assert data["amount"] == 100.0


def test_delete_expense(client, trip, expense):
    response = client.delete(f"/api/v1/trips/{trip['id']}/expenses/{expense['id']}")
    assert response.status_code == 204
    get_response = client.get(f"/api/v1/trips/{trip['id']}/expenses/{expense['id']}")
    assert get_response.status_code == 404


def test_delete_expense_not_found(client, trip):
    response = client.delete(f"/api/v1/trips/{trip['id']}/expenses/nonexistent-id")
    assert response.status_code == 404


def test_expense_summary_empty(client, trip):
    response = client.get(f"/api/v1/trips/{trip['id']}/expenses/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["categories"] == []
    assert data["grand_total_usd"] == 0.0


def test_expense_summary_per_category(client, trip):
    # Create expenses in multiple categories
    client.post(
        f"/api/v1/trips/{trip['id']}/expenses",
        json={"description": "Lunch", "amount": 20.0, "currency": "USD", "category": "food"},
    )
    client.post(
        f"/api/v1/trips/{trip['id']}/expenses",
        json={"description": "Dinner", "amount": 40.0, "currency": "USD", "category": "food"},
    )
    client.post(
        f"/api/v1/trips/{trip['id']}/expenses",
        json={"description": "Museum", "amount": 15.0, "currency": "USD", "category": "entertainment"},
    )

    response = client.get(f"/api/v1/trips/{trip['id']}/expenses/summary")
    assert response.status_code == 200
    data = response.json()

    category_map = {c["category"]: c for c in data["categories"]}
    assert "food" in category_map
    assert "entertainment" in category_map
    assert category_map["food"]["total_usd"] == 60.0
    assert category_map["food"]["count"] == 2
    assert category_map["entertainment"]["total_usd"] == 15.0
    assert category_map["entertainment"]["count"] == 1
    assert data["grand_total_usd"] == 75.0


def test_expense_summary_trip_not_found(client):
    response = client.get("/api/v1/trips/nonexistent-id/expenses/summary")
    assert response.status_code == 404

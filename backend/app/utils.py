from fastapi import HTTPException

# Static exchange rates to USD (approximate, MVP only)
EXCHANGE_RATES_TO_USD: dict[str, float] = {
    "USD": 1.0,
    "EUR": 1.08,
    "GBP": 1.27,
    "JPY": 0.0067,
    "CAD": 0.74,
    "AUD": 0.65,
    "CHF": 1.11,
    "CNY": 0.14,
    "INR": 0.012,
    "MXN": 0.058,
    "BRL": 0.20,
    "KRW": 0.00075,
    "SGD": 0.75,
    "HKD": 0.13,
    "NOK": 0.094,
    "SEK": 0.096,
    "DKK": 0.145,
    "NZD": 0.61,
    "ZAR": 0.054,
    "THB": 0.029,
    "TRY": 0.031,
    "AED": 0.272,
    "SAR": 0.267,
    "PLN": 0.25,
    "CZK": 0.044,
}


def convert_to_usd(amount: float, currency: str) -> float:
    """Convert an amount from the given currency to USD using static rates."""
    rate = EXCHANGE_RATES_TO_USD.get(currency.upper(), 1.0)
    return round(amount * rate, 2)


def raise_not_found(entity: str, entity_id: str) -> None:
    """Raise a 404 HTTPException for a missing entity."""
    raise HTTPException(status_code=404, detail=f"{entity} '{entity_id}' not found")

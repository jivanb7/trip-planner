import os

from dotenv import load_dotenv

load_dotenv()

BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
API_BASE: str = f"{BACKEND_URL}/api/v1"

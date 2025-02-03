from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from config import settings

API_KEY = settings.API_KEY
api_key_header = APIKeyHeader(name="X-API-Key")


def check_api_key(api_key: str = Security(api_key_header)):
    """Sprawdza poprawność klucza API."""
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Nieprawidłowy klucz API")
    return api_key

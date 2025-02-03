from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import database
from services import api_skin_service
from services.security import check_api_key

router = APIRouter(prefix="/skins_url", tags=["Skins Url"])
db_dependency = Annotated[Session, Depends(database.get_db)]

@router.get("/{username}")
async def get_skin_url(username: str, api_key: str = Depends(check_api_key)):
    skin_data = await api_skin_service.get_skin_url(username)
    return skin_data
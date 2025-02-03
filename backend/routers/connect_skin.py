from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
import database
from services import connect_skin_service
import base64
from io import BytesIO
import requests
from PIL import Image
from services.security import check_api_key

router = APIRouter(prefix="/connect_skins", tags=["Connect Skin"])
db_dependency = Annotated[Session, Depends(database.get_db)]

class ImageRequest(BaseModel):
    image_url: str 
    image_base64: str
    model: str
class CropRequest(BaseModel):
    left: int
    right: int
    top: int
    bottom: int
@router.post("/")
def connect_skins(request: ImageRequest, api_key: str = Depends(check_api_key)):
    try:
        # Pobierz pierwszy obraz z URL
        response = requests.get(request.image_url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Nie można pobrać obrazu z URL")
        image1_bytes = response.content

        # Dekoduj drugi obraz z base64
        if ',' in request.image_base64:
            # Jeśli base64 zawiera nagłówek, usuń go
            image2_bytes = base64.b64decode(request.image_base64.split(',')[1])
        else:
            # Jeśli base64 jest już czysty, dekoduj bezpośrednio
            image2_bytes = base64.b64decode(request.image_base64)

        # Przekazanie obrazów do serwisu
        result = connect_skin_service.cut_and_overlay_skins(image1_bytes, image2_bytes, request.model)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Błąd przetwarzania obrazów: {str(e)}")
 
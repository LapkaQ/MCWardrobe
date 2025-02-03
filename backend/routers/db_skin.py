from typing import Annotated
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from sqlalchemy.orm import Session
import database
from models import Skin
from services import db_skin_service
from schemas import SkinSchema
from typing import List
from services.security import check_api_key

router = APIRouter(prefix="/skins", tags=["Skins"])
db_dependency = Annotated[Session, Depends(database.get_db)]

import base64

@router.post("/")
async def create_skin(name: str, db: db_dependency, skin: UploadFile = File(...), render: UploadFile = File(...), api_key: str = Depends(check_api_key)):
    skin_data = await skin.read()
    render_data = await render.read()

    db_skin = db_skin_service.create_skin(db, name, skin_data, render_data)
    return {
        "id": db_skin.id,
        "name": db_skin.name,
        "skin": base64.b64encode(db_skin.skin).decode("utf-8"),
        "render": base64.b64encode(db_skin.render).decode("utf-8")
    }
@router.get("/{skin_id}")
async def get_skin(skin_id: int, db: db_dependency, api_key: str = Depends(check_api_key)):
    db_skin = db_skin_service.get_skin(db, skin_id)
    if db_skin is None:
        raise HTTPException(status_code=404, detail="Skin not found")
    return {
        "id": db_skin.id,
        "name": db_skin.name,
        "skin": base64.b64encode(db_skin.skin).decode("utf-8"),
        "render": base64.b64encode(db_skin.render).decode("utf-8")
    }

def blob_to_base64(blob_data: bytes) -> str:
    return base64.b64encode(blob_data).decode('utf-8')

@router.get("/", response_model=List[SkinSchema])
async def get_skins(db:db_dependency, api_key: str = Depends(check_api_key)):
    try:
        skins = db.query(Skin).all()
        skin_list = []
        for skin in skins:
            skin_dict = {
                "id": skin.id,
                "name": skin.name,
                "skin": blob_to_base64(skin.skin),
                "render": blob_to_base64(skin.render) 
            }
            skin_list.append(skin_dict)
        return skin_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
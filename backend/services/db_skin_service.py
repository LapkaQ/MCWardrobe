from sqlalchemy.orm import Session
from models import Skin

def create_skin(db: Session, name: str, skin_data: bytes, render_data: bytes):
    db_skin = Skin(name=name, skin=skin_data, render=render_data)
    db.add(db_skin)
    db.commit()
    db.refresh(db_skin)
    return db_skin

def get_skin(db: Session, skin_id: int):
    return db.query(Skin).filter(Skin.id == skin_id).first()

def get_skins(db: Session):
    return db.query(Skin).all()
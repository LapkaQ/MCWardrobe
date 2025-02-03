from sqlalchemy import Column, Integer, String, LargeBinary
from database import Base

class Skin(Base):
    __tablename__ = "skins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    skin = Column(LargeBinary)
    render = Column(LargeBinary)
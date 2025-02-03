from pydantic import BaseModel

class SkinSchema(BaseModel):
    id: int
    name: str
    skin: str
    render: str 

    class Config:
        from_attributes = True
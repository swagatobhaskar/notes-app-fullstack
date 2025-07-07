from pydantic import BaseModel

class TagBase(BaseModel):
    # id: int
    name: str

class TagCreate(TagBase):
    pass

class TagOut(TagBase):
    id: int

    class Config:
        from_attributes = True

class TagUpdate(BaseModel):
    name: str | None = None

    class Config:
        from_attributes = True

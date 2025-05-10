from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class NoteBase(BaseModel):
    id: int
    title: str
    content: str

class NoteCreate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: int

    class Config:
        from_attributes = True # Needed to read SQLAlchemy objects

# for use with PATCH method
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

from typing import Optional, Self
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
import re

class NoteBase(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

class NoteCreate(NoteBase):
    title: str = Field(..., min_length=30, max_length=50)
    content: str = Field(..., min_length=10)

    @field_validator('title')
    @classmethod
    def check_title_is_not_empty(cls, value: str):
        if not value.strip():
            raise ValueError("Title cannot be empty")
        return value

    @field_validator('title')
    @classmethod
    def title_must_only_contain_allowed_characters(cls, v):
        if not re.match(r'^[a-zA-Z0-9\s-_]+$', v):
            raise ValueError("Title can only contain letters, numbers, spaces, hyphens, and underscores.")
        return v


class NoteOut(NoteBase):
    user_id: int    

    class Config:
        from_attributes = True # Needed to read SQLAlchemy objects

# for use with PATCH method
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

    @field_validator('title')
    @classmethod
    def check_title_if_present_must_not_be_empty(cls, value: str):
        if value is not None and not value.strip():
            raise ValueError("Title cannot be empty")
        return value
    
    @field_validator('title')
    @classmethod
    def title_must_only_contain_allowed_characters(cls, v: str):
        if not re.match(r'^[a-zA-Z0-9\s-_!?.]+$', v):
            raise ValueError("Title can only contain letters, numbers, spaces, hyphens, and underscores.")
        return v

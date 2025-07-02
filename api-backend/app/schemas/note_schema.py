from typing import Optional, Self
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
import re

# from app.models import Tag
from .user_schema import UserOut
from .tag_schema import TagOut
class NoteBase(BaseModel):
    id: int | None = None   # auto-populated
    user_id: int | None = None  # auto-populated
    owner: UserOut | None = None    # auto-populated
    title: str
    content: str
    created_at: datetime | None = None  # auto-populated
    updated_at: datetime | None = None  # auto-populated
    tag_ids: list[int] = []

    class Config:
        arbitrary_types_allowed=True
        from_attributes = True # Needed to read SQLAlchemy objects

class NoteCreate(NoteBase):
    title: str = Field(..., min_length=10, max_length=50)
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
        if not re.match(r'^[a-zA-Z0-9\s\-_!?.,]+$', v):
            raise ValueError("Title can only contain letters, numbers, spaces, hyphens, and underscores.")
        return v


class NoteOut(NoteBase):
    tags: list[TagOut]
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
        if not re.match(r'^[a-zA-Z0-9\s\-_!?.,]+$', v):
            raise ValueError("Title can only contain letters, numbers, spaces, hyphens, and underscores.")
        return v

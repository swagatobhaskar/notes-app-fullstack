from typing import List, Optional, Self
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
import re

from .user_schema import UserOut
from .tag_schema import TagOut
from .folder_schema import FolderOut

"""
If you want an optional list: List[int] | None = None
If you always want a list: List[int] = [] or Field(default_factory=list)
When you POST new notes, the client should not send id, user_id, created_at,
    updated_at. These should come from the DB.
"""

# Base should never have DB-generated fields or nested resolved objects.
# It’s just the common request body shape
class NoteBase(BaseModel):
    title: str
    content: str

# NoteCreate: only fields you expect from the user/client
class NoteCreate(NoteBase):
    title: str = Field(..., min_length=10, max_length=50)
    content: str = Field(..., min_length=10)
    tag_ids: List[int] | None = None
    folder_id: Optional[int] = None
    
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


# Output: includes DB-populated fields + nested relations + from notebase.
class NoteOut(NoteBase):    
    id: int   # auto-populated
    user_id: int  # auto-populated
    owner: UserOut | None = None    # auto-populated
    created_at: datetime | None = None  # auto-populated
    updated_at: datetime | None = None  # auto-populated
    tags: List[TagOut] | None = None
    folder: FolderOut | None = None
    class Config:
        from_attributes = True

# for use with PATCH method
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tag_ids: Optional[List[int]] = None
    folder_id: Optional[int] = None

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

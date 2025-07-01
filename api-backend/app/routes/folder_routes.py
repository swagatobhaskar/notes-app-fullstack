from fastapi import HTTPException, Request, Depends, APIRouter, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.dependencies import get_db, get_current_user
from app.models import User, Note, Tag, Folder
from app.schemas import note_schema

router = APIRouter(prefix="/api/folder", tags=["folder"])

from typing import Optional, Annotated
from fastapi import HTTPException, Request, Depends, APIRouter, Query
from sqlalchemy.orm import Session

from .dependencies import get_db
# from .crud import 

router = APIRouter(prefix="/api/notes", tags=["notes"])



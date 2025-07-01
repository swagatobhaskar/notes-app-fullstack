from fastapi import HTTPException, Request, Depends, APIRouter, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.dependencies import get_db, get_current_user
from app.models import User, Note, Tag
from app.schemas import note_schema

router = APIRouter(prefix="/api/tag", tags=["tag"])

@router.get('/', response_model=list[note_schema.TagOut])
def get_all_tags(db: Session = Depends(get_db)):
    db_tags = db.query(Tag).all()
    return db_tags

@router.get('/{tag_id}', response_model=note_schema.TagOut)
def get_tag_by_id(tag_id: int, db: Session = Depends(get_db)):
    db_tag = db.query(Tag).filter_by(id = tag_id).first()
    
    if not db_tag:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tag with id {tag_id} not found!")
    
    return db_tag


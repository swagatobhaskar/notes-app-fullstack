from fastapi import HTTPException, Request, Depends, APIRouter, Query, Response, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.dependencies import get_db, get_current_user
from app.models import Tag, User
from app.schemas import tag_schema

router = APIRouter(prefix="/api/tag", tags=["tag"])

@router.get('/', response_model=list[tag_schema.TagOut])
def get_all_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_tags = db.query(Tag).filter(Tag.user == current_user).all()
    return db_tags


@router.get('/{tag_id}', response_model=tag_schema.TagOut)
def get_tag_by_id(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_tag = (
        db.query(Tag)
        .filter(Tag.id == tag_id, Tag.user == current_user)
        .first()
    )
    
    if not db_tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with id {tag_id} not found!"
        )
    
    return db_tag


@router.post('/', response_model=tag_schema.TagOut)
def create_tag(
    new_tag: tag_schema.TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if (
        db.query(Tag)
        .filter(Tag.name == new_tag.name, Tag.user == current_user)
        .first()
    ):
        raise HTTPException(status_code=400, detail="Tag already exists!")
    
    try:
        db_new_tag = Tag(name=new_tag.name, user=current_user)
        db.add(db_new_tag)
        db.commit()
        db.refresh(db_new_tag)
        return db_new_tag
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Tag creation failed. Please try again."
        )
    
    
@router.patch('/{tag_id}', response_model=tag_schema.TagOut)
def edit_tag_by_id(
    tag_id: int,
    updated_tag: tag_schema.TagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if tag with the given id exists
    db_tag = (
        db.query(Tag)
        .filter(Tag.id == tag_id, Tag.user == current_user)
        .first()
    )
    
    if not db_tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with id {tag_id} not found!"
        )
    
    # Check if the new name already exists
    if (
        db.query(Tag)
        .filter(Tag.name == updated_tag.name, Tag.user == current_user)
        .first()
    ) is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tag with this name already exists."
        )

    if updated_tag.name:
        db_tag.name = updated_tag.name

        db.commit()
        db.refresh(db_tag)

    return db_tag


@router.delete('/{tag_id}')
def delete_tag_by_id(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_tag_to_delete = (
        db.query(Tag)
        .filter(Tag.id == tag_id, Tag.user == current_user)
        .first()
    )
   
    if not db_tag_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with id {tag_id} not found!"
        )

    try:
        db.delete(db_tag_to_delete)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Tag with id {tag_id} could not be deleted due to related data (conflict)."
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected database error occurred: {str(e)}"
        )
    
    return Response(status_code=status.HTTP_204_NO_CONTENT) # No content is returned as per 204 status

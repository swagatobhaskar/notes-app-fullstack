from fastapi import HTTPException, Request, Depends, APIRouter, Query, Response, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import List

from app.dependencies import get_db, get_current_user
from app.models import Folder, User
from app.schemas import folder_schema

router = APIRouter(prefix="/api/folder", tags=["folder"])

# Return all folders created by the authenticated user
@router.get('/', response_model=list[folder_schema.FolderOut])
def get_all_Folders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_folders = db.query(Folder).filter(Folder.user_id == current_user.id).all()
    return db_folders


@router.get('/{folder_id}', response_model=folder_schema.FolderOut)
def get_folder_by_id(
    folder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    db_folder = (
        db.query(Folder).filter(
            Folder.id == folder_id,
            Folder.user_id == current_user.id
            ).first()
        )
    
    if not db_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Folder with id {folder_id} not found!"
            )
    
    return db_folder



@router.post('/', response_model=folder_schema.FolderOut)
def create_Folder(
    new_Folder: folder_schema.FolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    # Check if folder with this name already exists for the user
    if (
        db.query(Folder).filter(
            Folder.name == new_Folder.name,
            Folder.user_id == current_user.id
            ).first()
        ):
        raise HTTPException(status_code=400, detail="Folder already exists!")
    
    try:
        db_new_Folder = Folder(name=new_Folder.name, user_id=current_user.id)
        db.add(db_new_Folder)
        db.commit()
        db.refresh(db_new_Folder)
        return db_new_Folder
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Folder creation failed. Please try again."
        )
    
@router.patch('/{folder_id}', response_model=folder_schema.FolderOut)
def edit_Folder_by_id(
    folder_id: int,
    updated_Folder: folder_schema.FolderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    # Check if folder with the given id exists
    db_folder = db.query(Folder).filter(Folder.id == folder_id, Folder.user_id == current_user.id).first()
    if not db_folder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Folder with id {folder_id} not found!")
    
    # Check if the new name already exists
    if db.query(Folder).filter(Folder.name == updated_Folder.name, Folder.user_id == current_user.id).first() is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Folder with this name already exists.")

    if updated_Folder.name:
        db_folder.name = updated_Folder.name

        db.commit()
        db.refresh(db_folder)

    return db_folder


@router.delete('/{folder_id}')
def delete_Folder_by_id(
    folder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    db_folder_to_delete = db.query(Folder).filter(Folder.id == folder_id, Folder.user_id == current_user.id).first()
   
    if not db_folder_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Folder with id {folder_id} not found!")

    try:
        db.delete(db_folder_to_delete)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Folder with id {folder_id} could not be deleted due to related data (conflict)."
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected database error occurred: {str(e)}"
        )
    
    return Response(status_code=status.HTTP_204_NO_CONTENT) # No content is returned as per 204 status

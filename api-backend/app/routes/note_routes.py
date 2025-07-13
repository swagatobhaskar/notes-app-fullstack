import logging
from typing import List
from fastapi import HTTPException, Request, Depends, APIRouter, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy import func

from app.dependencies import get_db, get_current_user
from app.models import User, Note, Tag, Folder
from app.schemas import note_schema

router = APIRouter(prefix="/api/note", tags=["note"])


# match where any tag is present
# GET ANY /api/note/search-by-tags?tags=work&tags=urgent [&match=any (optional)]
# match where all the queried tags are present
# GET ALL /api/note/search-by-tags?tags=work&tags=urgent&match=all
@router.get('/search-by-tags', response_model=List[note_schema.NoteOut], status_code=status.HTTP_200_OK)
def get_notes_by_tags(
    tags: List[str] = Query(...),
    match: str = Query("any", regex="^(any|all)$"),  # 'any' OR 'all'
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    # Query notes that have any of the provided tags, for the authenticated user
    # notes_by_tags = (
    #     db.query(Note).join(Note.tags)
    #     .filter(Tag.name.in_(tags), Note.owner==current_user)
    #     .distinct().all()
    # )
    
    query = (db.query(Note).join(Note.tags).filter(Note.owner == current_user))

    if match == "any":
        # OR logic: notes with any of the tags
        query = query.filter(Tag.name.in_(tags)).distinct()
    else:
        # AND logic: notes with all the tags
        query = (
            query.filter(Tag.name.in_(tags))
            .group_by(Note.id)
            .having(func.count(Tag.id) == len(tags))
        )

    notes_by_tags = query.all()

    if not notes_by_tags:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No note found for the queried tags"
        )
    
    return notes_by_tags


# Get notes by folder for the authenticated user
# GET /api/note/folder/{folder_id}
@router.get('/folder/{folder_name}', response_model=List[note_schema.NoteOut], status_code=status.HTTP_200_OK)
def get_notes_by_folder(
    folder_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    notes_by_folder = (
        db.query(Note)
        .join(Folder)
        .filter(
            Folder.name == folder_name,
            Note.owner == current_user
        )
        .all()
    )
    
    if not notes_by_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Note found in this folder"
        )
    
    return notes_by_folder


# get all notes of the logged in user
@router.get("/", response_model=list[note_schema.NoteOut], status_code=status.HTTP_200_OK)
def get_all_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == current_user.id).first()
    if not db_user:
            raise HTTPException(status_code=404, detail="User not found!")
    all_notes_by_user = db.query(Note).filter(Note.user_id == db_user.id).all()

    return all_notes_by_user


@router.get("/{note_id}", response_model=note_schema.NoteOut)
def get_note_by_id(
     note_id: int,
     db: Session = Depends(get_db),
     current_user: User = Depends(get_current_user)
     ):
    db_note = (
        db.query(Note)
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )
    if not db_note:
         raise HTTPException(
              status_code=status.HTTP_404_NOT_FOUND,
              detail=f"Note with id {note_id} not found!"
         )

    return db_note


@router.patch("/{note_id}", response_model=note_schema.NoteOut, status_code=status.HTTP_200_OK)
def patch_note_by_id(
    note_id: int,
    updated_note: note_schema.NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_note = (
        db.query(Note)
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )
    if not db_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found or access denied!")
    
    if updated_note.title :
          db_note.title = updated_note.title
    if updated_note.content:
          db_note.content = updated_note.content
          
    if updated_note.tag_ids:
        # Tag and Note have N:N relation in an association table
        for tag_id in updated_note.tag_ids:
            selected_tag = (
                db.query(Tag)
                .filter(Tag.id == tag_id, Tag.user_id == current_user.id)
                .first()
            )
            if not selected_tag:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Tag with id {tag_id} not found"
                )
            db_note.tags.append(selected_tag)
    
    if updated_note.folder_id:
          db_note.folder_id = updated_note.folder_id

    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note_by_id(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = (
        db.query(Note)
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )

    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found.")

    # REDUNDANT CODE
    # if note.user_id != current_user.id:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="You are not authorized to delete this note."
    #         )

    db.delete(note)
    db.commit()
    return  # No content is returned as per 204 status


@router.post("/", response_model=note_schema.NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    new_note: note_schema.NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_note = Note(title=new_note.title, content=new_note.content, owner=current_user)

        # Associate tags with the note if tags are present
        if new_note.tag_ids:
            for tag_id in new_note.tag_ids:
                tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == current_user.id).first()
                if not tag:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tag with id {tag_id} not found")
                db_note.tags.append(tag)

        # associate a folder with the note if folder is present
        if new_note.folder_id:
            selected_folder = db.query(Folder).filter_by(id = new_note.folder_id).first()
            if not selected_folder:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Folder with id {new_note.folder_id} not found"
                )
            db_note.folder = selected_folder

        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note
    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Note creation failed. Please try again."
        )


import logging
from typing import List
from fastapi import HTTPException, Request, Depends, APIRouter, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.dependencies import get_db, get_current_user
from app.models import User, Note, Tag, Folder
from app.schemas import note_schema

router = APIRouter(prefix="/api/note", tags=["note"])

"""
ChatGPT:
Technically:
    You can declare your routes as async def in FastAPI.
    But the benefit depends on whether your dependencies and I/O calls are async-aware.

Your current routes use sync SQLAlchemy ORM:
```
db: Session = Depends(get_db)
db.query(...)
db.commit()
```
Key point:
    The sync SQLAlchemy ORM uses blocking I/O.
    Even if you make the route async def, the DB call will block the event loop.

So declaring these as async def doesn't make your app faster — it just makes it more confusing.

When is it worth making them async?
    If you switch to SQLAlchemy 2.0 async engine (AsyncSession, async with).
    Or if you use SQLModel or Databases library, which supports async drivers.
    Or if you mix in truly async I/O, like calling an external API with httpx.AsyncClient.
"""

# for testing only
# ------------------------------------ START OF UNSAFE ROUTES ---------------------------------------------------
@router.get("/unsafe", response_model=list[note_schema.NoteOut])
def no_auth_get_all_notes(db: Session = Depends(get_db)):
    all_notes = db.query(Note).all()
    return all_notes

@router.post("/unsafe", response_model=note_schema.NoteOut)
def no_auth_create_note(new_note: note_schema.NoteCreate, db: Session = Depends(get_db)):
    temp_user = db.query(User).filter(User.id == 1).first()
    db_note = Note(title=new_note.title, content=new_note.content, owner=temp_user)

    # Associate tags with the note if tags are present
    if new_note.tag_ids:
        for tag_id in new_note.tag_ids:
            tag = db.query(Tag).filter(Tag.id == tag_id).first()
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


@router.get('/unsafe/tags', response_model=List[note_schema.NoteOut])
def no_auth_get_notes_by_tags(tags: List[str] = Query(...), db: Session = Depends(get_db)):
    # Query blogs that have any of the provided tags
    notes_by_tags = db.query(Note).join(Note.tags).filter(Tag.name.in_(tags)).distinct().all()

    if not notes_by_tags:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No note found for the provided tags"
        )
    
    return notes_by_tags

# ------------------------------------ END OF UNSAFE ROUTES ---------------------------------------------------

# get all notes of the logged in user
@router.get("/", response_model=list[note_schema.NoteOut])
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
    
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
         raise HTTPException(
              status_code=status.HTTP_404_NOT_FOUND,
              detail=f"Note with id {note_id} not found!"
         )

    # If the note exists but does not belong to the current user, raise a Forbidden error
    if db_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this note."
        )

    return db_note

@router.patch("/{note_id}", response_model=note_schema.NoteOut)
def patch_note_by_id(
      note_id: int,
      updated_note: note_schema.NoteUpdate,
      db: Session = Depends(get_db),
      current_user: User = Depends(get_current_user)
      ):
    db_note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not db_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found or access denied!")
    
    if updated_note.title :
          db_note.title = updated_note.title
    if updated_note.content:
          db_note.content = updated_note.content

    db.commit()
    db.refresh(db_note)

    return db_note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note_by_id(note_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found.")

    if note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this note."
            )

    db.delete(note)
    db.commit()
    return  # No content is returned as per 204 status


@router.post("/", response_model=note_schema.NoteOut)
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
                tag = db.query(Tag).filter(Tag.id == tag_id).first()
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


# Retrieve all blogs with their associated tags
# GET /note/tags/?tags=Python&tags=FastAPI
@router.get('/tags', response_model=List[note_schema.NoteOut])
def get_notes_by_tags(
    tags: List[str] = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    # Query notes that have any of the provided tags, for the authenticated user
    notes_by_tags = (
        db.query(Note)
        .join(Note.tags)
        .filter(
            Tag.name.in_(tags),
            Note.owner==current_user
        )
        .distinct()
        .all()
    )

    if not notes_by_tags:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No note found for the provided tags"
        )
    
    return notes_by_tags


# Get notes by folder
@router.get('/folder/{folder_id}', response_model=List[note_schema.NoteOut])
def get_notes_by_folder(
    folder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    # Query notes that belong to the queried folder, for the authenticated user
    notes_by_folder = db.query(Note).filter(
        Note.folder_id == folder_id,
        Note.owner == current_user
        ).all()
    
    if not notes_by_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Note found in this folder"
        )
    
    return notes_by_folder

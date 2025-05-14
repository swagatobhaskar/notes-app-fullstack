import logging
from fastapi import HTTPException, Request, Depends, APIRouter, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.dependencies import get_db, get_current_user
from app.models import User
from app.schemas import user_schema
from app.utils import security
from app.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/", response_model=user_schema.UserOut)
def user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.delete("/", response_model=user_schema.UserDelete)
def delete_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db.delete(current_user)
        db.commit()
        return {"message": "Account deleted successfully."}
    except IntegrityError:
        # Catch integrity error (e.g., foreign key constraint violation)
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot delete user due to linked records.")
    except Exception as e:
        # Catch all other exceptions
        db.rollback()
        logging.exception("Failed to delete user")
        raise HTTPException(status_code=500, detail="Could not delete user, please try again!")


@router.patch("/", response_model=user_schema.UpdateProfileResponse)
def update_profile(
    updated_user: user_schema.UserPatch,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    try:
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found!")
        
        if updated_user.fname:
            db_user.fname = updated_user.fname
        if updated_user.lname:
            db_user.lname = updated_user.lname
        
        if updated_user.email:
            existing_user = db.query(User).filter(User.email == updated_user.email).first()
            if existing_user:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already taken!")
            db_user.email = updated_user.email

        # Update password if old_password is provided
        if updated_user.old_password:
            # Verify old password
            if not security.verify_password(updated_user.old_password, db_user.hashed_password):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password!")

            # Hash the new password before saving it
            db_user.hashed_password = security.hash_password(updated_user.new_password)

        db.commit()
        db.refresh(db_user)

        return {
            "message": "Profile updated successfully.",
            "status_code": status.HTTP_200_OK,
            "user": db_user
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update user information")

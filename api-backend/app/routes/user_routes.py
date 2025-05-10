from typing import Optional, Annotated
from fastapi import HTTPException, Request, Depends, APIRouter, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db
# from .crud import 
from app.models import User
from app.schemas import user_schema
from app.utils import security

router = APIRouter(prefix="/api/user", tags=["user"])

@router.post("/register", response_model=user_schema.UserOut)
def register(new_user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        email = new_user.email,
        hashed_password = security.hash_password(new_user.password),
        fname = new_user.fname,
        lname = new_user.lname
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
    # return {'message': "New user created successfully!"}

@router.post("/login")
def login(user_credentials: user_schema.UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not security.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # generate and return token (if using JWT)
    return {"message": "Login successful"}
    
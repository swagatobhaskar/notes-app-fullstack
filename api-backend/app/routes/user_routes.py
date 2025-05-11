from typing import Optional, Annotated
from fastapi import HTTPException, Request, Depends, APIRouter, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.dependencies import get_db
# from .crud import 
from app.models import User
from app.schemas import user_schema
from app.utils import security, jwt_config

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

# @router.post("/login")#, response_model=user_schema.UserLogin)
# def login(user_credentials: user_schema.UserLogin, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == user_credentials.email).first()
#     if not user or not security.verify_password(user_credentials.password, user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     # generate and return token (if using JWT)
#     return {"message": "Login successful"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Credentials!")
    
    access_token = jwt_config.create_access_token(
        data = {"sub": str(user.id)},
        expires_delta=timedelta(minutes=30)
    )
    return {
        'message': 'login successful!',
        'access_token': access_token,
        'token_type': 'bearer'
        }

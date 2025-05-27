from fastapi import HTTPException, Request, Response, Depends, APIRouter, Query, status, Cookie
# from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import jwt
from jose.exceptions import JWTError
from sqlalchemy.exc import SQLAlchemyError

from app.dependencies import get_db
from app.models import User
from app.schemas import user_schema
from app.utils import security, jwt_config
from app.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=user_schema.UserOutWithToken)
def register(response: Response, new_user: user_schema.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.email == new_user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered!")

    try:
        db_user = User(
            email = new_user.email,
            hashed_password = security.hash_password(new_user.password),
            fname = new_user.fname,
            lname = new_user.lname
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        # Create JWT
        access_token = jwt_config.create_access_token(
            data = {"sub": str(db_user.id)},
            expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
            )
        refresh_token = jwt_config.create_refresh_token(
            data = {"sub": str(db_user.id)},
            expires_delta = timedelta(minutes=settings.refresh_token_expire_days)
        )
    except (JWTError, SQLAlchemyError, Exception) as e:
        # Delete created user or undo any changes if JWT creation fails
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration failed, please try again!")
    
    # Send both access and refresh token as cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,              # Set to True in production with HTTPS
        samesite="strict",        # or 'lax', depending on your frontend/backend separation
        # path="/refresh-token"     # Limit access to only the refresh-token route
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,              # Set to True in production with HTTPS
        samesite="strict",        # or 'lax', depending on your frontend/backend separation
        path="/refresh-token"     # Limit access to only the refresh-token route
    )

    return {
        'message': "New user created successfully!",
        'user': db_user,
        'token_type': 'bearer',
        'access_token': access_token,
        'refresh_token': refresh_token
        }


@router.post("/login", response_model=user_schema.UserLogin)
def login(response: Response,
        #   form_data: OAuth2PasswordRequestForm = Depends(), # not using form data
        login_data: user_schema.LoginInput,
        db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not security.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Credentials!")
    
    try:
        access_token = jwt_config.create_access_token(
            data = {"sub": str(user.id)},
            expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
        )
        refresh_token = jwt_config.create_refresh_token(
            data = {"sub": str(user.id)},
            expires_delta = timedelta(minutes=settings.refresh_token_expire_days)
        )
    except (JWTError, Exception) as e:
        raise HTTPException(status_code=500, detail="Login failed, Please try again!")

    # Send both access and refresh token as cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,              # Set to True in production with HTTPS
        samesite="strict",        # or 'lax', depending on your frontend/backend separation
        # path="/refresh-token"     # Limit access to only the refresh-token route
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,              # Set to True in production with HTTPS
        samesite="strict",        # or 'lax', depending on your frontend/backend separation
        path="/refresh-token"     # Limit access to only the refresh-token route
    )

    return {
        'message': 'login successful!',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'bearer'
        }


@router.post("/refresh-token", response_model=user_schema.TokenSchema)
def refresh_token(response: Response, request: Request, db: Session = Depends(get_db)):
    print("COOKIE: ", request.cookies)
    refresh_token_from_cookie = request.cookies.get("refresh_token")
    if not refresh_token_from_cookie:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    
    try:
        payload = jwt.decode(refresh_token_from_cookie, settings.secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token!")

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found!")
        
        access_token = jwt_config.create_access_token(data={"sub": str(user.id)})
        
        # Send a new access token as cookie
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,              # Set to True in production with HTTPS
            samesite="strict",        # or 'lax', depending on your frontend/backend separation
            # path="/refresh-token"     # Limit access to only the refresh-token route
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired or invalid!")
    

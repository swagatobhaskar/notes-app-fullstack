from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    fname: str | None = None
    lname: str | None = None
    email: EmailStr
    
class UserCreate(UserBase): # Used strictly for receiving input from the client.
    password: str = Field(..., min_length=8)

class UserOut(UserBase):   # Pydantic Model (For Returning Data)
    id: int

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str

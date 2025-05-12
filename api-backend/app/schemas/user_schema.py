from typing import Optional
from typing_extensions import Self
from pydantic import BaseModel, EmailStr, Field, model_validator

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
    message: str
    access_token: str
    token_type: str

class UserOutWithToken(BaseModel):
    message: str
    access_token: str
    token_type: str
    user: UserOut
    
class UserDelete(BaseModel):
    message: str

class UserPatch(BaseModel):
    fname: Optional[str] = None
    lname: Optional[str] = None
    email: Optional[EmailStr] = None
    old_password: Optional[str] = None
    new_password: Optional[str] = None
    confirm_password: Optional[str] = None

    @model_validator(mode='after')
    def check_passwords_match(self) -> Self:
        # check if old_password is present
        if self.old_password:
            # check if new_password and confirm_password are both present
            if not self.new_password or not self.confirm_password:
                raise ValueError('New Password and Confirm Password must be entered!')
        if self.new_password != self.confirm_password:
            raise ValueError('New Password and Confirm Password do not match')
        return self

class UpdateProfileResponse(BaseModel):
    message: str
    status_code: int
    user: UserOut

from pydantic import BaseModel

class FolderBase(BaseModel):
    # id: int
    name: str

class FolderCreate(FolderBase):
    pass


class FolderOut(FolderBase):
    id: int

    class Config:
        from_attributes = True

class FolderUpdate(BaseModel):
    name: str | None = None

    class Config:
        from_attributes = True
        
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, Text, func, UniqueConstraint
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func

from .database import Base


class Folder(Base):
    __tablename__ = 'folders'

    id = Column(Integer, primary_key=True)
    # Different users may create folders for themselves which can have same names
    name = Column(String, nullable=False, unique=False)
    # One to many relation with notes
    notes = relationship('Note', back_populates='folder')
    # Many-to-one relation with User
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='folders')
    
    def __repr__(self):
        return f"Folder(id={self.id}, name={self.name}, user_id={self.user_id})"



note_tag_association = Table(
    'note_tag_association',
    Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id')),
    Column('tag_id', Integer, ForeignKey('tags.id')),
)


class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)   # don't put unique=True, since users can create same named tags
    # Many to many relation with notes
    notes = relationship("Note", secondary=note_tag_association, back_populates='tags')
    # Tags are specific to users
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='tags')
    
    __table_args__ = (
        # This says- “Each user’s tags must be unique per name — but other users can have the same name.”
        UniqueConstraint("user_id", "name", name="uq_user_tag_name"),
    )
    
    def __repr__(self):
        return f"Folder(id={self.id}, name={self.name})"
    

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    fname = Column(String)
    lname = Column(String)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    # One-to-many relation with Note
    notes = relationship("Note", back_populates="owner")
    # One-to-many relation with Folder
    folders = relationship('Folder', back_populates='user')
    # One-to-many relation with Tag
    tags = relationship("Tag", back_populates='user')

    def __repr__(self):
        return f"User(id=${self.id}, email={self.email})"
    
class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    # Many-to-one relation with User
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="notes")
    # many-to-many relation with tags
    tags = relationship("Tag", secondary=note_tag_association, back_populates='notes')
    # many-to-one relation with folder
    folder_id = Column(Integer, ForeignKey('folders.id'))
    folder = relationship('Folder', back_populates='notes')

    def __repr__(self):
        return f"Note(id={self.id}, owner={self.user_id})"

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, Text, func
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import datetime

from .database import Base

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

    def __repr__(self):
        return f"User(id=${self.id}, email={self.email})"
    

note_tag_association = Table(
    'note_tags',
    Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id')),
    Column('tag_id', Integer, ForeignKey('tags.id')),
)

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

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    # Many to many relation with notes
    notes = relationship("Note", secondary=note_tag_association, back_populates='tags')

class Folder(Base):
    __tablename__ = 'folders'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    # One to many relation with notes
    notes = relationship('Note', back_populates='folder')
    
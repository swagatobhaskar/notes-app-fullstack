from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, Text
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
import datetime

from .database import Base

class Note:
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True)
    created_at = Column()
    updated_at = Column()
    title = Column(String, nullable=False)
    content = Column(Text)
    

class User:
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    fname = Column(String, )
    lname = Column(String, )
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, )
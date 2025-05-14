import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

from .config import get_settings

settings = get_settings()

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL') # settings.database_url

ENV = os.getenv("ENV", "development") # settings.env

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

Base = declarative_base()

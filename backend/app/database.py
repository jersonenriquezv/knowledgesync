from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from .config import settings

DATABASE_URL = settings.DATABASE_URL

#Create the database engine
engine = create_engine(DATABASE_URL)
#Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#Base model
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


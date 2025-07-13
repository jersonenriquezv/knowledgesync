from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    notes = relationship("Note", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")


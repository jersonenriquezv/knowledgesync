from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None

class NoteCreate(NoteBase):
    user_id: int

class NoteUpdate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True 
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConversationBase(BaseModel):
    question: str
    answer: str

class ConversationCreate(ConversationBase):
    note_id: int
    user_id: int

class ConversationOut(ConversationBase):
    id: int
    note_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True 
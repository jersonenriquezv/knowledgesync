from pydantic import BaseModel

class AIQuestion(BaseModel):
    question: str
    note_id: int
    user_id: int

class AIResponse(BaseModel):
    answer: str
    conversation_id: int 
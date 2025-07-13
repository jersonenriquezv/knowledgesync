from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
import requests
from ..database import get_db
from ..models.note import Note
from ..models.conversation import Conversation
from ..schemas.ai import AIQuestion, AIResponse
from ..schemas.conversation import ConversationOut
from ..config import settings

router = APIRouter(prefix="/ai", tags=["ai"])

# Configuration for Ollama
OLLAMA_URL = "http://host.docker.internal:11434/api/generate"
OLLAMA_MODEL = "llama2"  # You can change to "mistral", "codellama", etc.

def ask_ollama(prompt: str) -> str:
    """Function to query Ollama"""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()["response"]
        else:
            print(f"Ollama error: {response.status_code}")
            return f"Error querying Ollama: {response.status_code}"
            
    except requests.exceptions.RequestException as e:
        print(f"Connection error with Ollama: {e}")
        return f"Connection error with Ollama: {e}"

@router.post("/ask", response_model=AIResponse)
def ask_ai(question: AIQuestion, db: Session = Depends(get_db)):
    # Verify that the note exists and belongs to the user
    note = db.query(Note).filter(Note.id == question.note_id, Note.user_id == question.user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or access denied")
    
    # Create the prompt for Ollama
    system_prompt = f"""You are an assistant that answers questions about the following note:

Note title: {note.title}

Note content:
{note.content}

Please answer the following question clearly and helpfully:"""

    full_prompt = f"{system_prompt}\n\nQuestion: {question.question}\n\nAnswer:"
    
    # Query Ollama
    ai_answer = ask_ollama(full_prompt)
    
    # Save the conversation
    conversation = Conversation(
        question=question.question,
        answer=ai_answer,
        note_id=question.note_id,
        user_id=question.user_id
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    return AIResponse(answer=ai_answer, conversation_id=conversation.id)

@router.get("/conversations/{note_id}", response_model=List[ConversationOut])
def get_conversations(note_id: int, user_id: int, db: Session = Depends(get_db)):
    # Verify that the note belongs to the user
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or access denied")
    
    conversations = db.query(Conversation).filter(
        Conversation.note_id == note_id,
        Conversation.user_id == user_id
    ).order_by(Conversation.created_at.desc()).all()
    
    return conversations 
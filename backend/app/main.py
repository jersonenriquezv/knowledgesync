# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .models import User, Note, Conversation
from .routers import user as user_router
from .routers import note as note_router
from .routers import ai as ai_router
from .config import settings

# Create the FastAPI app
app = FastAPI(title="KnowledgeSync API", description="API for the KnowledgeSync notes platform")

# Add CORS middleware with environment-aware configuration
origins = [
    "http://localhost:5173",  # Frontend development
    "http://localhost:3000",
    "https://knowledgesync-navy.vercel.app",
]

if settings.ENVIRONMENT == "production":
    # Add your production domain here
    origins.extend([
        "https://yourdomain.com",
        "https://www.yourdomain.com"
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include the user router
app.include_router(user_router.router)
app.include_router(note_router.router)
app.include_router(ai_router.router)

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the KnowledgeSync API"}


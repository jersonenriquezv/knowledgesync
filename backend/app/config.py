import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:pass@db:5432/knowledge_db")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings() 
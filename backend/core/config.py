import os
from pydantic_settings import BaseSettings
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

class Settings(BaseSettings):
    GOOGLE_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

def get_llm():
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY must be set directly or inside .env")
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.3
    )

def get_embeddings():
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY must be set directly or inside .env")
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=settings.GOOGLE_API_KEY
    )

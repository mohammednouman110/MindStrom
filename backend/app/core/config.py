from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    app_name: str = "MindStrom AI API"
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    openai_model: str | None = os.getenv("OPENAI_MODEL")
    n8n_webhook_url: str | None = os.getenv("N8N_WEBHOOK_URL")
    firebase_project_id: str | None = os.getenv("FIREBASE_PROJECT_ID")
    firebase_client_email: str | None = os.getenv("FIREBASE_CLIENT_EMAIL")
    firebase_private_key: str | None = os.getenv("FIREBASE_PRIVATE_KEY")
    allowed_origins: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()

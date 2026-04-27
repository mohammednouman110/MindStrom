from __future__ import annotations

from functools import lru_cache
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore

from app.core.config import get_settings


@lru_cache
def get_firestore_client():
    settings = get_settings()
    if not (settings.firebase_project_id and settings.firebase_client_email and settings.firebase_private_key):
        return None

    if not firebase_admin._apps:
        credentials_payload = {
            "type": "service_account",
            "project_id": settings.firebase_project_id,
            "client_email": settings.firebase_client_email,
            "private_key": settings.firebase_private_key.replace("\\n", "\n"),
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        firebase_admin.initialize_app(credentials.Certificate(credentials_payload))

    return firestore.client()


def store_event(collection_name: str, payload: dict[str, Any]) -> None:
    client = get_firestore_client()
    if not client:
        return
    client.collection(collection_name).add(payload)

from __future__ import annotations

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.schemas import AssistantRequest, AutomationRequest
from app.services.analytics_service import dashboard_snapshot, heatmap_snapshot
from app.services.assistant_service import build_reply_heuristically, build_reply_with_openai
from app.services.automation_service import trigger_workflow
from app.services.firebase_service import store_event
from app.services.learning_service import (
    build_pack_heuristically,
    build_pack_with_openai,
    extract_pdf_text,
)

settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}


@app.post("/api/v1/learning/generate-pack")
async def generate_pack(
    title: str = Form(...),
    content: str = Form(""),
    language: str = Form("en"),
    file: UploadFile | None = File(default=None),
):
    extracted_text = content
    if file:
        file_bytes = await file.read()
        if file.filename and file.filename.lower().endswith(".pdf"):
            extracted_text = f"{content}\n{extract_pdf_text(file_bytes)}".strip()

    pack = await build_pack_with_openai(title, extracted_text, language)
    if pack is None:
        pack = build_pack_heuristically(title, extracted_text, language)

    store_event(
        "learning_packs",
        {
            "title": pack.title,
            "language": language,
            "source": file.filename if file else "text",
        },
    )
    return {"pack": pack.model_dump()}


@app.post("/api/v1/assistant/chat")
async def assistant_chat(payload: AssistantRequest):
    reply = await build_reply_with_openai(payload.topic, payload.prompt, payload.mode, payload.language)
    if reply is None:
        reply = build_reply_heuristically(payload.topic, payload.prompt, payload.mode, payload.language)
    store_event("assistant_requests", payload.model_dump())
    return {"reply": reply}


@app.post("/api/v1/automation/trigger")
async def automation_trigger(payload: AutomationRequest):
    result = await trigger_workflow(payload.topic, payload.steps)
    store_event("automation_runs", payload.model_dump())
    return result


@app.get("/api/v1/analytics/dashboard")
async def analytics_dashboard():
    return dashboard_snapshot()


@app.get("/api/v1/analytics/heatmap")
async def analytics_heatmap():
    return heatmap_snapshot()

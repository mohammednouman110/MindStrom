from __future__ import annotations

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.schemas import (
    AssistantRequest,
    AutomationRequest,
    ChatPayload,
    ReviewPayload,
)
from app.services.analytics_service import (
    dashboard_snapshot,
    heatmap_snapshot,
    retention_curve_data,
)
from app.services.assistant_service import (
    build_reply_heuristically,
    build_reply_with_openai,
    build_neurotutor_reply,
)
from app.services.automation_service import trigger_workflow
from app.services.firebase_service import store_event
from app.services.learning_service import (
    build_pack_heuristically,
    build_pack_with_openai,
    extract_pdf_text,
)
from app.services.topic_service import (
    get_achievements,
    get_flashcards,
    get_heatmap,
    get_profile,
    get_topics,
    record_review,
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


# ── NeuroRecall endpoints ─────────────────────────────────────────

@app.get("/api/v1/neuro/topics")
async def neuro_topics():
    return {"topics": get_topics()}


@app.get("/api/v1/neuro/flashcards")
async def neuro_flashcards():
    return {"flashcards": get_flashcards()}


@app.get("/api/v1/neuro/retention-curve")
async def neuro_retention_curve():
    return {"curve": retention_curve_data()}


@app.get("/api/v1/neuro/achievements")
async def neuro_achievements():
    return {"achievements": get_achievements()}


@app.get("/api/v1/neuro/profile")
async def neuro_profile():
    return get_profile()


@app.get("/api/v1/neuro/heatmap")
async def neuro_heatmap():
    return {"heatmap": get_heatmap()}


@app.post("/api/v1/neuro/review")
async def neuro_review(payload: ReviewPayload):
    counts = record_review(payload.card_id, payload.rating)
    return {"status": "ok", "reviews": counts}


@app.post("/api/v1/neuro/tutor-chat")
async def neuro_tutor_chat(payload: ChatPayload):
    reply = await build_neurotutor_reply(payload.messages, payload.history)
    return {"reply": reply}

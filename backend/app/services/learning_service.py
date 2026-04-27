from __future__ import annotations

from io import BytesIO
import json
from typing import Any

import httpx
from pypdf import PdfReader

from app.core.config import get_settings
from app.schemas import LearningPack


def _normalize_points(text: str) -> list[str]:
    lines = [line.strip(" -") for line in text.replace("\r", "").splitlines() if line.strip()]
    if not lines:
        lines = [part.strip() for part in text.split(".") if part.strip()]
    fallback = [
        "Identify the core concept.",
        "Explain why it matters.",
        "Break it into smaller learnable steps.",
        "Connect it to one real-world action.",
    ]
    return (lines or fallback)[:4]


def extract_pdf_text(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    pages = [page.extract_text() or "" for page in reader.pages[:6]]
    return "\n".join(pages).strip()


def build_pack_heuristically(title: str, content: str, language: str) -> LearningPack:
    points = _normalize_points(content or title)
    return LearningPack(
        title=title,
        category="Custom topic",
        language=language,
        summary=(
            f"{title} is structured into key ideas, memory cues, and direct action steps for faster retention."
            if language == "en"
            else f"{title} को तेज़ रिटेंशन के लिए मुख्य विचारों, मेमोरी संकेतों और लागू करने योग्य कदमों में संरचित किया गया है।"
        ),
        keyPoints=points,
        microLessons=[
            {
                "id": f"lesson-{index + 1}",
                "title": f"Micro lesson {index + 1}" if language == "en" else f"माइक्रो लेसन {index + 1}",
                "duration": f"{5 + index} min",
                "content": point,
                "action": "Explain it with one example." if language == "en" else "इसे एक उदाहरण के साथ समझाइए।",
            }
            for index, point in enumerate(points)
        ],
        flashcards=[
            {
                "id": f"card-{index + 1}",
                "front": f"Key idea {index + 1}" if language == "en" else f"मुख्य विचार {index + 1}",
                "back": point,
                "hint": "Use a real-world example." if language == "en" else "एक वास्तविक उदाहरण चुनिए।",
            }
            for index, point in enumerate(points)
        ],
        quiz=[
            {
                "id": f"quiz-{index + 1}",
                "type": "true_false" if index == 1 else "fill_blank" if index == 2 else "mcq",
                "prompt": (
                    f"What is the strongest takeaway from {title}?"
                    if index == 0
                    else f"{point} can be learned without context."
                    if index == 1
                    else f"The best first ____ for applying {title} is deliberate practice."
                ),
                "options": [point, "Ignore fundamentals", "Skip examples", "Avoid review"]
                if index == 0
                else ["True", "False"]
                if index == 1
                else ["step", "color", "month", "tool"],
                "answer": point if index == 0 else "False" if index == 1 else "step",
                "explanation": "Correct answers connect understanding, context, and practice.",
                "difficulty": index + 1,
            }
            for index, point in enumerate(points[:3])
        ],
    )


async def build_pack_with_openai(title: str, content: str, language: str) -> LearningPack | None:
    settings = get_settings()
    if not (settings.openai_api_key and settings.openai_model):
        return None

    prompt = f"""
Return only valid JSON with keys:
title, category, language, summary, keyPoints, microLessons, flashcards, quiz.

Topic title: {title}
Language: {language}
Content:
{content}
"""
    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openai_model,
                "input": prompt,
            },
        )
        response.raise_for_status()
        payload = response.json()
        raw_text = payload.get("output_text") or ""
        if raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1].rsplit("```", 1)[0]
        data: dict[str, Any] = json.loads(raw_text)
        return LearningPack(**data)

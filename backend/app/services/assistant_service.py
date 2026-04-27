from __future__ import annotations

import json

import httpx

from app.core.config import get_settings


def build_reply_heuristically(topic: str, prompt: str, mode: str, language: str) -> dict:
    intros = {
        "story": f"Think of {topic} as a guide that gets stronger every time you revisit and apply it.",
        "technical": f"{topic} can be understood as a feedback system with signals, memory decay, and adaptive reinforcement.",
        "visual": f"Picture a flow for {topic}: input -> meaning -> recall cue -> practice -> action.",
        "analytical": f"Break {topic} into concept, misunderstanding, reinforcement, and application.",
    }

    if language == "hi":
        intros = {
            "story": f"{topic} ko aise sochiye jaise yeh har review ke baad aur mazboot hota jata hai.",
            "technical": f"{topic} ko ek feedback system ki tarah samajhiye jisme signal, bhoolne ka risk, aur reinforcement shamil hai.",
            "visual": f"{topic} ke liye yeh flow sochiye: input -> arth -> recall cue -> practice -> action.",
            "analytical": f"{topic} ko concept, misunderstanding, reinforcement, aur application mein baantiye.",
        }

    return {
        "title": "AI Tutor Response" if language == "en" else "AI Tutor Uttar",
        "response": f"{intros.get(mode, intros['story'])} Focus area: {prompt}",
        "examples": [
            "Connect it to a recent project.",
            "Test recall with a fast quiz.",
            "Turn the idea into a practical task.",
        ]
        if language == "en"
        else [
            "Ise haal ki project se jodiye.",
            "Tez quiz se recall check kijiye.",
            "Ise practical task mein badliye.",
        ],
        "nextSteps": ["Write one example", "Name one confusion", "Schedule a review"]
        if language == "en"
        else ["Ek udaharan likhiye", "Ek confusion pehchaniye", "Review schedule kijiye"],
    }


async def build_reply_with_openai(topic: str, prompt: str, mode: str, language: str) -> dict | None:
    settings = get_settings()
    if not (settings.openai_api_key and settings.openai_model):
        return None

    async with httpx.AsyncClient(timeout=40) as client:
        response = await client.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openai_model,
                "input": (
                    f"Reply in {language}. Give a {mode} explanation for topic '{topic}'. "
                    f"User prompt: {prompt}. Return JSON with title, response, examples, nextSteps."
                ),
            },
        )
        response.raise_for_status()
        payload = response.json()
        raw_text = payload.get("output_text") or ""
        if raw_text.startswith("```"):
            raw_text = raw_text.split("\n", 1)[1].rsplit("```", 1)[0]
        if not raw_text.startswith("{"):
            return None
        return json.loads(raw_text)

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
                "instructions": "Return valid JSON with title, response, examples, and nextSteps.",
                "input": (
                    f"Reply in {language}. Give a {mode} explanation for topic '{topic}'. "
                    f"User prompt: {prompt}."
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


_NEURO_SYSTEM = """You are NeuroTutor, an adaptive AI tutor inside NeuroRecall AI - a spaced repetition learning app. The user is Mohammed, a BCA (Bachelor of Computer Applications) student.

Their current memory strengths: JavaScript 78%, Machine Learning 45%, DevOps 62%, System Design 33%, Python 89%, React 71%.

Weakest topics: System Design (33%) and Machine Learning (45%).

Be concise, engaging, and supportive. Use simple analogies. When quizzing, present one question at a time and wait for the answer before revealing it. Format responses with **bold** for key terms. Suggest spaced repetition strategies when relevant."""


async def build_neurotutor_reply(messages: list[dict], history: list[dict]) -> str:
    settings = get_settings()
    conversation = history or messages

    if not (settings.openai_api_key and settings.openai_model):
        last_user = next((_message_content(message) for message in reversed(conversation) if _message_role(message) == "user"), "")
        if not last_user:
            return (
                "Hi Mohammed! I'm **NeuroTutor**, your AI learning companion.\n\n"
                "I can help explain complex concepts, quiz you on weak topics, generate practice questions, and suggest revision strategies.\n\n"
                "Your weakest areas right now are **System Design (33%)** and **Machine Learning (45%)**."
            )

        return (
            "Let's work through that together.\n\n"
            f"You asked: **{last_user}**\n\n"
            "A good next step is to focus on **one idea at a time**, explain it in your own words, and then review it again after a short gap."
        )

    async with httpx.AsyncClient(timeout=40) as client:
        response = await client.post(
            "https://api.openai.com/v1/responses",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openai_model,
                "instructions": _NEURO_SYSTEM,
                "input": _build_neuro_input(conversation),
            },
        )
        response.raise_for_status()
        payload = response.json()
        return payload.get("output_text") or "I couldn't process that. Try again."


def _build_neuro_input(conversation: list[dict]) -> list[dict]:
    items: list[dict] = []
    for message in conversation:
        role = _message_role(message)
        content = _message_content(message)
        if role not in {"user", "assistant"} or not isinstance(content, str):
            continue
        items.append({"role": role, "content": content})

    if not items:
        items.append({"role": "user", "content": "Introduce yourself as NeuroTutor and offer help."})

    return items


def _message_role(message: object) -> str | None:
    if isinstance(message, dict):
        role = message.get("role")
    else:
        role = getattr(message, "role", None)
    return role if isinstance(role, str) else None


def _message_content(message: object) -> str:
    if isinstance(message, dict):
        content = message.get("content", "")
    else:
        content = getattr(message, "content", "")
    return content if isinstance(content, str) else ""

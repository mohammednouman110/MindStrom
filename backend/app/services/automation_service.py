from __future__ import annotations

import httpx

from app.core.config import get_settings


async def trigger_workflow(topic: str, steps: list[str]) -> dict:
    settings = get_settings()
    payload = {
        "topic": topic,
        "steps": steps,
        "message": f"Convert learning progress for {topic} into actionable workflow steps.",
    }

    if settings.n8n_webhook_url:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(settings.n8n_webhook_url, json=payload)
            response.raise_for_status()
        return {"status": "sent", "detail": "Workflow sent to n8n.", "payload": payload}

    return {"status": "preview", "detail": "n8n webhook is not configured yet.", "payload": payload}

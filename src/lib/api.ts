import {
  AssistantMode,
  Locale,
  NeuroAchievement,
  NeuroCurvePoint,
  NeuroFlashcard,
  NeuroHeatmap,
  NeuroProfile,
  NeuroTopic,
  NeuroTutorMessage,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return (await response.json()) as T;
}

export function hasBackendApi() {
  return Boolean(API_BASE);
}

export async function generateLearningPackRequest(formData: FormData) {
  if (!API_BASE) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE}/api/v1/learning/generate-pack`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
}

export async function assistantChatRequest(payload: {
  topic: string;
  prompt: string;
  mode: AssistantMode;
  language: Locale;
}) {
  if (!API_BASE) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE}/api/v1/assistant/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function triggerAutomationRequest(payload: {
  topic: string;
  steps: string[];
}) {
  if (!API_BASE) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE}/api/v1/automation/trigger`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

// ── NeuroRecall API ──────────────────────────────────────────────

export async function getNeuroTopics() {
  if (!API_BASE) return { topics: [] };
  const res = await fetch(`${API_BASE}/api/v1/neuro/topics`);
  return handleResponse<{ topics: NeuroTopic[] }>(res);
}

export async function getNeuroFlashcards() {
  if (!API_BASE) return { flashcards: [] };
  const res = await fetch(`${API_BASE}/api/v1/neuro/flashcards`);
  return handleResponse<{ flashcards: NeuroFlashcard[] }>(res);
}

export async function getNeuroRetentionCurve() {
  if (!API_BASE) return { curve: [] };
  const res = await fetch(`${API_BASE}/api/v1/neuro/retention-curve`);
  return handleResponse<{ curve: NeuroCurvePoint[] }>(res);
}

export async function getNeuroAchievements() {
  if (!API_BASE) return { achievements: [] };
  const res = await fetch(`${API_BASE}/api/v1/neuro/achievements`);
  return handleResponse<{ achievements: NeuroAchievement[] }>(res);
}

export async function getNeuroProfile() {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/api/v1/neuro/profile`);
  return handleResponse<NeuroProfile>(res);
}

export async function getNeuroHeatmap() {
  if (!API_BASE) return { heatmap: {} as NeuroHeatmap };
  const res = await fetch(`${API_BASE}/api/v1/neuro/heatmap`);
  return handleResponse<{ heatmap: NeuroHeatmap }>(res);
}

export async function postNeuroReview(cardId: number, rating: string) {
  if (!API_BASE) return { status: "demo" };
  const res = await fetch(`${API_BASE}/api/v1/neuro/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ card_id: cardId, rating }),
  });
  return handleResponse<{ status: string; reviews: Record<string, number> }>(res);
}

export async function postNeuroTutorChat(
  messages: NeuroTutorMessage[],
  history: NeuroTutorMessage[],
) {
  if (!API_BASE) return { reply: "" };
  const res = await fetch(`${API_BASE}/api/v1/neuro/tutor-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, history }),
  });
  return handleResponse<{ reply: string }>(res);
}

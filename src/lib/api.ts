import { AssistantMode, Locale } from "@/lib/types";

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

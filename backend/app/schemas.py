from pydantic import BaseModel


class AssistantRequest(BaseModel):
    topic: str
    prompt: str
    mode: str
    language: str = "en"


class AutomationRequest(BaseModel):
    topic: str
    steps: list[str]


class QuizQuestion(BaseModel):
    id: str
    type: str
    prompt: str
    options: list[str]
    answer: str
    explanation: str
    difficulty: int


class Flashcard(BaseModel):
    id: str
    front: str
    back: str
    hint: str


class MicroLesson(BaseModel):
    id: str
    title: str
    duration: str
    content: str
    action: str


class LearningPack(BaseModel):
    title: str
    category: str
    language: str
    summary: str
    keyPoints: list[str]
    microLessons: list[MicroLesson]
    flashcards: list[Flashcard]
    quiz: list[QuizQuestion]


# ── NeuroRecall schemas ────────────────────────────────────────────

class TopicOut(BaseModel):
    id: int
    name: str
    icon: str
    color: str
    strength: int
    cards: int
    next: str
    cat: str


class FlashcardOut(BaseModel):
    id: int
    topic: str
    tc: str
    q: str
    a: str
    diff: str
    last: str
    str: int


class ReviewPayload(BaseModel):
    card_id: int
    rating: str  # again | hard | good | easy


class RetentionPoint(BaseModel):
    d: str
    ret: int
    no: int


class AchievementOut(BaseModel):
    id: int
    name: str
    desc: str
    icon: str
    unlocked: bool


class ProfileOut(BaseModel):
    name: str
    role: str
    xp: int
    xpMax: int
    level: int
    streak: int
    cards_reviewed: str
    avg_retention: str
    active_topics: str
    total_hours: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatPayload(BaseModel):
    messages: list[ChatMessage]
    history: list[ChatMessage]


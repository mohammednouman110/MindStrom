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

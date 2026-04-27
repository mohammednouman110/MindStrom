export type Locale = "en" | "hi";
export type ThemeMode = "light" | "dark";
export type QuestionType = "mcq" | "true_false" | "fill_blank";
export type AssistantMode = "story" | "technical" | "visual" | "analytical";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: number;
}

export interface MicroLesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  action: string;
}

export interface ConfusionZone {
  concept: string;
  score: number;
  reason: string;
}

export interface StudySignal {
  focusWindow: string;
  sessionMinutes: number;
  breakMinutes: number;
  energyScore: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: string;
  language: Locale;
  sourceType: "notes" | "pdf" | "paste";
  summary: string;
  keyPoints: string[];
  microLessons: MicroLesson[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  retentionScore: number;
  confusionScore: number;
  difficultyScore: number;
  nextReviewAt: string;
  predictedForgetAt: string;
  studySignal: StudySignal;
  confusionZones: ConfusionZone[];
  retentionCurve: number[];
  automationIdeas: string[];
  reviewHistory: Array<{
    timestamp: string;
    correct: boolean;
    hesitation: number;
  }>;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  streak: number;
}

export interface WorkflowNode {
  id: string;
  label: string;
  description: string;
  kind: "trigger" | "ai" | "action" | "review";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  level: number;
  achievements: string[];
  preferredLanguage: Locale;
  syncMode: "demo" | "firebase";
}

export interface DashboardMetrics {
  averageRetention: number;
  averageConfusion: number;
  weeklyReviews: number;
  dueToday: number;
  focusScore: number;
  projectedForgetRisk: number;
}

export interface HeatmapCell {
  label: string;
  retention: number;
  confusion: number;
  difficulty: number;
}

export interface LearningPack {
  title: string;
  category: string;
  language: Locale;
  summary: string;
  keyPoints: string[];
  microLessons: MicroLesson[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface AssistantReply {
  title: string;
  response: string;
  examples: string[];
  nextSteps: string[];
}

export interface AuthPayload {
  name?: string;
  email: string;
  password: string;
}

import {
  DashboardMetrics,
  HeatmapCell,
  LearningTopic,
  QuizQuestion,
  UserProfile,
  WorkflowNode,
} from "@/lib/types";

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function hoursUntil(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.round(diff / (1000 * 60 * 60));
}

export function formatRelativeWindow(isoDate: string) {
  const hours = hoursUntil(isoDate);
  if (hours < 1) {
    return "Now";
  }
  if (hours < 24) {
    return `In ${hours}h`;
  }
  const days = Math.round(hours / 24);
  return `In ${days}d`;
}

export function buildDashboardMetrics(topics: LearningTopic[]): DashboardMetrics {
  const averageRetention =
    Math.round(topics.reduce((sum, topic) => sum + topic.retentionScore, 0) / topics.length) || 0;
  const averageConfusion =
    Math.round(topics.reduce((sum, topic) => sum + topic.confusionScore, 0) / topics.length) || 0;
  const weeklyReviews = topics.reduce((sum, topic) => sum + topic.reviewHistory.length, 0);
  const dueToday = topics.filter((topic) => hoursUntil(topic.nextReviewAt) <= 24).length;
  const focusScore =
    Math.round(topics.reduce((sum, topic) => sum + topic.studySignal.energyScore, 0) / topics.length) || 0;
  const projectedForgetRisk =
    Math.round(topics.reduce((sum, topic) => sum + (100 - topic.retentionScore), 0) / topics.length) || 0;

  return {
    averageRetention,
    averageConfusion,
    weeklyReviews,
    dueToday,
    focusScore,
    projectedForgetRisk,
  };
}

export function buildHeatmap(topics: LearningTopic[]): HeatmapCell[] {
  return topics.flatMap((topic) =>
    topic.confusionZones.map((zone) => ({
      label: zone.concept,
      retention: clamp(topic.retentionScore - zone.score / 4, 8, 99),
      confusion: zone.score,
      difficulty: clamp(topic.difficultyScore + zone.score / 5, 10, 100),
    })),
  );
}

export function buildDailyPlan(topics: LearningTopic[]) {
  return [...topics]
    .sort(
      (left, right) =>
        left.retentionScore - right.retentionScore || hoursUntil(left.nextReviewAt) - hoursUntil(right.nextReviewAt),
    )
    .slice(0, 4)
    .map((topic) => ({
      id: topic.id,
      title: topic.title,
      focus: topic.studySignal.focusWindow,
      revisionWindow: formatRelativeWindow(topic.nextReviewAt),
      action:
        topic.confusionScore > 45
          ? "Target weak concept revision"
          : topic.retentionScore < 70
            ? "Rapid spaced repetition sprint"
            : "Maintain with quick recall review",
    }));
}

export function rankDifficulty(topics: LearningTopic[]) {
  return [...topics].sort((left, right) => right.difficultyScore - left.difficultyScore);
}

export function getAdaptiveQuiz(topic: LearningTopic) {
  const targetDifficulty = topic.retentionScore > 80 ? 3 : topic.confusionScore > 40 ? 1 : 2;
  return [...topic.quiz]
    .sort((left, right) => Math.abs(left.difficulty - targetDifficulty) - Math.abs(right.difficulty - targetDifficulty))
    .slice(0, 3);
}

export function evaluateQuizAnswer(topic: LearningTopic, questionId: string, selectedAnswer: string) {
  const question = topic.quiz.find((item) => item.id === questionId);
  if (!question) {
    return null;
  }

  const correct = question.answer.toLowerCase() === selectedAnswer.trim().toLowerCase();
  const retentionDelta = correct ? 4 : -5;
  const confusionDelta = correct ? -4 : 9;
  const difficultyDelta = correct ? -2 : 4;
  const updatedTopic: LearningTopic = {
    ...topic,
    retentionScore: clamp(topic.retentionScore + retentionDelta, 15, 99),
    confusionScore: clamp(topic.confusionScore + confusionDelta, 5, 99),
    difficultyScore: clamp(topic.difficultyScore + difficultyDelta, 10, 99),
    nextReviewAt: new Date(Date.now() + (correct ? 26 : 6) * 60 * 60 * 1000).toISOString(),
    predictedForgetAt: new Date(Date.now() + (correct ? 7 : 3) * 24 * 60 * 60 * 1000).toISOString(),
    reviewHistory: [
      {
        timestamp: new Date().toISOString(),
        correct,
        hesitation: correct ? 2 : 7,
      },
      ...topic.reviewHistory,
    ].slice(0, 12),
  };

  return {
    updatedTopic,
    correct,
    explanation: question.explanation,
    xpDelta: correct ? 24 : 8,
  };
}

export function deriveLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 400) + 1);
}

export function rewardUser(user: UserProfile, xpDelta: number, correct: boolean) {
  const xp = user.xp + xpDelta;
  return {
    ...user,
    xp,
    streak: correct ? user.streak + 1 : user.streak,
    level: deriveLevel(xp),
  };
}

export function buildSuggestedWorkflow(topic: LearningTopic): WorkflowNode[] {
  return [
    {
      id: `${topic.id}-trigger`,
      label: "Quiz score drops",
      description: "Start automation when confidence falls below threshold.",
      kind: "trigger",
    },
    {
      id: `${topic.id}-ai`,
      label: "Confusion analyzer",
      description: `Map weak areas in ${topic.title} to actionable revisions.`,
      kind: "ai",
    },
    {
      id: `${topic.id}-task`,
      label: "Create task",
      description: "Send revision checklist to a task manager.",
      kind: "action",
    },
    {
      id: `${topic.id}-calendar`,
      label: "Calendar review block",
      description: "Schedule the next review at the ideal focus window.",
      kind: "review",
    },
  ];
}

export function getStatusTone(score: number) {
  if (score >= 80) {
    return "emerald";
  }
  if (score >= 60) {
    return "amber";
  }
  return "rose";
}

export function questionTypeLabel(type: QuizQuestion["type"]) {
  if (type === "mcq") {
    return "MCQ";
  }
  if (type === "true_false") {
    return "True / False";
  }
  return "Fill in the blank";
}

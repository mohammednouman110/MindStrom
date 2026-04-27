import {
  LeaderboardEntry,
  LearningTopic,
  Locale,
  UserProfile,
  WorkflowNode,
} from "@/lib/types";

const now = Date.now();
const hoursFromNow = (hours: number) => new Date(now + hours * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number) => new Date(now + days * 24 * 60 * 60 * 1000).toISOString();

export const demoUser: UserProfile = {
  id: "demo-user",
  name: "Aarav Mehta",
  email: "aarav@mindstrom.ai",
  role: "Research learner",
  xp: 2840,
  streak: 19,
  level: 8,
  achievements: ["Deep Work", "7-Day Mastery", "Automation Pilot"],
  preferredLanguage: "en",
  syncMode: "demo",
};

export const demoTopics: LearningTopic[] = [
  {
    id: "devops-foundations",
    title: "DevOps Foundations",
    category: "Engineering",
    language: "en",
    sourceType: "paste",
    summary:
      "A systems view of CI/CD, observability, infrastructure as code, and resilient release pipelines.",
    keyPoints: [
      "CI validates each change quickly and consistently.",
      "CD reduces risk by shipping small increments with rollback paths.",
      "Observability links metrics, logs, and traces for faster diagnosis.",
      "Infrastructure as code makes environments repeatable.",
    ],
    microLessons: [
      {
        id: "devops-1",
        title: "Pipeline Thinking",
        duration: "6 min",
        content:
          "Map source control, build, test, deploy, and rollback as one feedback system rather than isolated tools.",
        action: "Sketch your current deployment pipeline in 5 steps.",
      },
      {
        id: "devops-2",
        title: "Observability Stack",
        duration: "8 min",
        content:
          "Use metrics for trend detection, logs for detail, and traces for request-level causality.",
        action: "Name one metric, one log pattern, and one trace signal for your app.",
      },
    ],
    flashcards: [
      {
        id: "fc-devops-1",
        front: "Why does CI lower integration risk?",
        back: "It validates every change quickly so issues surface before they compound.",
        hint: "Think rapid feedback.",
      },
      {
        id: "fc-devops-2",
        front: "What makes CD safe?",
        back: "Small releases, feature flags, observability, and rollback paths.",
        hint: "It is not just faster deploys.",
      },
    ],
    quiz: [
      {
        id: "q-devops-1",
        type: "mcq",
        prompt: "Which practice makes infrastructure reproducible?",
        options: ["Manual configuration", "Infrastructure as code", "Daily standups", "Shadow deployment"],
        answer: "Infrastructure as code",
        explanation: "IaC version-controls environment definitions and reduces configuration drift.",
        difficulty: 2,
      },
      {
        id: "q-devops-2",
        type: "true_false",
        prompt: "Observability only means collecting logs.",
        options: ["True", "False"],
        answer: "False",
        explanation: "Observability combines logs, metrics, and traces to explain system behavior.",
        difficulty: 1,
      },
      {
        id: "q-devops-3",
        type: "fill_blank",
        prompt: "Continuous delivery reduces risk by shipping in ____ increments.",
        options: ["small", "large", "monthly", "isolated"],
        answer: "small",
        explanation: "Smaller changes are easier to validate, monitor, and roll back.",
        difficulty: 3,
      },
    ],
    retentionScore: 82,
    confusionScore: 28,
    difficultyScore: 45,
    nextReviewAt: hoursFromNow(18),
    predictedForgetAt: daysFromNow(6),
    studySignal: {
      focusWindow: "7:30 PM - 8:20 PM",
      sessionMinutes: 42,
      breakMinutes: 8,
      energyScore: 86,
    },
    confusionZones: [
      { concept: "Tracing vs logging", score: 62, reason: "Repeated mix-up in diagnostic questions." },
      { concept: "Feature flags", score: 41, reason: "Slower response times during review." },
    ],
    retentionCurve: [96, 90, 82, 76, 69, 63, 56],
    automationIdeas: [
      "Create a calendar block for weekly release retro.",
      "Push CI checklist to task manager before sprint close.",
    ],
    reviewHistory: [
      { timestamp: daysFromNow(-3), correct: true, hesitation: 2 },
      { timestamp: daysFromNow(-2), correct: false, hesitation: 7 },
      { timestamp: daysFromNow(-1), correct: true, hesitation: 3 },
    ],
  },
  {
    id: "neural-networks",
    title: "Neural Networks for Applied ML",
    category: "AI",
    language: "en",
    sourceType: "notes",
    summary:
      "A practical overview of forward passes, loss minimization, backpropagation, and generalization strategies.",
    keyPoints: [
      "Forward propagation turns features into predictions.",
      "Loss quantifies the model's error.",
      "Backpropagation distributes gradient signals through the network.",
      "Regularization improves generalization on new data.",
    ],
    microLessons: [
      {
        id: "nn-1",
        title: "Gradient Intuition",
        duration: "5 min",
        content:
          "A gradient shows which direction changes parameters toward lower loss and how strongly to move.",
        action: "Explain learning rate to yourself in one sentence.",
      },
      {
        id: "nn-2",
        title: "Generalization Check",
        duration: "7 min",
        content:
          "Validation performance matters because training accuracy can hide overfitting.",
        action: "List two signs that your model memorized noise.",
      },
    ],
    flashcards: [
      {
        id: "fc-nn-1",
        front: "What is the purpose of a loss function?",
        back: "It measures prediction error so optimization knows what to reduce.",
        hint: "It is the training compass.",
      },
      {
        id: "fc-nn-2",
        front: "Why use regularization?",
        back: "To reduce overfitting and improve performance on unseen examples.",
        hint: "Think beyond the training set.",
      },
    ],
    quiz: [
      {
        id: "q-nn-1",
        type: "mcq",
        prompt: "What does backpropagation primarily compute?",
        options: ["Dataset size", "Gradients", "Embeddings", "GPU memory"],
        answer: "Gradients",
        explanation: "Backpropagation computes gradients of the loss with respect to parameters.",
        difficulty: 3,
      },
      {
        id: "q-nn-2",
        type: "true_false",
        prompt: "High training accuracy always means strong generalization.",
        options: ["True", "False"],
        answer: "False",
        explanation: "A model can overfit training data while failing on validation data.",
        difficulty: 2,
      },
      {
        id: "q-nn-3",
        type: "fill_blank",
        prompt: "To avoid unstable updates, tune the learning ____ carefully.",
        options: ["rate", "dataset", "label", "epoch"],
        answer: "rate",
        explanation: "Learning rate controls parameter step size during optimization.",
        difficulty: 2,
      },
    ],
    retentionScore: 74,
    confusionScore: 49,
    difficultyScore: 72,
    nextReviewAt: hoursFromNow(10),
    predictedForgetAt: daysFromNow(4),
    studySignal: {
      focusWindow: "6:45 AM - 7:25 AM",
      sessionMinutes: 38,
      breakMinutes: 6,
      energyScore: 91,
    },
    confusionZones: [
      { concept: "Gradient descent vs backpropagation", score: 78, reason: "Repeated explanation requests." },
      { concept: "Validation loss", score: 55, reason: "Incorrect answer streak in quizzes." },
    ],
    retentionCurve: [93, 84, 74, 67, 58, 48, 39],
    automationIdeas: [
      "Send a reminder to compare train and validation curves every Friday.",
      "Create a notebook task for hyperparameter review.",
    ],
    reviewHistory: [
      { timestamp: daysFromNow(-4), correct: true, hesitation: 4 },
      { timestamp: daysFromNow(-3), correct: false, hesitation: 8 },
      { timestamp: daysFromNow(-1), correct: false, hesitation: 6 },
    ],
  },
  {
    id: "research-methods",
    title: "Research Design and Critical Reading",
    category: "Research",
    language: "en",
    sourceType: "pdf",
    summary:
      "An evidence-first framework for reading papers, spotting bias, evaluating methods, and extracting usable insight.",
    keyPoints: [
      "A good research question is specific, testable, and consequential.",
      "Method quality depends on validity, reliability, and fit.",
      "Bias often enters through sampling, measurement, or interpretation.",
      "Critical reading turns claims into evidence maps.",
    ],
    microLessons: [
      {
        id: "rm-1",
        title: "Bias Scanner",
        duration: "4 min",
        content:
          "Review sample selection, controls, and missing variables before trusting conclusions.",
        action: "Write down one possible bias in the last paper you read.",
      },
      {
        id: "rm-2",
        title: "Evidence Map",
        duration: "6 min",
        content:
          "Turn each claim into a small table of evidence, assumptions, and unanswered questions.",
        action: "Build a 3-column evidence map for one paragraph.",
      },
    ],
    flashcards: [
      {
        id: "fc-rm-1",
        front: "What makes a research question strong?",
        back: "Clarity, testability, relevance, and a method that can realistically answer it.",
        hint: "Think scope and evidence.",
      },
      {
        id: "fc-rm-2",
        front: "Where does bias often appear?",
        back: "Sampling, measurement, and interpretation.",
        hint: "Check how data was collected and read.",
      },
    ],
    quiz: [
      {
        id: "q-rm-1",
        type: "mcq",
        prompt: "Which issue most directly threatens external validity?",
        options: ["Weak formatting", "Narrow sampling", "Slow note-taking", "Low font contrast"],
        answer: "Narrow sampling",
        explanation: "External validity asks whether findings generalize beyond the sample.",
        difficulty: 3,
      },
      {
        id: "q-rm-2",
        type: "true_false",
        prompt: "Critical reading should focus on claims before methods.",
        options: ["True", "False"],
        answer: "False",
        explanation: "Methods determine how much confidence the claims deserve.",
        difficulty: 2,
      },
      {
        id: "q-rm-3",
        type: "fill_blank",
        prompt: "A paper's evidence map should connect claims to supporting ____.",
        options: ["data", "colors", "quotes", "styles"],
        answer: "data",
        explanation: "Claims need supporting data and method context to be trustworthy.",
        difficulty: 1,
      },
    ],
    retentionScore: 88,
    confusionScore: 22,
    difficultyScore: 39,
    nextReviewAt: hoursFromNow(28),
    predictedForgetAt: daysFromNow(8),
    studySignal: {
      focusWindow: "1:00 PM - 1:30 PM",
      sessionMinutes: 30,
      breakMinutes: 5,
      energyScore: 73,
    },
    confusionZones: [
      { concept: "External validity", score: 36, reason: "Hesitation on comparison tasks." },
      { concept: "Measurement bias", score: 29, reason: "One recent mistake in quiz review." },
    ],
    retentionCurve: [98, 94, 88, 84, 79, 73, 69],
    automationIdeas: [
      "Create a paper-reading checklist in your notes app.",
      "Schedule a weekly literature synthesis reminder.",
    ],
    reviewHistory: [
      { timestamp: daysFromNow(-3), correct: true, hesitation: 1 },
      { timestamp: daysFromNow(-2), correct: true, hesitation: 2 },
      { timestamp: daysFromNow(-1), correct: true, hesitation: 2 },
    ],
  },
];

export const demoLeaderboard: LeaderboardEntry[] = [
  { id: "u1", name: "Nina", xp: 3920, streak: 28 },
  { id: "u2", name: "Aarav", xp: 2840, streak: 19 },
  { id: "u3", name: "Luis", xp: 2660, streak: 17 },
];

export const defaultWorkflowNodes: WorkflowNode[] = [
  {
    id: "node-trigger",
    label: "Topic Completed",
    description: "Starts when a learner finishes a micro-lesson or quiz.",
    kind: "trigger",
  },
  {
    id: "node-ai",
    label: "AI Action Mapper",
    description: "Converts understanding gaps into tasks or reminders.",
    kind: "ai",
  },
  {
    id: "node-action",
    label: "Create Task",
    description: "Sends a structured action into task apps or project boards.",
    kind: "action",
  },
  {
    id: "node-review",
    label: "Schedule Review",
    description: "Creates a spaced-repetition reminder in calendar or email.",
    kind: "review",
  },
];

export function topicFromPack(
  pack: {
    title: string;
    category: string;
    language: Locale;
    summary: string;
    keyPoints: string[];
    microLessons: LearningTopic["microLessons"];
    flashcards: LearningTopic["flashcards"];
    quiz: LearningTopic["quiz"];
  },
  sourceType: LearningTopic["sourceType"],
) {
  return {
    id: `topic-${pack.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}-${Date.now()}`,
    title: pack.title,
    category: pack.category,
    language: pack.language,
    sourceType,
    summary: pack.summary,
    keyPoints: pack.keyPoints,
    microLessons: pack.microLessons,
    flashcards: pack.flashcards,
    quiz: pack.quiz,
    retentionScore: 67,
    confusionScore: 34,
    difficultyScore: 51,
    nextReviewAt: hoursFromNow(16),
    predictedForgetAt: daysFromNow(5),
    studySignal: {
      focusWindow: "8:00 PM - 8:35 PM",
      sessionMinutes: 35,
      breakMinutes: 7,
      energyScore: 78,
    },
    confusionZones: [
      { concept: pack.keyPoints[0] ?? "Core concept", score: 44, reason: "Fresh topic, needs first recall loop." },
    ],
    retentionCurve: [92, 79, 67, 59, 50, 41, 34],
    automationIdeas: [
      `Create a task to apply ${pack.title} within 24 hours.`,
      `Schedule a revision sprint for ${pack.title}.`,
    ],
    reviewHistory: [{ timestamp: new Date().toISOString(), correct: true, hesitation: 3 }],
  } satisfies LearningTopic;
}

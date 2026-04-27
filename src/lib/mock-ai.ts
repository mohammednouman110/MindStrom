import { AssistantMode, AssistantReply, LearningPack, Locale } from "@/lib/types";

function normalizeKeyPoints(text: string) {
  const lines = text
    .split(/\n|\. /)
    .map((line) => line.trim())
    .filter(Boolean);
  const fallback = [
    "Identify the core concept.",
    "Explain why it matters.",
    "Break it into smaller learnable steps.",
    "Connect it to one real-world action.",
  ];
  return (lines.length ? lines : fallback).slice(0, 4);
}

export function generateMockPack({
  title,
  content,
  language,
}: {
  title: string;
  content: string;
  language: Locale;
}): LearningPack {
  const keyPoints = normalizeKeyPoints(content || title);

  return {
    title,
    category: "Custom topic",
    language,
    summary:
      language === "hi"
        ? `यह ${title} का संरचित AI सारांश है, जो मुख्य विचार, याद रखने योग्य संकेत और लागू करने योग्य कदम दिखाता है।`
        : `This is a structured AI summary for ${title}, highlighting the core ideas, memory cues, and practical next steps.`,
    keyPoints,
    microLessons: keyPoints.map((point, index) => ({
      id: `lesson-${index + 1}`,
      title: language === "hi" ? `माइक्रो लेसन ${index + 1}` : `Micro lesson ${index + 1}`,
      duration: `${5 + index} min`,
      content: point,
      action:
        language === "hi"
          ? "इस विचार को एक उदाहरण के साथ समझाइए।"
          : "Explain this idea back to yourself with one example.",
    })),
    flashcards: keyPoints.map((point, index) => ({
      id: `card-${index + 1}`,
      front: language === "hi" ? `मुख्य विचार ${index + 1}` : `Key idea ${index + 1}`,
      back: point,
      hint: language === "hi" ? "एक व्यावहारिक उदाहरण सोचिए।" : "Think of a practical example.",
    })),
    quiz: keyPoints.slice(0, 3).map((point, index) => ({
      id: `quiz-${index + 1}`,
      type: index === 1 ? "true_false" : index === 2 ? "fill_blank" : "mcq",
      prompt:
        index === 0
          ? language === "hi"
            ? `${title} का सबसे महत्वपूर्ण परिणाम क्या है?`
            : `What is the most important outcome of ${title}?`
          : index === 1
            ? language === "hi"
              ? `${point} सीखने में संदर्भ मायने नहीं रखता।`
              : `${point} can be learned effectively without context.`
            : language === "hi"
              ? `${title} को लागू करने का सबसे अच्छा पहला ____ क्या है?`
              : `The best first ____ for applying ${title} is deliberate practice.`,
      options:
        index === 0
          ? [point, "Ignore fundamentals", "Skip examples", "Avoid review"]
          : index === 1
            ? ["True", "False"]
            : ["step", "color", "month", "tool"],
      answer: index === 1 ? "False" : index === 2 ? "step" : point,
      explanation:
        language === "hi"
          ? "सही उत्तर उस विचार को चुनता है जो समझ, संदर्भ और अभ्यास को जोड़ता है।"
          : "The correct answer is the one that ties understanding, context, and practice together.",
      difficulty: index + 1,
    })),
  };
}

export function generateMockAssistantReply({
  topic,
  prompt,
  mode,
  locale,
}: {
  topic: string;
  prompt: string;
  mode: AssistantMode;
  locale: Locale;
}): AssistantReply {
  const intro =
    locale === "hi"
      ? {
          story: `${topic} को ऐसे सोचिए जैसे आप एक सिस्टम को प्रशिक्षित कर रहे हों जो हर रिव्यू के बाद थोड़ा और बुद्धिमान बनता है।`,
          technical: `${topic} को तकनीकी रूप से देखें तो यह मॉडलिंग, फीडबैक और अनुकूलनशील पुनरावृत्ति का संयोजन है।`,
          visual: `${topic} के लिए एक फ्लो सोचिए: इनपुट -> पैटर्न पहचान -> रिव्यू -> मजबूत याददाश्त -> कार्रवाई।`,
          analytical: `${topic} को चरणों में समझें: अवधारणा, संकेत, भूलने का जोखिम, पुनरावृत्ति, अनुप्रयोग।`,
        }
      : {
          story: `Think of ${topic} as a system that becomes wiser every time you review and apply it.`,
          technical: `From a technical lens, ${topic} is a loop of modeling, feedback, and adaptive repetition.`,
          visual: `Picture ${topic} as a flow: input -> pattern detection -> review -> stronger memory -> action.`,
          analytical: `Break ${topic} into stages: concept, cue, forgetting risk, reinforcement, application.`,
        };

  return {
    title: locale === "hi" ? "एआई ट्यूटर उत्तर" : "AI Tutor Response",
    response: `${intro[mode]} ${prompt ? `Focus area: ${prompt}.` : ""}`,
    examples:
      locale === "hi"
        ? [
            "इसे अपने पिछले प्रोजेक्ट से जोड़िए।",
            "एक छोटा क्विज़ बनाकर याददाश्त जांचिए।",
            "इसे 24 घंटे के भीतर किसी कार्य में बदल दीजिए।",
          ]
        : [
            "Connect it to the last project you worked on.",
            "Test recall with one rapid quiz.",
            "Turn the concept into a task within 24 hours.",
          ],
    nextSteps:
      locale === "hi"
        ? ["एक उदाहरण लिखें", "एक गलतफहमी पहचानें", "अगला रिव्यू शेड्यूल करें"]
        : ["Write one example", "Name one likely confusion", "Schedule the next review"],
  };
}

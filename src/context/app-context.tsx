"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { demoTopics, demoUser, topicFromPack } from "@/data/demo-data";
import { loadTopicsFromCloud, saveTopicsToCloud, firebaseAuth, isFirebaseEnabled } from "@/lib/firebase";
import { evaluateQuizAnswer, rewardUser } from "@/lib/learning-intelligence";
import { AuthPayload, LearningPack, LearningTopic, Locale, ThemeMode, UserProfile } from "@/lib/types";

interface AppContextValue {
  locale: Locale;
  theme: ThemeMode;
  user: UserProfile | null;
  topics: LearningTopic[];
  selectedTopicId: string;
  isHydrated: boolean;
  isSyncing: boolean;
  notice: string;
  setNotice: (message: string) => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  login: (payload: AuthPayload) => Promise<void>;
  signup: (payload: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  selectTopic: (topicId: string) => void;
  addPack: (pack: LearningPack, sourceType: LearningTopic["sourceType"]) => void;
  answerQuestion: (topicId: string, questionId: string, answer: string) => {
    correct: boolean;
    explanation: string;
  } | null;
  syncCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "mindstrom-ai-state";

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [user, setUser] = useState<UserProfile | null>(demoUser);
  const [topics, setTopics] = useState<LearningTopic[]>(demoTopics);
  const [selectedTopicId, setSelectedTopicId] = useState(demoTopics[0]?.id ?? "");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notice, setNotice] = useState("Running in local-first demo mode.");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          locale: Locale;
          theme: ThemeMode;
          user: UserProfile | null;
          topics: LearningTopic[];
          selectedTopicId: string;
        };

        setLocale(parsed.locale ?? "en");
        setTheme(parsed.theme ?? "dark");
        setUser(parsed.user ?? demoUser);
        setTopics(parsed.topics?.length ? parsed.topics : demoTopics);
        setSelectedTopicId(parsed.selectedTopicId ?? demoTopics[0].id);
      } catch {
        setNotice("Local cache was unreadable, so demo data was restored.");
      }
    }
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        locale,
        theme,
        user,
        topics,
        selectedTopicId,
      }),
    );
  }, [isHydrated, locale, selectedTopicId, theme, topics, user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  async function login(payload: AuthPayload) {
    if (isFirebaseEnabled && firebaseAuth) {
      const credentials = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
      const cloudTopics = await loadTopicsFromCloud(credentials.user.uid);
      setUser({
        ...demoUser,
        id: credentials.user.uid,
        name: credentials.user.displayName || payload.email.split("@")[0],
        email: payload.email,
        syncMode: "firebase",
      });
      if (cloudTopics.length) {
        setTopics(cloudTopics);
        setSelectedTopicId(cloudTopics[0].id);
      }
      setNotice("Connected to Firebase authentication and cloud sync.");
      return;
    }

    setUser({
      ...demoUser,
      name: payload.email.split("@")[0],
      email: payload.email,
      syncMode: "demo",
    });
    setNotice("Firebase is not configured, so demo authentication was used.");
  }

  async function signup(payload: AuthPayload) {
    if (isFirebaseEnabled && firebaseAuth) {
      const credentials = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
      setUser({
        ...demoUser,
        id: credentials.user.uid,
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        syncMode: "firebase",
      });
      setNotice("Account created with Firebase authentication.");
      return;
    }

    setUser({
      ...demoUser,
      id: `demo-${Date.now()}`,
      name: payload.name || payload.email.split("@")[0],
      email: payload.email,
      syncMode: "demo",
    });
    setNotice("Firebase is not configured, so a local demo account was created.");
  }

  async function logout() {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
    setUser(null);
    setNotice("Signed out. Demo content stays cached locally.");
  }

  function selectTopic(topicId: string) {
    setSelectedTopicId(topicId);
  }

  function addPack(pack: LearningPack, sourceType: LearningTopic["sourceType"]) {
    const topic = topicFromPack(pack, sourceType);
    setTopics((current) => [topic, ...current]);
    setSelectedTopicId(topic.id);
    setNotice(`${topic.title} was added to your adaptive learning library.`);
  }

  function answerQuestion(topicId: string, questionId: string, answer: string) {
    const topic = topics.find((item) => item.id === topicId);
    if (!topic) {
      return null;
    }

    const result = evaluateQuizAnswer(topic, questionId, answer);
    if (!result) {
      return null;
    }

    setTopics((current) => current.map((item) => (item.id === topicId ? result.updatedTopic : item)));
    setUser((current) => (current ? rewardUser(current, result.xpDelta, result.correct) : current));
    setNotice(result.correct ? "Correct answer. The next review window was extended." : "Confusion detected. The topic was prioritized for revision.");
    return {
      correct: result.correct,
      explanation: result.explanation,
    };
  }

  async function syncCloud() {
    if (!user) {
      setNotice("Sign in first to sync data.");
      return;
    }

    if (!isFirebaseEnabled) {
      setNotice("Firebase is not configured yet. Local-first mode is still active.");
      return;
    }

    setIsSyncing(true);
    try {
      await saveTopicsToCloud(user.id, topics);
      setNotice("Topics synced to Firestore successfully.");
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        locale,
        theme,
        user,
        topics,
        selectedTopicId,
        isHydrated,
        isSyncing,
        notice,
        setNotice,
        setLocale,
        setTheme,
        login,
        signup,
        logout,
        selectTopic,
        addPack,
        answerQuestion,
        syncCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider.");
  }
  return context;
}

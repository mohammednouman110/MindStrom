"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { LearningTopic } from "@/lib/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

const firebaseApp = isFirebaseEnabled ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;

export async function saveTopicsToCloud(userId: string, topics: LearningTopic[]) {
  if (!firebaseDb) {
    return false;
  }

  await Promise.all(
    topics.map((topic) =>
      setDoc(doc(collection(firebaseDb, "users", userId, "topics"), topic.id), {
        ...topic,
        updatedAt: new Date().toISOString(),
      }),
    ),
  );

  return true;
}

export async function loadTopicsFromCloud(userId: string) {
  if (!firebaseDb) {
    return [] as LearningTopic[];
  }

  const snapshot = await getDocs(collection(firebaseDb, "users", userId, "topics"));
  return snapshot.docs.map((item) => item.data() as LearningTopic);
}

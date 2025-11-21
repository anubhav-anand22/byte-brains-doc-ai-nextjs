// src/lib/firebase-client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { FIREBASE } from "@/const/firebase";

// ---- SAFE SINGLETON INITIALIZATION ----
const app = !getApps().length ? initializeApp(FIREBASE.CONFIG) : getApp();

// Common Client SDKs
export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);

// Optional analytics
export const firebaseAnalytics =
  typeof window !== "undefined"
    ? await isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : null;

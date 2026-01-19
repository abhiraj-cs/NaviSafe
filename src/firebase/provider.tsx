'use client';

import { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Initialize Firebase app if it hasn't been already
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Get Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app);

interface FirebaseContextValue {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  db: null,
  auth: null,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ app, db, auth }}>
      {/* Only render the error listener in development for debugging */}
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext).app;
export const useFirestore = () => useContext(FirebaseContext).db;
export const useAuth = () => useContext(FirebaseContext).auth;

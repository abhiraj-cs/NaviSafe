'use client';

import { onAuthStateChanged, type User, getIdTokenResult } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { useAuth, useFirebase } from '..';

export interface UserWithClaims extends User {
  customClaims?: { [key: string]: any };
}

export function useUser() {
  const { auth, db } = useFirebase();
  const [user, setUser] = useState<UserWithClaims | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        const userWithClaims: UserWithClaims = {
          ...user,
          customClaims: tokenResult.claims,
        };
        setUser(userWithClaims);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, auth, db, loading };
}

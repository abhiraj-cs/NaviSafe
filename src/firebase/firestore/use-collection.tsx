'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, Query, DocumentData, FirestoreError } from 'firebase/firestore';

export function useCollection<T>(
  q: Query | null
): { data: T[] | null; loading: boolean; error: FirestoreError | null; } {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!q) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching collection:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}

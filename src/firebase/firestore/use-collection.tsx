'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, Query, DocumentData, FirestoreError } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err); // Set local error state for UI feedback

        // Create and emit a more detailed permission error for debugging
        // Note: The path is inferred from the query object, which can be brittle.
        const path = (q as any)._query?.path?.canonical || 'unknown path';
        const permissionError = new FirestorePermissionError({
            path: path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [q]);

  return { data, loading, error };
}

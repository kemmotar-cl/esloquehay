import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'esloquehay-visits';

export function useVisitCounter(): number {
  const [count, setCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const incrementedRef = useRef(false);

  useEffect(() => {
    if (incrementedRef.current) return;
    incrementedRef.current = true;
    setCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, []);

  return count;
}

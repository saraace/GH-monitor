import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gh-monitor-hidden-prs";

export function useHiddenPRs() {
  const [hiddenPRs, setHiddenPRs] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.error("Failed to load hidden PRs from localStorage:", error);
      return new Set();
    }
  });

  // Save to localStorage whenever hiddenPRs changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(hiddenPRs)));
    } catch (error) {
      console.error("Failed to save hidden PRs to localStorage:", error);
    }
  }, [hiddenPRs]);

  const hidePR = useCallback((prId: string) => {
    setHiddenPRs((prev) => new Set(prev).add(prId));
  }, []);

  const unhidePR = useCallback((prId: string) => {
    setHiddenPRs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(prId);
      return newSet;
    });
  }, []);

  const isPRHidden = useCallback(
    (prId: string) => {
      return hiddenPRs.has(prId);
    },
    [hiddenPRs]
  );

  const clearAllHidden = useCallback(() => {
    setHiddenPRs(new Set());
  }, []);

  return {
    hiddenPRs,
    hidePR,
    unhidePR,
    isPRHidden,
    clearAllHidden
  };
}

import { useEffect, useState, useRef, useCallback } from 'react';

export interface AdaptivePollingConfig {
  /**
   * Polling interval when tab is active and user is engaged (in milliseconds)
   * @default 30000 (30 seconds)
   */
  activeInterval?: number;
  
  /**
   * Polling interval when tab is active but user is idle (in milliseconds)
   * @default 60000 (60 seconds)
   */
  idleInterval?: number;
  
  /**
   * Polling interval when tab is inactive/backgrounded (in milliseconds)
   * @default 300000 (5 minutes)
   */
  inactiveInterval?: number;
  
  /**
   * Time in milliseconds of inactivity before considering user idle
   * @default 120000 (2 minutes)
   */
  idleTimeout?: number;
  
  /**
   * Time in milliseconds to use faster polling after manual refresh
   * @default 60000 (1 minute)
   */
  refreshBoostDuration?: number;
  
  /**
   * Polling interval during refresh boost period (in milliseconds)
   * @default 15000 (15 seconds)
   */
  refreshBoostInterval?: number;
}

const DEFAULT_CONFIG: Required<AdaptivePollingConfig> = {
  activeInterval: 30000,      // 30 seconds when active
  idleInterval: 60000,        // 60 seconds when idle
  inactiveInterval: 300000,   // 5 minutes when tab is hidden
  idleTimeout: 120000,        // 2 minutes of inactivity = idle
  refreshBoostDuration: 60000, // 1 minute of faster polling after refresh
  refreshBoostInterval: 15000, // 15 seconds during boost
};

/**
 * Hook that provides adaptive polling interval based on:
 * - Tab visibility (active/inactive)
 * - User activity (active/idle)
 * - Recent manual refresh (boost mode)
 */
export function useAdaptivePolling(config: AdaptivePollingConfig = {}) {
  const {
    activeInterval,
    idleInterval,
    inactiveInterval,
    idleTimeout,
    refreshBoostDuration,
    refreshBoostInterval,
  } = { ...DEFAULT_CONFIG, ...config };

  const [pollInterval, setPollInterval] = useState(activeInterval);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isUserActive, setIsUserActive] = useState(true);
  const [isRefreshBoost, setIsRefreshBoost] = useState(false);
  
  const lastActivityRef = useRef<number>(Date.now());
  const refreshBoostTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track user activity
  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (!isUserActive) {
      setIsUserActive(true);
    }
    
    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    
    // Set new timeout to mark user as idle
    activityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, idleTimeout);
  }, [isUserActive, idleTimeout]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (isVisible) {
        // Tab became visible - reset activity
        handleActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleActivity]);

  // Track user activity (mouse movement, clicks, keyboard)
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial activity timeout
    activityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, idleTimeout);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [handleActivity, idleTimeout]);

  // Calculate polling interval based on current state
  useEffect(() => {
    // Refresh boost takes priority
    if (isRefreshBoost) {
      setPollInterval(refreshBoostInterval);
      return;
    }

    // Tab visibility takes next priority
    if (!isTabVisible) {
      setPollInterval(inactiveInterval);
      return;
    }

    // User activity determines active vs idle
    if (isUserActive) {
      setPollInterval(activeInterval);
    } else {
      setPollInterval(idleInterval);
    }
  }, [
    isTabVisible,
    isUserActive,
    isRefreshBoost,
    activeInterval,
    idleInterval,
    inactiveInterval,
    refreshBoostInterval,
  ]);

  // Function to trigger refresh boost
  const triggerRefreshBoost = useCallback(() => {
    setIsRefreshBoost(true);
    
    // Clear existing boost timeout
    if (refreshBoostTimeoutRef.current) {
      clearTimeout(refreshBoostTimeoutRef.current);
    }
    
    // Set timeout to end boost
    refreshBoostTimeoutRef.current = setTimeout(() => {
      setIsRefreshBoost(false);
    }, refreshBoostDuration);
  }, [refreshBoostDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshBoostTimeoutRef.current) {
        clearTimeout(refreshBoostTimeoutRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  return {
    pollInterval,
    isTabVisible,
    isUserActive,
    isRefreshBoost,
    triggerRefreshBoost,
  };
}

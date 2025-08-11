import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

interface GameEvent {
  type: 'start' | 'end' | 'pause' | 'resume' | 'reset' | 'achievement' | 'audio_toggle' | 'custom';
  gameId: string;
  timestamp: Date;
  data?: any;
}

interface GameSession {
  id: string;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  score?: number;
  achievements?: string[];
  stats?: any;
}

interface AnalyticsConfig {
  enableLocalStorage: boolean;
  enableRemoteTracking: boolean;
  batchSize: number;
  flushInterval: number;
}

const defaultConfig: AnalyticsConfig = {
  enableLocalStorage: true,
  enableRemoteTracking: false,
  batchSize: 10,
  flushInterval: 30000 // 30 seconds
};

export const useGameAnalytics = (gameId: string, enabled: boolean = true, config: Partial<AnalyticsConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const eventQueue = useRef<GameEvent[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);
  const gameStore = useGameStore();

  // Track event to local storage and queue
  const trackEvent = useCallback((event: Omit<GameEvent, 'timestamp'>) => {
    if (!enabled) return;

    const fullEvent: GameEvent = {
      ...event,
      timestamp: new Date()
    };

    // Store event locally (game store doesn't have analytics methods)

    // Add to local storage if enabled
    if (finalConfig.enableLocalStorage) {
      try {
        const existingEvents = JSON.parse(localStorage.getItem(`analytics_${gameId}`) || '[]');
        existingEvents.push(fullEvent);
        
        // Keep only last 1000 events per game
        if (existingEvents.length > 1000) {
          existingEvents.splice(0, existingEvents.length - 1000);
        }
        
        localStorage.setItem(`analytics_${gameId}`, JSON.stringify(existingEvents));
      } catch (error) {
        console.warn('Failed to save analytics to localStorage:', error);
      }
    }

    // Add to remote queue if enabled
    if (finalConfig.enableRemoteTracking) {
      eventQueue.current.push(fullEvent);
      
      // Flush if batch size reached
      if (eventQueue.current.length >= finalConfig.batchSize) {
        flushEvents();
      } else {
        // Schedule flush if not already scheduled
        if (!flushTimer.current) {
          flushTimer.current = setTimeout(() => {
            flushEvents();
            flushTimer.current = null;
          }, finalConfig.flushInterval);
        }
      }
    }
  }, [enabled, gameId, finalConfig]);

  // Flush events to remote endpoint
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    const eventsToFlush = [...eventQueue.current];
    eventQueue.current = [];

    try {
      // Here you would send to your analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events: eventsToFlush })
      // });
      
      console.log('Analytics events flushed:', eventsToFlush);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-add events to queue for retry
      eventQueue.current.unshift(...eventsToFlush);
    }
  }, []);

  // Game-specific tracking methods
  const trackGameStart = useCallback((gameId: string) => {
    trackEvent({
      type: 'start',
      gameId,
      data: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: `${gameId}_${Date.now()}`
      }
    });
    
    // Game stats tracking would be handled by game store if methods existed
  }, [trackEvent]);

  const trackGameEnd = useCallback((gameId: string, session: GameSession) => {
    trackEvent({
      type: 'end',
      gameId,
      data: {
        duration: session.duration,
        score: session.score,
        achievements: session.achievements,
        stats: session.stats
      }
    });
    
    // Game stats tracking would be handled by game store if methods existed
  }, [trackEvent]);

  const trackGamePause = useCallback((gameId: string) => {
    trackEvent({
      type: 'pause',
      gameId,
      data: { timestamp: Date.now() }
    });
  }, [trackEvent]);

  const trackGameResume = useCallback((gameId: string) => {
    trackEvent({
      type: 'resume',
      gameId,
      data: { timestamp: Date.now() }
    });
  }, [trackEvent]);

  const trackGameReset = useCallback((gameId: string) => {
    trackEvent({
      type: 'reset',
      gameId,
      data: { timestamp: Date.now() }
    });
  }, [trackEvent]);

  const trackAchievement = useCallback((gameId: string, achievement: string, metadata?: any) => {
    trackEvent({
      type: 'achievement',
      gameId,
      data: {
        achievement,
        metadata,
        timestamp: Date.now()
      }
    });
    
    // Achievement tracking would be handled by game store if methods existed
  }, [trackEvent]);

  const trackAudioToggle = useCallback((gameId: string, isMuted: boolean) => {
    trackEvent({
      type: 'audio_toggle',
      gameId,
      data: {
        isMuted,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  const trackCustomEvent = useCallback((gameId: string, eventName: string, data?: any) => {
    trackEvent({
      type: 'custom',
      gameId,
      data: {
        eventName,
        ...data,
        timestamp: Date.now()
      }
    });
  }, [trackEvent]);

  // Get analytics data
  const getAnalyticsData = useCallback((gameId: string) => {
    try {
      const localEvents = JSON.parse(localStorage.getItem(`analytics_${gameId}`) || '[]');
      // Game stats would be retrieved from store if method existed
      const gameStats = {
        totalSessions: 0,
        totalPlayTime: 0,
        bestScore: 0,
        achievements: []
      };
      
      return {
        events: localEvents,
        stats: gameStats,
        summary: {
          totalEvents: localEvents.length,
          totalSessions: gameStats.totalSessions || 0,
          totalPlayTime: gameStats.totalPlayTime || 0,
          averageSessionLength: gameStats.totalSessions ? 
            (gameStats.totalPlayTime || 0) / gameStats.totalSessions : 0,
          bestScore: gameStats.bestScore,
          achievements: gameStats.achievements || []
        }
      };
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      return null;
    }
  }, []);

  // Export analytics data
  const exportAnalyticsData = useCallback((gameId: string, format: 'json' | 'csv' = 'json') => {
    const data = getAnalyticsData(gameId);
    if (!data) return;

    const filename = `${gameId}_analytics_${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, filename);
    } else if (format === 'csv') {
      const csv = convertToCSV(data.events);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadBlob(blob, filename);
    }
  }, [getAnalyticsData]);

  // Helper function to download blob
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to convert events to CSV
  const convertToCSV = (events: GameEvent[]) => {
    if (events.length === 0) return '';
    
    const headers = ['type', 'gameId', 'timestamp', 'data'];
    const rows = events.map(event => [
      event.type,
      event.gameId,
      event.timestamp.toISOString(),
      JSON.stringify(event.data || {})
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  };

  // Clear analytics data
  const clearAnalyticsData = useCallback((gameId: string) => {
    try {
      localStorage.removeItem(`analytics_${gameId}`);
      // Game stats would be updated if method existed
    } catch (error) {
      console.error('Failed to clear analytics data:', error);
    }
  }, []);

  return {
    // Tracking methods
    trackGameStart,
    trackGameEnd,
    trackGamePause,
    trackGameResume,
    trackGameReset,
    trackAchievement,
    trackAudioToggle,
    trackCustomEvent,
    
    // Data methods
    getAnalyticsData,
    exportAnalyticsData,
    clearAnalyticsData,
    
    // Utility methods
    flushEvents,
    
    // Config
    config: finalConfig,
    enabled
  };
};

export type { GameEvent, GameSession, AnalyticsConfig };
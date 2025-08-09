import { useState, useCallback, useEffect } from 'react';

export interface FeedbackData {
  projectName: string;
  rating: number;
  feedback: string;
  timestamp: string;
  id?: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  recentFeedback: FeedbackData[];
}

const STORAGE_KEY = 'portfolio_feedback';
const MAX_STORED_FEEDBACK = 100;

export const useFeedbackCollection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    totalFeedback: 0,
    averageRating: 0,
    ratingDistribution: {},
    recentFeedback: []
  });

  // Load feedback data from localStorage
  const loadFeedbackData = useCallback((): FeedbackData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load feedback data:', error);
      return [];
    }
  }, []);

  // Save feedback data to localStorage
  const saveFeedbackData = useCallback((data: FeedbackData[]) => {
    try {
      // Keep only the most recent feedback entries
      const trimmedData = data.slice(-MAX_STORED_FEEDBACK);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedData));
    } catch (error) {
      console.error('Failed to save feedback data:', error);
    }
  }, []);

  // Calculate feedback statistics
  const calculateStats = useCallback((feedbackList: FeedbackData[]): FeedbackStats => {
    if (feedbackList.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: {},
        recentFeedback: []
      };
    }

    const totalRating = feedbackList.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / feedbackList.length;

    const ratingDistribution = feedbackList.reduce((dist, item) => {
      dist[item.rating] = (dist[item.rating] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    // Get recent feedback (last 10 items)
    const recentFeedback = feedbackList
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalFeedback: feedbackList.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      recentFeedback
    };
  }, []);

  // Submit new feedback
  const submitFeedback = useCallback(async (feedback: Omit<FeedbackData, 'id'>) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFeedback: FeedbackData = {
        ...feedback,
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const existingData = loadFeedbackData();
      const updatedData = [...existingData, newFeedback];
      
      saveFeedbackData(updatedData);
      
      // Update stats
      const newStats = calculateStats(updatedData);
      setFeedbackStats(newStats);
      
      // Track analytics (in a real app, this would send to analytics service)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'feedback_submitted', {
          project_name: feedback.projectName,
          rating: feedback.rating,
          has_text_feedback: feedback.feedback.length > 0
        });
      }
      
      return newFeedback;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [loadFeedbackData, saveFeedbackData, calculateStats]);

  // Get feedback for a specific project
  const getProjectFeedback = useCallback((projectName: string): FeedbackData[] => {
    const allFeedback = loadFeedbackData();
    return allFeedback.filter(item => item.projectName === projectName);
  }, [loadFeedbackData]);

  // Get project statistics
  const getProjectStats = useCallback((projectName: string): FeedbackStats => {
    const projectFeedback = getProjectFeedback(projectName);
    return calculateStats(projectFeedback);
  }, [getProjectFeedback, calculateStats]);

  // Clear all feedback (for testing/admin purposes)
  const clearAllFeedback = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFeedbackStats({
      totalFeedback: 0,
      averageRating: 0,
      ratingDistribution: {},
      recentFeedback: []
    });
  }, []);

  // Export feedback data (for analytics/backup)
  const exportFeedbackData = useCallback(() => {
    const data = loadFeedbackData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_feedback_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, [loadFeedbackData]);

  // Load initial stats on mount
  useEffect(() => {
    const initialData = loadFeedbackData();
    const initialStats = calculateStats(initialData);
    setFeedbackStats(initialStats);
  }, [loadFeedbackData, calculateStats]);

  return {
    // State
    isSubmitting,
    feedbackStats,
    
    // Actions
    submitFeedback,
    getProjectFeedback,
    getProjectStats,
    clearAllFeedback,
    exportFeedbackData,
    
    // Utilities
    loadFeedbackData,
    calculateStats
  };
};

export default useFeedbackCollection;
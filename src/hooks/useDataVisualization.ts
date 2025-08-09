import { useState, useCallback, useMemo } from 'react';
import { GameStatistics, RollResult } from '../types/knucklebones';

interface VisualizationData {
  rollDistribution: { value: number; count: number; percentage: number }[];
  winRateByMode: { mode: string; winRate: number; games: number }[];
  performanceTrends: { date: string; score: number; winRate: number }[];
  skillAssessment: { skill: string; rating: number; improvement: number }[];
  efficiencyMetrics: { metric: string; value: number; benchmark: number }[];
  dicePatterns: { pattern: string; frequency: number; success: number }[];
  heatmapData: { row: number; col: number; frequency: number; success: number }[];
}

interface VisualizationFilters {
  dateRange: { start: Date; end: Date };
  gameMode: string | null;
  difficulty: string | null;
  playerCount: number | null;
  showTrends: boolean;
  aggregationPeriod: 'day' | 'week' | 'month';
}

interface UseDataVisualizationReturn {
  data: VisualizationData;
  filters: VisualizationFilters;
  updateFilters: (newFilters: Partial<VisualizationFilters>) => void;
  refreshData: () => void;
  exportData: (format: 'csv' | 'json') => void;
}

export const useDataVisualization = (): UseDataVisualizationReturn => {
  const [filters, setFilters] = useState<VisualizationFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    gameMode: null,
    difficulty: null,
    playerCount: null,
    showTrends: true,
    aggregationPeriod: 'day'
  });

  // Mock data generation - in a real app, this would come from an API
  const data: VisualizationData = useMemo(() => {
    // Roll Distribution Data
    const rollDistribution = Array.from({ length: 6 }, (_, i) => {
      const value = i + 1;
      const count = Math.floor(Math.random() * 100) + 20;
      const total = 600; // Total rolls
      return {
        value,
        count,
        percentage: (count / total) * 100
      };
    });

    // Win Rate by Mode
    const winRateByMode = [
      { mode: 'Classic', winRate: 65.2, games: 45 },
      { mode: 'Speed', winRate: 58.7, games: 32 },
      { mode: 'AI Challenge', winRate: 42.1, games: 28 },
      { mode: 'Tournament', winRate: 71.4, games: 14 },
      { mode: 'Chaos', winRate: 55.6, games: 18 },
      { mode: 'Zen', winRate: 78.9, games: 19 }
    ];

    // Performance Trends (last 30 days)
    const performanceTrends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        score: Math.floor(Math.random() * 100) + 150,
        winRate: Math.random() * 40 + 40 // 40-80%
      };
    });

    // Skill Assessment
    const skillAssessment = [
      { skill: 'Strategy', rating: 78, improvement: 5.2 },
      { skill: 'Speed', rating: 65, improvement: -2.1 },
      { skill: 'Consistency', rating: 82, improvement: 8.7 },
      { skill: 'Risk Management', rating: 71, improvement: 3.4 },
      { skill: 'Adaptability', rating: 69, improvement: 1.8 },
      { skill: 'Decision Making', rating: 75, improvement: 4.6 }
    ];

    // Efficiency Metrics
    const efficiencyMetrics = [
      { metric: 'Avg. Move Time', value: 12.3, benchmark: 15.0 },
      { metric: 'Moves per Game', value: 18.7, benchmark: 20.0 },
      { metric: 'Score Efficiency', value: 85.2, benchmark: 80.0 },
      { metric: 'Comeback Rate', value: 23.1, benchmark: 20.0 },
      { metric: 'Perfect Games', value: 8.7, benchmark: 5.0 }
    ];

    // Dice Patterns
    const dicePatterns = [
      { pattern: 'Triple Same', frequency: 45, success: 78.2 },
      { pattern: 'Sequential', frequency: 32, success: 65.1 },
      { pattern: 'Pairs', frequency: 67, success: 58.9 },
      { pattern: 'High Values', frequency: 28, success: 82.4 },
      { pattern: 'Spread', frequency: 41, success: 61.7 },
      { pattern: 'Corner Focus', frequency: 23, success: 71.3 }
    ];

    // Heatmap Data (3x3 board positions)
    const heatmapData = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        heatmapData.push({
          row,
          col,
          frequency: Math.floor(Math.random() * 50) + 10,
          success: Math.random() * 40 + 40
        });
      }
    }

    return {
      rollDistribution,
      winRateByMode,
      performanceTrends,
      skillAssessment,
      efficiencyMetrics,
      dicePatterns,
      heatmapData
    };
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<VisualizationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshData = useCallback(() => {
    // In a real app, this would trigger a data refresh from the API
    console.log('Refreshing visualization data...');
  }, []);

  const exportData = useCallback((format: 'csv' | 'json') => {
    const dataToExport = {
      filters,
      data,
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knucklebones-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert data to CSV format
      const csvData = [
        ['Metric', 'Value', 'Category'],
        ...data.rollDistribution.map(item => [`Roll ${item.value}`, item.count, 'Roll Distribution']),
        ...data.winRateByMode.map(item => [item.mode, item.winRate, 'Win Rate']),
        ...data.skillAssessment.map(item => [item.skill, item.rating, 'Skill Rating'])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knucklebones-data-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [data, filters]);

  return {
    data,
    filters,
    updateFilters,
    refreshData,
    exportData
  };
};

export default useDataVisualization;
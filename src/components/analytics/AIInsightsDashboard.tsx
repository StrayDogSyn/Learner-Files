import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Share,
  Filter
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassDropdown from '../ui/GlassDropdown';
import GlassBadge from '../ui/GlassBadge';
import { AIInsight } from '../../services/api/EnhancedAnalyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export interface AIInsightsDashboardProps {
  insights: AIInsight[];
  onGenerateInsights: () => Promise<void>;
  onInsightAction: (insight: AIInsight, action: string) => void;
  isGenerating?: boolean;
  className?: string;
}

interface InsightFilter {
  type: 'all' | 'performance' | 'behavior' | 'conversion' | 'content';
  confidence: 'all' | 'high' | 'medium' | 'low';
  timeRange: 'day' | 'week' | 'month';
}

const INSIGHT_TYPES = {
  performance: {
    label: 'Performance',
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  behavior: {
    label: 'User Behavior',
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900'
  },
  conversion: {
    label: 'Conversion',
    icon: Target,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900'
  },
  content: {
    label: 'Content',
    icon: Eye,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900'
  }
};

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  insights,
  onGenerateInsights,
  onInsightAction,
  isGenerating = false,
  className = ''
}) => {
  const [filters, setFilters] = useState<InsightFilter>({
    type: 'all',
    confidence: 'all',
    timeRange: 'week'
  });
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    if (filters.type !== 'all' && insight.type !== filters.type) return false;
    
    if (filters.confidence !== 'all') {
      const confidenceRanges = {
        high: [0.8, 1],
        medium: [0.5, 0.8],
        low: [0, 0.5]
      };
      const [min, max] = confidenceRanges[filters.confidence];
      if (insight.confidence < min || insight.confidence >= max) return false;
    }

    // Filter by time range
    const now = Date.now();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };
    const cutoff = now - timeRanges[filters.timeRange];
    if (insight.generatedAt < cutoff) return false;

    return true;
  });

  // Group insights by type
  const insightsByType = filteredInsights.reduce((acc, insight) => {
    if (!acc[insight.type]) acc[insight.type] = [];
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, AIInsight[]>);

  // Calculate insight metrics
  const insightMetrics = {
    total: filteredInsights.length,
    highConfidence: filteredInsights.filter(i => i.confidence >= 0.8).length,
    mediumConfidence: filteredInsights.filter(i => i.confidence >= 0.5 && i.confidence < 0.8).length,
    lowConfidence: filteredInsights.filter(i => i.confidence < 0.5).length,
    byType: Object.entries(insightsByType).map(([type, insights]) => ({
      type,
      count: insights.length,
      avgConfidence: insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
    }))
  };

  const toggleInsightExpansion = (insightId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.5) return 'warning';
    return 'error';
  };

  const exportInsights = () => {
    const data = {
      insights: filteredInsights,
      metrics: insightMetrics,
      generatedAt: new Date().toISOString(),
      filters
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-insights-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI-Powered Insights
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Claude-generated analytics and recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton
              onClick={onGenerateInsights}
              disabled={isGenerating}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </GlassButton>

            <GlassButton
              onClick={exportInsights}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4" />
            </GlassButton>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">
              {insightMetrics.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Insights
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {insightMetrics.highConfidence}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              High Confidence
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {insightMetrics.mediumConfidence}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Medium Confidence
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">
              {insightMetrics.byType.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Categories
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Filters:</span>
          </div>

          <GlassDropdown
            value={filters.type}
            onChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'performance', label: 'Performance' },
              { value: 'behavior', label: 'User Behavior' },
              { value: 'conversion', label: 'Conversion' },
              { value: 'content', label: 'Content' }
            ]}
            size="sm"
          />

          <GlassDropdown
            value={filters.confidence}
            onChange={(value) => setFilters(prev => ({ ...prev, confidence: value as any }))}
            options={[
              { value: 'all', label: 'All Confidence' },
              { value: 'high', label: 'High (80%+)' },
              { value: 'medium', label: 'Medium (50-80%)' },
              { value: 'low', label: 'Low (<50%)' }
            ]}
            size="sm"
          />

          <GlassDropdown
            value={filters.timeRange}
            onChange={(value) => setFilters(prev => ({ ...prev, timeRange: value as any }))}
            options={[
              { value: 'day', label: 'Last Day' },
              { value: 'week', label: 'Last Week' },
              { value: 'month', label: 'Last Month' }
            ]}
            size="sm"
          />
        </div>
      </GlassCard>

      {/* Insights by Type Chart */}
      {insightMetrics.byType.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Insights Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insightMetrics.byType}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="type" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Insights List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredInsights.map((insight, index) => {
            const typeConfig = INSIGHT_TYPES[insight.type];
            const IconComponent = typeConfig.icon;
            const isExpanded = expandedInsights.has(insight.id);

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${typeConfig.bgColor}`}>
                        <IconComponent className={`w-6 h-6 ${typeConfig.color}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {insight.title}
                          </h3>
                          <GlassBadge variant={getConfidenceBadgeVariant(insight.confidence)}>
                            {Math.round(insight.confidence * 100)}% confidence
                          </GlassBadge>
                          <GlassBadge variant="outline">
                            {typeConfig.label}
                          </GlassBadge>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {insight.description}
                        </p>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            {/* Recommendations */}
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-500" />
                                Recommendations
                              </h4>
                              <ul className="space-y-1">
                                {insight.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Supporting Data */}
                            {insight.data && (
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                  Supporting Data
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                  <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto">
                                    {JSON.stringify(insight.data, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {new Date(insight.generatedAt).toLocaleString()}
                          </div>

                          <div className="flex items-center gap-2">
                            <GlassButton
                              onClick={() => toggleInsightExpansion(insight.id)}
                              size="sm"
                              variant="outline"
                            >
                              {isExpanded ? 'Show Less' : 'Show More'}
                            </GlassButton>

                            <GlassButton
                              onClick={() => onInsightAction(insight, 'implement')}
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Implement
                            </GlassButton>

                            <GlassButton
                              onClick={() => onInsightAction(insight, 'dismiss')}
                              size="sm"
                              variant="outline"
                            >
                              Dismiss
                            </GlassButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredInsights.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No insights available
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate AI insights to get personalized recommendations for your portfolio.
            </p>
            <GlassButton
              onClick={onGenerateInsights}
              disabled={isGenerating}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate First Insights
                </>
              )}
            </GlassButton>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
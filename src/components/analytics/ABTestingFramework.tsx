import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Play,
  Pause,
  Stop,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassInput from '../ui/GlassInput';
import GlassModal from '../ui/GlassModal';
import GlassBadge from '../ui/GlassBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  weight: number; // Traffic allocation percentage
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ABTestVariant[];
  metrics: {
    primary: string; // Primary metric to optimize
    secondary: string[]; // Secondary metrics to track
  };
  targeting: {
    audience: 'all' | 'new' | 'returning';
    percentage: number; // Percentage of users to include
    conditions?: Record<string, any>;
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    duration?: number; // Duration in days
  };
  results?: ABTestResults;
  createdAt: Date;
  updatedAt: Date;
}

export interface ABTestResults {
  totalParticipants: number;
  conversionRate: number;
  statisticalSignificance: number;
  confidenceInterval: [number, number];
  variants: {
    [variantId: string]: {
      participants: number;
      conversions: number;
      conversionRate: number;
      metrics: Record<string, number>;
    };
  };
  winner?: string;
  recommendation: 'continue' | 'stop' | 'extend';
}

export interface ABTestingFrameworkProps {
  tests: ABTest[];
  onCreateTest: (test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTest: (testId: string, updates: Partial<ABTest>) => void;
  onDeleteTest: (testId: string) => void;
  onStartTest: (testId: string) => void;
  onPauseTest: (testId: string) => void;
  onStopTest: (testId: string) => void;
  className?: string;
}

const METRICS_OPTIONS = [
  { value: 'click_rate', label: 'Click Rate' },
  { value: 'conversion_rate', label: 'Conversion Rate' },
  { value: 'engagement_time', label: 'Engagement Time' },
  { value: 'bounce_rate', label: 'Bounce Rate' },
  { value: 'scroll_depth', label: 'Scroll Depth' },
  { value: 'form_completion', label: 'Form Completion' }
];

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'new', label: 'New Users' },
  { value: 'returning', label: 'Returning Users' }
];

export const ABTestingFramework: React.FC<ABTestingFrameworkProps> = ({
  tests,
  onCreateTest,
  onUpdateTest,
  onDeleteTest,
  onStartTest,
  onPauseTest,
  onStopTest,
  className = ''
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'running' | 'paused' | 'completed'>('all');

  // Filter tests
  const filteredTests = useMemo(() => {
    if (filter === 'all') return tests;
    return tests.filter(test => test.status === filter);
  }, [tests, filter]);

  // Calculate overall statistics
  const statistics = useMemo(() => {
    const runningTests = tests.filter(t => t.status === 'running');
    const completedTests = tests.filter(t => t.status === 'completed');
    
    const totalParticipants = completedTests.reduce((sum, test) => 
      sum + (test.results?.totalParticipants || 0), 0
    );
    
    const avgConversionRate = completedTests.length > 0 
      ? completedTests.reduce((sum, test) => sum + (test.results?.conversionRate || 0), 0) / completedTests.length
      : 0;
    
    const significantTests = completedTests.filter(test => 
      (test.results?.statisticalSignificance || 0) >= 0.95
    ).length;

    return {
      total: tests.length,
      running: runningTests.length,
      completed: completedTests.length,
      totalParticipants,
      avgConversionRate,
      significantTests
    };
  }, [tests]);

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-500';
      case 'running': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      case 'completed': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: ABTest['status']) => {
    switch (status) {
      case 'draft': return 'outline' as const;
      case 'running': return 'success' as const;
      case 'paused': return 'warning' as const;
      case 'completed': return 'info' as const;
      default: return 'outline' as const;
    }
  };

  const calculateDaysRemaining = (test: ABTest) => {
    if (!test.schedule.endDate) return null;
    const now = new Date();
    const end = new Date(test.schedule.endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getSignificanceColor = (significance: number) => {
    if (significance >= 0.95) return 'text-green-500';
    if (significance >= 0.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                A/B Testing Framework
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Automated testing and optimization for portfolio components
              </p>
            </div>
          </div>

          <GlassButton
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </GlassButton>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {statistics.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Tests
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {statistics.running}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Running
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {statistics.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {statistics.totalParticipants.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Participants
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-500">
              {(statistics.avgConversionRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Avg Conversion
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {statistics.significantTests}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Significant
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'draft', 'running', 'paused', 'completed'] as const).map(status => (
          <GlassButton
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </GlassButton>
        ))}
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTests.map((test, index) => {
            const daysRemaining = calculateDaysRemaining(test);
            
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {test.name}
                        </h3>
                        <GlassBadge variant={getStatusBadgeVariant(test.status)}>
                          {test.status}
                        </GlassBadge>
                        {test.status === 'running' && daysRemaining !== null && (
                          <GlassBadge variant="default">
                            {daysRemaining} days left
                          </GlassBadge>
                        )}
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {test.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Variants
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {test.variants.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Primary Metric
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {test.metrics.primary}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Audience
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {test.targeting.audience} ({test.targeting.percentage}%)
                          </div>
                        </div>
                        {test.results && (
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Significance
                            </div>
                            <div className={`font-medium ${getSignificanceColor(test.results.statisticalSignificance)}`}>
                              {(test.results.statisticalSignificance * 100).toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Results Preview */}
                      {test.results && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-blue-500">
                                {test.results.totalParticipants.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                Participants
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-500">
                                {(test.results.conversionRate * 100).toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                Conversion Rate
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-purple-500">
                                {test.results.winner ? 'Winner Found' : 'No Winner'}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">
                                Result
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {test.status === 'draft' && (
                        <GlassButton
                          onClick={() => onStartTest(test.id)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Play className="w-4 h-4" />
                        </GlassButton>
                      )}
                      
                      {test.status === 'running' && (
                        <>
                          <GlassButton
                            onClick={() => onPauseTest(test.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Pause className="w-4 h-4" />
                          </GlassButton>
                          <GlassButton
                            onClick={() => onStopTest(test.id)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Stop className="w-4 h-4" />
                          </GlassButton>
                        </>
                      )}
                      
                      {test.status === 'paused' && (
                        <GlassButton
                          onClick={() => onStartTest(test.id)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Play className="w-4 h-4" />
                        </GlassButton>
                      )}

                      <GlassButton
                        onClick={() => {
                          setSelectedTest(test);
                          setShowDetailsModal(true);
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </GlassButton>

                      <GlassButton
                        onClick={() => onDeleteTest(test.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTests.length === 0 && (
          <GlassCard className="p-12 text-center">
            <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tests found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create your first A/B test to start optimizing your portfolio components.
            </p>
            <GlassButton
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Test
            </GlassButton>
          </GlassCard>
        )}
      </div>

      {/* Create Test Modal */}
      <CreateTestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateTest}
      />

      {/* Test Details Modal */}
      {selectedTest && (
        <TestDetailsModal
          test={selectedTest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTest(null);
          }}
        />
      )}
    </div>
  );
};

// Create Test Modal Component
const CreateTestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryMetric: 'conversion_rate',
    secondaryMetrics: [] as string[],
    audience: 'all' as const,
    percentage: 100,
    duration: 14
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description,
      status: 'draft',
      variants: [
        {
          id: 'control',
          name: 'Control',
          description: 'Original version',
          component: () => null,
          weight: 50
        },
        {
          id: 'variant',
          name: 'Variant',
          description: 'Test version',
          component: () => null,
          weight: 50
        }
      ],
      metrics: {
        primary: formData.primaryMetric,
        secondary: formData.secondaryMetrics
      },
      targeting: {
        audience: formData.audience,
        percentage: formData.percentage
      },
      schedule: {
        startDate: new Date(),
        duration: formData.duration
      }
    };

    onSubmit(test);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      primaryMetric: 'conversion_rate',
      secondaryMetrics: [],
      audience: 'all',
      percentage: 100,
      duration: 14
    });
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create A/B Test"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Test Name
          </label>
          <GlassInput
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter test name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what you're testing"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Metric
            </label>
            <select
              value={formData.primaryMetric}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryMetric: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              {METRICS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Audience
            </label>
            <select
              value={formData.audience}
              onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              {AUDIENCE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Traffic Percentage
            </label>
            <GlassInput
              type="number"
              value={formData.percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
              min={1}
              max={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (days)
            </label>
            <GlassInput
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min={1}
              max={90}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <GlassButton
            type="button"
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </GlassButton>
          <GlassButton
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create Test
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};

// Test Details Modal Component
const TestDetailsModal: React.FC<{
  test: ABTest;
  isOpen: boolean;
  onClose: () => void;
}> = ({ test, isOpen, onClose }) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={test.name}
      size="xl"
    >
      <div className="space-y-6">
        {/* Test Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
              <GlassBadge variant={test.status === 'running' ? 'success' : 'outline'}>
                {test.status}
              </GlassBadge>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Primary Metric</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {test.metrics.primary}
              </div>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Variants
          </h3>
          <div className="space-y-3">
            {test.variants.map(variant => (
              <div key={variant.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {variant.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {variant.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Traffic</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {variant.weight}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {test.results && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Results
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {test.results.totalParticipants.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Participants
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {(test.results.conversionRate * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Conversion Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {(test.results.statisticalSignificance * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Statistical Significance
                  </div>
                </div>
              </div>

              {test.results.winner && (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-medium text-green-800 dark:text-green-200">
                    Winner: {test.variants.find(v => v.id === test.results!.winner)?.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GlassModal>
  );
};

export default ABTestingFramework;
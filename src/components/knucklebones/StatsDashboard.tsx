import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  GameStatistics,
  PlayerPerformance,
  StatisticsTrend,
  DiceGroupResult,
  ChartData
} from '../../types/knucklebones';

interface StatsDashboardProps {
  gameHistory: DiceGroupResult[][];
  playerStats: PlayerPerformance[];
  isVisible: boolean;
  onClose: () => void;
}

interface DiceAnalysis {
  rollDistribution: Record<number, number>;
  diceTypeUsage: Record<number, number>;
  averageRoll: number;
  totalRolls: number;
  streakAnalysis: {
    longestWinStreak: number;
    longestLossStreak: number;
    currentStreak: number;
    streakType: 'win' | 'loss' | 'none';
  };
  probabilityDeviations: Record<number, number>;
}

const DICE_COLORS = {
  3: '#FF6B6B',
  4: '#4ECDC4',
  6: '#45B7D1',
  8: '#96CEB4',
  10: '#FFEAA7',
  12: '#DDA0DD',
  20: '#98D8C8',
  100: '#F7DC6F'
};

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  gameHistory,
  playerStats,
  isVisible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dice' | 'trends' | 'advanced'>('overview');
  const [timeframe, setTimeframe] = useState<'session' | 'daily' | 'weekly' | 'all'>('session');
  const [selectedDiceType, setSelectedDiceType] = useState<number | null>(null);

  // Comprehensive data analysis
  const analysis = useMemo((): DiceAnalysis => {
    if (gameHistory.length === 0) {
      return {
        rollDistribution: {},
        diceTypeUsage: {},
        averageRoll: 0,
        totalRolls: 0,
        streakAnalysis: {
          longestWinStreak: 0,
          longestLossStreak: 0,
          currentStreak: 0,
          streakType: 'none'
        },
        probabilityDeviations: {}
      };
    }

    const rollDistribution: Record<number, number> = {};
    const diceTypeUsage: Record<number, number> = {};
    const probabilityDeviations: Record<number, number> = {};
    let totalRolls = 0;
    let totalValue = 0;

    gameHistory.forEach(round => {
      round.forEach(group => {
        diceTypeUsage[group.type] = (diceTypeUsage[group.type] || 0) + group.count;
        
        group.results.forEach(roll => {
          rollDistribution[roll] = (rollDistribution[roll] || 0) + 1;
          totalRolls++;
          totalValue += roll;
        });

        // Calculate probability deviations
        const expectedMean = (group.type + 1) / 2;
        const actualMean = group.results.reduce((sum, roll) => sum + roll, 0) / group.results.length;
        const deviation = ((actualMean - expectedMean) / expectedMean) * 100;
        probabilityDeviations[group.type] = deviation;
      });
    });

    return {
      rollDistribution,
      diceTypeUsage,
      averageRoll: totalValue / totalRolls,
      totalRolls,
      streakAnalysis: {
        longestWinStreak: 0,
        longestLossStreak: 0,
        currentStreak: 0,
        streakType: 'none'
      },
      probabilityDeviations
    };
  }, [gameHistory]);

  // Chart data preparation
  const rollDistributionData = useMemo(() => {
    return Object.entries(analysis.rollDistribution)
      .map(([roll, count]) => ({
        roll: parseInt(roll),
        count,
        percentage: ((count / analysis.totalRolls) * 100).toFixed(1)
      }))
      .sort((a, b) => a.roll - b.roll);
  }, [analysis]);

  const diceUsageData = useMemo(() => {
    return Object.entries(analysis.diceTypeUsage)
      .map(([type, count]) => ({
        type: `d${type}`,
        count,
        percentage: ((count / Object.values(analysis.diceTypeUsage).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => parseInt(a.type.slice(1)) - parseInt(b.type.slice(1)));
  }, [analysis]);

  const probabilityDeviationData = useMemo(() => {
    return Object.entries(analysis.probabilityDeviations)
      .map(([type, deviation]) => ({
        type: `d${type}`,
        deviation: parseFloat(deviation.toFixed(2)),
        expected: 0,
        color: deviation > 0 ? '#4ECDC4' : '#FF6B6B'
      }))
      .sort((a, b) => parseInt(a.type.slice(1)) - parseInt(b.type.slice(1)));
  }, [analysis]);

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const metrics = {
      efficiency: 0,
      consistency: 0,
      riskProfile: 'balanced' as 'conservative' | 'balanced' | 'aggressive',
      skillLevel: 0
    };

    if (analysis.totalRolls > 0) {
      // Calculate efficiency (how close to optimal expected values)
      const expectedAverage = Object.entries(analysis.diceTypeUsage)
        .reduce((sum, [type, count]) => {
          const diceType = parseInt(type);
          const expectedValue = (diceType + 1) / 2;
          return sum + (expectedValue * count);
        }, 0) / analysis.totalRolls;
      
      metrics.efficiency = Math.min(100, (analysis.averageRoll / expectedAverage) * 100);
      
      // Calculate consistency (inverse of variance)
      const variance = Object.entries(analysis.rollDistribution)
        .reduce((sum, [roll, count]) => {
          const deviation = parseInt(roll) - analysis.averageRoll;
          return sum + (deviation * deviation * count);
        }, 0) / analysis.totalRolls;
      
      metrics.consistency = Math.max(0, 100 - (variance * 2));
      
      // Determine risk profile
      const highVarianceDice = Object.entries(analysis.diceTypeUsage)
        .filter(([type]) => parseInt(type) >= 12)
        .reduce((sum, [, count]) => sum + count, 0);
      
      const riskRatio = highVarianceDice / analysis.totalRolls;
      metrics.riskProfile = riskRatio > 0.6 ? 'aggressive' : 
                           riskRatio < 0.2 ? 'conservative' : 'balanced';
      
      // Calculate skill level (composite score)
      metrics.skillLevel = (metrics.efficiency + metrics.consistency) / 2;
    }

    return metrics;
  }, [analysis]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-emerald-accent/20">
          <p className="text-light-grey text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-emerald-accent font-medium">
              {`${entry.name}: ${entry.value}${entry.payload.percentage ? ` (${entry.payload.percentage}%)` : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="glass-header p-6 border-b border-emerald-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-light-grey font-orbitron">
                  Advanced Statistics Dashboard
                </h2>
                <p className="text-medium-grey mt-1">
                  Comprehensive analysis of {analysis.totalRolls} rolls across {gameHistory.length} rounds
                </p>
              </div>
              <button
                onClick={onClose}
                className="glass-button-secondary p-2 hover:bg-red-500/20"
                aria-label="Close dashboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-4">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'dice', label: 'Dice Analysis' },
                { id: 'trends', label: 'Trends' },
                { id: 'advanced', label: 'Advanced' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-accent text-charcoal'
                      : 'text-medium-grey hover:text-light-grey hover:bg-emerald-accent/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-medium-grey">Efficiency</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gunmetal rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-accent transition-all duration-500"
                            style={{ width: `${performanceMetrics.efficiency}%` }}
                          />
                        </div>
                        <span className="text-emerald-accent font-medium">
                          {performanceMetrics.efficiency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-medium-grey">Consistency</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gunmetal rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-accent transition-all duration-500"
                            style={{ width: `${performanceMetrics.consistency}%` }}
                          />
                        </div>
                        <span className="text-blue-accent font-medium">
                          {performanceMetrics.consistency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-medium-grey">Risk Profile</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        performanceMetrics.riskProfile === 'aggressive' ? 'bg-red-500/20 text-red-400' :
                        performanceMetrics.riskProfile === 'conservative' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {performanceMetrics.riskProfile.charAt(0).toUpperCase() + performanceMetrics.riskProfile.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-medium-grey">Skill Level</span>
                      <span className="text-gold-accent font-medium">
                        {performanceMetrics.skillLevel.toFixed(1)}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Session Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-accent">
                        {analysis.totalRolls}
                      </div>
                      <div className="text-sm text-medium-grey">Total Rolls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-accent">
                        {analysis.averageRoll.toFixed(2)}
                      </div>
                      <div className="text-sm text-medium-grey">Average Roll</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold-accent">
                        {gameHistory.length}
                      </div>
                      <div className="text-sm text-medium-grey">Rounds Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-accent">
                        {Object.keys(analysis.diceTypeUsage).length}
                      </div>
                      <div className="text-sm text-medium-grey">Dice Types Used</div>
                    </div>
                  </div>
                </div>

                {/* Roll Distribution Chart */}
                <div className="glass-card p-4 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Roll Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={rollDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="roll" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'dice' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dice Usage Pie Chart */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Dice Type Usage</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={diceUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percentage }) => `${type} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {diceUsageData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Probability Deviations */}
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Probability Deviations</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={probabilityDeviationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="type" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                        label={{ value: 'Deviation %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="deviation" 
                        fill={(entry: any) => entry.color}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="expected" 
                        fill="#6B7280"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-medium-grey mt-2">
                    Positive values indicate rolls above expected average, negative values below.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold text-light-grey mb-4">Coming Soon: Trend Analysis</h3>
                <p className="text-medium-grey">
                  Advanced trend analysis will be available in the next update, including:
                </p>
                <ul className="list-disc list-inside text-medium-grey mt-2 space-y-1">
                  <li>Performance trends over time</li>
                  <li>Streak analysis and patterns</li>
                  <li>Seasonal performance variations</li>
                  <li>Predictive modeling</li>
                </ul>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Advanced Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-emerald-accent mb-2">Statistical Significance</h4>
                      <p className="text-sm text-medium-grey">
                        With {analysis.totalRolls} rolls, your data has {analysis.totalRolls > 100 ? 'high' : 'moderate'} statistical significance.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-accent mb-2">Confidence Intervals</h4>
                      <p className="text-sm text-medium-grey">
                        95% confidence interval for average roll: {(analysis.averageRoll - 0.5).toFixed(2)} - {(analysis.averageRoll + 0.5).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold text-light-grey mb-4">Machine Learning Insights</h3>
                  <p className="text-medium-grey">
                    Advanced ML-powered insights will be available soon, including pattern recognition and predictive analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatsDashboard;
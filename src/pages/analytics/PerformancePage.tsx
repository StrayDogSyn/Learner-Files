// Temporary stub for PerformancePage
import React from 'react';
import { Activity, Clock, Zap, TrendingUp } from 'lucide-react';

const PerformancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Performance Analytics</h1>
          <p className="text-gray-300 mb-8">
            Monitor application performance metrics and user experience indicators.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Page Load Time</h3>
                  <p className="text-2xl font-bold text-green-400">1.2s</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Average load time</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Time to Interactive</h3>
                  <p className="text-2xl font-bold text-blue-400">2.1s</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Time until interactive</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Core Web Vitals</h3>
                  <p className="text-2xl font-bold text-yellow-400">Good</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Overall score</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Performance Score</h3>
                  <p className="text-2xl font-bold text-purple-400">92</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Lighthouse score</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Performance Trends</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Last 24 hours</span>
                  <span className="text-green-400">+5% improvement</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Last 7 days</span>
                  <span className="text-green-400">+12% improvement</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Last 30 days</span>
                  <span className="text-blue-400">Stable</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Resource Usage</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">JavaScript Bundle</span>
                  <span className="text-yellow-400">245 KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">CSS Bundle</span>
                  <span className="text-green-400">32 KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Images</span>
                  <span className="text-blue-400">156 KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Size</span>
                  <span className="text-purple-400">433 KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
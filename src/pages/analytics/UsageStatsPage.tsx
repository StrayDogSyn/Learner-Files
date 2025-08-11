// Temporary stub for UsageStatsPage
import React from 'react';
import { Users, Eye, Clock, MousePointer } from 'lucide-react';

const UsageStatsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Usage Statistics</h1>
          <p className="text-gray-300 mb-8">
            Detailed analytics about user behavior and application usage patterns.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Visitors</h3>
                  <p className="text-2xl font-bold text-blue-400">1,247</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">All time visitors</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Page Views</h3>
                  <p className="text-2xl font-bold text-green-400">3,891</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Total page views</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Avg. Session</h3>
                  <p className="text-2xl font-bold text-yellow-400">4m 32s</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Average session duration</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MousePointer className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Bounce Rate</h3>
                  <p className="text-2xl font-bold text-purple-400">23%</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Single page visits</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Popular Pages</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Home</span>
                  <span className="text-blue-400">1,234 views</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Games</span>
                  <span className="text-green-400">892 views</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Projects</span>
                  <span className="text-yellow-400">567 views</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Contact</span>
                  <span className="text-purple-400">234 views</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Direct</span>
                  <span className="text-blue-400">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">GitHub</span>
                  <span className="text-green-400">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">LinkedIn</span>
                  <span className="text-yellow-400">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Other</span>
                  <span className="text-purple-400">12%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">User Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400 mb-2">78%</p>
                <p className="text-gray-300">Return Visitors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400 mb-2">3.2</p>
                <p className="text-gray-300">Pages per Session</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400 mb-2">89%</p>
                <p className="text-gray-300">User Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatsPage;
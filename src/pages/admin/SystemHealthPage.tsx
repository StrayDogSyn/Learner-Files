// Temporary stub for SystemHealthPage
import React from 'react';

const SystemHealthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">System Health</h1>
          <p className="text-gray-300 mb-4">
            System health monitoring dashboard coming soon.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Server Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400">Online</span>
              </div>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400">Connected</span>
              </div>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400">Stub Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
// Temporary stub for AdminPage
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Settings, Database, Shield, BarChart3 } from 'lucide-react';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
          <p className="text-gray-300 mb-8">
            Administrative controls and system management for the portfolio platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-400">1,247</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Registered users</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                  <p className="text-2xl font-bold text-green-400">89</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Current active users</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">System Load</h3>
                  <p className="text-2xl font-bold text-yellow-400">23%</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Current system usage</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/users" className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
                  <p className="text-gray-300">Manage user accounts and permissions</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/system-health" className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <Activity className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">System Health</h3>
                  <p className="text-gray-300">Monitor system performance and status</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/logs" className="glass-card p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <Database className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">System Logs</h3>
                  <p className="text-gray-300">View application logs and events</p>
                </div>
              </div>
            </Link>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-4">
                <Settings className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Configuration</h3>
                  <p className="text-gray-300">System settings and configuration</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-red-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
                  <p className="text-gray-300">Security settings and access control</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-4">
                <BarChart3 className="w-8 h-8 text-indigo-400" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
                  <p className="text-gray-300">Advanced analytics and reporting</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">User registration spike</span>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">System backup completed</span>
                  <span className="text-sm text-gray-400">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Security scan finished</span>
                  <span className="text-sm text-gray-400">6 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Database optimization</span>
                  <span className="text-sm text-gray-400">8 hours ago</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">API Server</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Database</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Cache</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Analytics</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">Stub Mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
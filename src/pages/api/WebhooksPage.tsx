// Temporary stub for WebhooksPage
import React, { useState } from 'react';
import { Webhook, Plus, Settings, Activity, AlertCircle } from 'lucide-react';

const WebhooksPage: React.FC = () => {
  const [webhooks] = useState([
    {
      id: '1',
      name: 'Portfolio Updates',
      url: 'https://api.example.com/webhooks/portfolio',
      events: ['project.created', 'project.updated'],
      status: 'active',
      lastTriggered: '2024-01-20 10:30:00'
    },
    {
      id: '2',
      name: 'Analytics Events',
      url: 'https://analytics.example.com/webhook',
      events: ['user.visit', 'game.completed'],
      status: 'active',
      lastTriggered: '2024-01-20 09:15:00'
    },
    {
      id: '3',
      name: 'Contact Form',
      url: 'https://notifications.example.com/contact',
      events: ['contact.submitted'],
      status: 'inactive',
      lastTriggered: '2024-01-19 14:22:00'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Webhooks</h1>
              <p className="text-gray-300">
                Manage webhook endpoints for real-time event notifications.
              </p>
            </div>
            <button className="flex items-center space-x-2 bg-blue-500/20 border border-blue-400/40 text-blue-100 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Webhook</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Webhook className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Webhooks</h3>
                  <p className="text-2xl font-bold text-blue-400">{webhooks.length}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Configured endpoints</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Active</h3>
                  <p className="text-2xl font-bold text-green-400">
                    {webhooks.filter(w => w.status === 'active').length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Currently active</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Events Today</h3>
                  <p className="text-2xl font-bold text-yellow-400">47</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Webhook deliveries</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Configured Webhooks</h3>
            
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      webhook.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{webhook.name}</h4>
                      <p className="text-sm text-gray-400">{webhook.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      webhook.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {webhook.status}
                    </span>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">Events</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">Last Triggered</p>
                    <p className="text-sm text-gray-400">{webhook.lastTriggered}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Available Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">Portfolio Events</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>• project.created</div>
                  <div>• project.updated</div>
                  <div>• project.deleted</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">User Events</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>• user.visit</div>
                  <div>• user.signup</div>
                  <div>• user.login</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300">Game Events</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>• game.started</div>
                  <div>• game.completed</div>
                  <div>• achievement.unlocked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhooksPage;
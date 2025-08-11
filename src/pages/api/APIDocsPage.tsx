// Temporary stub for APIDocsPage
import React from 'react';
import { Book, Code, Database, Key } from 'lucide-react';

const APIDocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">API Documentation</h1>
          <p className="text-gray-300 mb-8">
            Comprehensive documentation for the portfolio API endpoints and integration guides.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Book className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Endpoints</h3>
                  <p className="text-2xl font-bold text-blue-400">12</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Available API endpoints</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Examples</h3>
                  <p className="text-2xl font-bold text-green-400">24</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Code examples</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Models</h3>
                  <p className="text-2xl font-bold text-yellow-400">8</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Data models</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Key className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Auth</h3>
                  <p className="text-2xl font-bold text-purple-400">JWT</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Authentication method</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Start</h3>
              <div className="bg-black/30 rounded-lg p-4 mb-4">
                <code className="text-green-400 text-sm">
                  {`curl -X GET "https://api.portfolio.dev/v1/projects" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </code>
              </div>
              <p className="text-gray-300">
                Get started with the portfolio API by making your first request to fetch project data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Core Endpoints</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">GET /projects</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Public</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">GET /analytics</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Auth</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">POST /contact</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Public</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">GET /games/stats</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Auth</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Response Format</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <code className="text-blue-400 text-sm">
                    {`{
  "success": true,
  "data": {
    "projects": [...],
    "total": 12
  },
  "meta": {
    "page": 1,
    "limit": 10
  }
}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;
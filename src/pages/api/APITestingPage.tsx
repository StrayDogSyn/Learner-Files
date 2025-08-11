// Temporary stub for APITestingPage
import React, { useState } from 'react';
import { Play, Send, Copy, Download } from 'lucide-react';

const APITestingPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /projects');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');

  const endpoints = [
    'GET /projects',
    'GET /analytics',
    'POST /contact',
    'GET /games/stats',
    'PUT /profile',
    'DELETE /session'
  ];

  const handleTest = () => {
    // Simulate API response
    const mockResponse = {
      success: true,
      data: {
        message: 'API test successful',
        endpoint: selectedEndpoint,
        timestamp: new Date().toISOString()
      },
      meta: {
        responseTime: '125ms',
        status: 200
      }
    };
    
    setResponse(JSON.stringify(mockResponse, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6">API Testing Console</h1>
          <p className="text-gray-300 mb-8">
            Interactive console for testing API endpoints and exploring responses.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Panel */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Request</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Endpoint
                    </label>
                    <select 
                      value={selectedEndpoint}
                      onChange={(e) => setSelectedEndpoint(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      {endpoints.map(endpoint => (
                        <option key={endpoint} value={endpoint} className="bg-slate-800">
                          {endpoint}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Headers
                    </label>
                    <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-400">
                      <div>Authorization: Bearer YOUR_API_KEY</div>
                      <div>Content-Type: application/json</div>
                    </div>
                  </div>
                  
                  {selectedEndpoint.startsWith('POST') || selectedEndpoint.startsWith('PUT') ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Request Body
                      </label>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder='{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                        className="w-full h-32 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-mono text-sm"
                      />
                    </div>
                  ) : null}
                  
                  <button
                    onClick={handleTest}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500/20 border border-blue-400/40 text-blue-100 hover:bg-blue-500/30 px-4 py-3 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Request</span>
                  </button>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Tests</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-white">Test Authentication</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4 text-blue-400" />
                    <span className="text-white">Test Rate Limiting</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">Test Error Handling</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Response Panel */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Response</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {response ? (
                  <div className="bg-black/30 rounded-lg p-4 h-96 overflow-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {response}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-black/30 rounded-lg p-4 h-96 flex items-center justify-center">
                    <p className="text-gray-500">No response yet. Send a request to see the response.</p>
                  </div>
                )}
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Response Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">200 OK</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Response Time</span>
                    <span className="text-blue-400">125ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Content Type</span>
                    <span className="text-yellow-400">application/json</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Content Length</span>
                    <span className="text-purple-400">1.2 KB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestingPage;
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Download, Share2, Code, Eye, Trophy, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface CodeTemplate {
  id: string;
  name: string;
  language: string;
  code: string;
  description: string;
}

const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: 'react-component',
    name: 'React Component',
    language: 'jsx',
    code: `import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Interactive Counter</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  );
}

export default MyComponent;`,
    description: 'A simple React component with state management'
  },
  {
    id: 'html-css',
    name: 'HTML + CSS',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Card</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .card:hover {
            transform: translateY(-10px);
        }
        
        .card h1 {
            color: #333;
            margin-bottom: 20px;
        }
        
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s ease;
        }
        
        .btn:hover {
            background: #764ba2;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello, World!</h1>
        <p>This is an interactive card with hover effects.</p>
        <button class="btn" onclick="alert('Button clicked!')">Click Me</button>
    </div>
</body>
</html>`,
    description: 'Interactive HTML page with CSS animations'
  },
  {
    id: 'javascript-game',
    name: 'JavaScript Game',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Number Guessing Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .game-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
        }
        
        input, button {
            padding: 12px;
            margin: 10px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }
        
        button {
            background: #4ecdc4;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        button:hover {
            background: #45b7aa;
        }
        
        .message {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            font-weight: bold;
        }
        
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>🎯 Number Guessing Game</h1>
        <p>I'm thinking of a number between 1 and 100!</p>
        
        <input type="number" id="guessInput" placeholder="Enter your guess" min="1" max="100">
        <br>
        <button onclick="makeGuess()">Make Guess</button>
        <button onclick="resetGame()">New Game</button>
        
        <div id="message" class="message info">Make your first guess!</div>
        <div id="attempts">Attempts: 0</div>
    </div>

    <script>
        let targetNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        
        function makeGuess() {
            const guess = parseInt(document.getElementById('guessInput').value);
            const messageEl = document.getElementById('message');
            const attemptsEl = document.getElementById('attempts');
            
            if (!guess || guess < 1 || guess > 100) {
                messageEl.textContent = 'Please enter a valid number between 1 and 100!';
                messageEl.className = 'message error';
                return;
            }
            
            attempts++;
            attemptsEl.textContent = \`Attempts: \${attempts}\`;
            
            if (guess === targetNumber) {
                messageEl.textContent = \`🎉 Congratulations! You guessed it in \${attempts} attempts!\`;
                messageEl.className = 'message success';
            } else if (guess < targetNumber) {
                messageEl.textContent = '📈 Too low! Try a higher number.';
                messageEl.className = 'message info';
            } else {
                messageEl.textContent = '📉 Too high! Try a lower number.';
                messageEl.className = 'message info';
            }
            
            document.getElementById('guessInput').value = '';
        }
        
        function resetGame() {
            targetNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            document.getElementById('message').textContent = 'Make your first guess!';
            document.getElementById('message').className = 'message info';
            document.getElementById('attempts').textContent = 'Attempts: 0';
            document.getElementById('guessInput').value = '';
        }
        
        // Allow Enter key to submit guess
        document.getElementById('guessInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                makeGuess();
            }
        });
    </script>
</body>
</html>`,
    description: 'Interactive number guessing game with JavaScript'
  }
];

export const LiveCodeEditor: React.FC = () => {
  const [code, setCode] = useState(CODE_TEMPLATES[0].code);
  const [selectedTemplate, setSelectedTemplate] = useState(CODE_TEMPLATES[0]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedCodes, setSavedCodes] = useState<Array<{id: string, name: string, code: string}>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { addAchievement, addXP } = useGameStore();

  const runCode = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
        
        // Award achievement for first code run
        addAchievement({
          id: 'first-code-run',
          title: 'Code Runner',
          description: 'Executed your first code in the live editor',
          icon: '▶️',
          rarity: 'common'
        });
        addXP(25);
      }
    }
    setIsPreviewMode(true);
  };

  const saveCode = () => {
    const name = prompt('Enter a name for this code:');
    if (name) {
      const newSave = {
        id: Date.now().toString(),
        name,
        code
      };
      setSavedCodes(prev => [...prev, newSave]);
      
      // Award achievement for saving code
      addAchievement({
        id: 'code-saver',
        title: 'Code Collector',
        description: 'Saved your first code snippet',
        icon: '💾',
        rarity: 'common'
      });
      addXP(50);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Award achievement for downloading code
    addAchievement({
      id: 'code-downloader',
      title: 'Code Exporter',
      description: 'Downloaded your first code file',
      icon: '⬇️',
      rarity: 'common'
    });
    addXP(30);
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out my ${selectedTemplate.name}`,
          text: 'I created this interactive code in the Live Code Editor!',
          url: window.location.href
        });
        
        // Award achievement for sharing
        addAchievement({
          id: 'code-sharer',
          title: 'Code Evangelist',
          description: 'Shared your code with others',
          icon: '🚀',
          rarity: 'rare'
        });
        addXP(100);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    }
  };

  const loadTemplate = (template: CodeTemplate) => {
    setSelectedTemplate(template);
    setCode(template.code);
    setIsPreviewMode(false);
  };

  const loadSavedCode = (savedCode: {id: string, name: string, code: string}) => {
    setCode(savedCode.code);
    setIsPreviewMode(false);
  };

  useEffect(() => {
    // Auto-run code when template changes
    if (selectedTemplate.language === 'html') {
      runCode();
    }
  }, [selectedTemplate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Code className="text-green-400" />
            Live Code Editor
            <Zap className="text-yellow-400" />
          </h1>
          <p className="text-gray-300 text-lg">
            Write, edit, and preview code in real-time with instant feedback
          </p>
        </motion.div>

        {/* Templates and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Templates */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Code Templates</h3>
              <div className="space-y-2">
                {CODE_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate.id === template.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/20 text-gray-300 hover:bg-white/30'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm opacity-75">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Codes */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Saved Codes</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedCodes.length === 0 ? (
                  <p className="text-gray-400 text-sm">No saved codes yet</p>
                ) : (
                  savedCodes.map(saved => (
                    <button
                      key={saved.id}
                      onClick={() => loadSavedCode(saved)}
                      className="w-full text-left p-3 rounded-lg bg-white/20 text-gray-300 hover:bg-white/30 transition-colors"
                    >
                      <div className="font-medium">{saved.name}</div>
                      <div className="text-sm opacity-75">Custom code</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={runCode}
                  className="w-full flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Play size={20} />
                  Run Code
                </button>
                
                <button
                  onClick={saveCode}
                  className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save size={20} />
                  Save Code
                </button>
                
                <button
                  onClick={downloadCode}
                  className="w-full flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download size={20} />
                  Download
                </button>
                
                <button
                  onClick={shareCode}
                  className="w-full flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center">
            <div className="bg-white/20 rounded-lg p-1 flex">
              <button
                onClick={() => setIsPreviewMode(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  !isPreviewMode ? 'bg-white text-gray-900' : 'text-white'
                }`}
              >
                <Code size={20} />
                Editor
              </button>
              <button
                onClick={() => setIsPreviewMode(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isPreviewMode ? 'bg-white text-gray-900' : 'text-white'
                }`}
              >
                <Eye size={20} />
                Preview
              </button>
            </div>
          </div>
        </motion.div>

        {/* Editor/Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
          style={{ height: '600px' }}
        >
          {!isPreviewMode ? (
            <div className="h-full flex flex-col">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-white font-medium">{selectedTemplate.name}</span>
                <span className="text-gray-400 text-sm">{selectedTemplate.language}</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full p-4 bg-gray-900 text-green-400 font-mono text-sm resize-none focus:outline-none"
                placeholder="Write your code here..."
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-white font-medium">Live Preview</span>
                <button
                  onClick={runCode}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  <Play size={16} />
                  Refresh
                </button>
              </div>
              <iframe
                ref={iframeRef}
                className="flex-1 w-full bg-white"
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">🎯 Getting Started</h4>
              <ul className="space-y-1 text-sm">
                <li>• Choose a template to begin coding</li>
                <li>• Use the editor to modify the code</li>
                <li>• Click "Run Code" to see your changes</li>
                <li>• Save your work for later reference</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">🚀 Advanced Features</h4>
              <ul className="space-y-1 text-sm">
                <li>• Download your code as HTML files</li>
                <li>• Share your creations with others</li>
                <li>• Build interactive web applications</li>
                <li>• Experiment with different technologies</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveCodeEditor;
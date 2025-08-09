import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2, 
  Code, 
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import type { CodeSnippet } from '../types/portfolio';
import { getHighlighter } from 'shiki';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface CodeShowcaseProps {
  className?: string;
  snippets?: CodeSnippet[];
  showExecution?: boolean;
  showExplanation?: boolean;
}

interface CodeBlockProps {
  snippet: CodeSnippet;
  onExecute?: (code: string) => void;
  onExplain?: (code: string, language: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface ExecutionResult {
  output?: string;
  error?: string;
  logs?: string[];
}

interface ExplanationResult {
  explanation: string;
  key_concepts: string[];
  suggestions: string[];
}

const languageMap: Record<string, string> = {
  'javascript': 'javascript',
  'typescript': 'typescript',
  'python': 'python',
  'java': 'java',
  'cpp': 'cpp',
  'c': 'c',
  'html': 'html',
  'css': 'css',
  'json': 'json',
  'markdown': 'markdown',
  'bash': 'bash',
  'sql': 'sql'
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  snippet,
  onExecute,
  onExplain,
  isExpanded = false,
  onToggleExpand
}) => {
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const codeRef = useRef<HTMLElement>(null);
  const animationsEnabled = usePortfolioStore((state) => state.animationsEnabled);

  // Syntax highlighting with Shiki
  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await getHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: Object.values(languageMap)
        });

        const lang = languageMap[snippet.language] || 'text';
        const html = highlighter.codeToHtml(snippet.code, {
          lang,
          themes: {
            light: 'github-light',
            dark: 'github-dark'
          }
        });
        
        setHighlightedCode(html);
      } catch (error) {
        console.warn('Failed to highlight code:', error);
        setHighlightedCode(`<pre><code>${snippet.code}</code></pre>`);
      }
    };

    highlightCode();
  }, [snippet.code, snippet.language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleExecute = async () => {
    if (!snippet.executable || !onExecute) return;
    
    setExecuting(true);
    setExecutionResult(null);
    
    try {
      // Simulate code execution (in a real app, this would be a sandboxed environment)
      if (snippet.language === 'javascript') {
        const result = await executeJavaScript(snippet.code);
        setExecutionResult(result);
      } else {
        setExecutionResult({
          error: `Execution not supported for ${snippet.language}`
        });
      }
    } catch (error) {
      setExecutionResult({
        error: error instanceof Error ? error.message : 'Execution failed'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleExplain = async () => {
    if (!onExplain) return;
    
    setExplaining(true);
    setExplanation(null);
    
    try {
      // This would integrate with Claude AI API in a real implementation
      const mockExplanation: ExplanationResult = {
        explanation: `This ${snippet.language} code demonstrates ${snippet.description}. The implementation uses modern best practices and follows clean code principles.`,
        key_concepts: [
          'Variable declaration',
          'Function definition',
          'Control flow',
          'Data manipulation'
        ],
        suggestions: [
          'Consider adding error handling',
          'Add type annotations for better maintainability',
          'Consider performance optimizations'
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setExplanation(mockExplanation);
    } catch (error) {
      console.error('Failed to get explanation:', error);
    } finally {
      setExplaining(false);
    }
  };

  const executeJavaScript = async (code: string): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
      const logs: string[] = [];
      const originalConsole = console.log;
      
      // Capture console.log output
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
        originalConsole(...args);
      };
      
      try {
        // Create a safe execution context
        const result = new Function(code)();
        console.log = originalConsole;
        
        resolve({
          output: result !== undefined ? String(result) : undefined,
          logs
        });
      } catch (error) {
        console.log = originalConsole;
        resolve({
          error: error instanceof Error ? error.message : 'Unknown error',
          logs
        });
      }
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    expanded: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={animationsEnabled ? cardVariants : {}}
      initial={animationsEnabled ? 'hidden' : false}
      animate={animationsEnabled ? (isExpanded ? 'expanded' : 'visible') : false}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${
        isExpanded ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {snippet.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {snippet.language.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          
          {snippet.executable && onExecute && (
            <button
              onClick={handleExecute}
              disabled={executing}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              aria-label="Execute code"
            >
              {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          
          {onExplain && (
            <button
              onClick={handleExplain}
              disabled={explaining}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              aria-label="Explain code"
            >
              {explaining ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            </button>
          )}
          
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className={`${isExpanded ? 'flex-1 overflow-auto' : ''}`}>
        {/* Description */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300">{snippet.description}</p>
          
          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {snippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code Block */}
        <div className="relative">
          <div 
            className="overflow-x-auto text-sm"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>

        {/* Execution Result */}
        <AnimatePresence>
          {executionResult && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  {executionResult.error ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Execution Error
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-green-600" />
                      Execution Result
                    </>
                  )}
                </h4>
                
                {executionResult.error ? (
                  <pre className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    {executionResult.error}
                  </pre>
                ) : (
                  <div className="space-y-2">
                    {executionResult.output && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output:</span>
                        <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                          {executionResult.output}
                        </pre>
                      </div>
                    )}
                    
                    {executionResult.logs && executionResult.logs.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Console:</span>
                        <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                          {executionResult.logs.join('\n')}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Explanation */}
        <AnimatePresence>
          {explanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/20"
            >
              <div className="p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  AI Explanation
                </h4>
                
                <p className="text-gray-700 dark:text-gray-300">
                  {explanation.explanation}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Key Concepts:</h5>
                    <ul className="space-y-1">
                      {explanation.key_concepts.map((concept, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Suggestions:</h5>
                    <ul className="space-y-1">
                      {explanation.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CodeShowcase: React.FC<CodeShowcaseProps> = ({
  className = '',
  snippets,
  showExecution = true,
  showExplanation = true
}) => {
  const {
    codeSnippets,
    activeCodeSnippet,
    setActiveCodeSnippet
  } = usePortfolioStore();

  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);

  const displaySnippets = snippets || codeSnippets.data || [];
  
  const availableLanguages = Array.from(
    new Set(displaySnippets.map(snippet => snippet.language))
  ).sort();

  const filteredSnippets = selectedLanguage === 'all' 
    ? displaySnippets
    : displaySnippets.filter(snippet => snippet.language === selectedLanguage);

  const handleExecute = (code: string) => {
    console.log('Executing code:', code);
  };

  const handleExplain = (code: string, language: string) => {
    console.log('Explaining code:', { code, language });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (codeSnippets.loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (codeSnippets.error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load code snippets</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Code Showcase
          {filteredSnippets.length > 0 && (
            <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              ({filteredSnippets.length})
            </span>
          )}
        </h2>
        
        {/* Language Filter */}
        {availableLanguages.length > 1 && (
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by programming language"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Code Snippets */}
      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {displaySnippets.length === 0 
              ? 'No code snippets available yet.' 
              : `No ${selectedLanguage} snippets found.`}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {filteredSnippets.map((snippet) => (
            <CodeBlock
              key={snippet.id}
              snippet={snippet}
              onExecute={showExecution ? handleExecute : undefined}
              onExplain={showExplanation ? handleExplain : undefined}
              isExpanded={expandedSnippet === snippet.id}
              onToggleExpand={() => 
                setExpandedSnippet(expandedSnippet === snippet.id ? null : snippet.id)
              }
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CodeShowcase;
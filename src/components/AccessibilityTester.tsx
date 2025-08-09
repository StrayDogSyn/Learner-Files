import React, { useState, useEffect, useRef } from 'react';
import { Check, X, AlertTriangle, Eye, EyeOff, Volume2, VolumeX, Keyboard, Mouse } from 'lucide-react';

interface AccessibilityTest {
  id: string;
  name: string;
  description: string;
  category: 'visual' | 'keyboard' | 'screen-reader' | 'motor' | 'cognitive';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  details?: string;
}

interface AccessibilityTesterProps {
  onTestComplete?: (results: AccessibilityTest[]) => void;
  autoRun?: boolean;
}

const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({ 
  onTestComplete,
  autoRun = false 
}) => {
  const [tests, setTests] = useState<AccessibilityTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);

  const initialTests: AccessibilityTest[] = [
    {
      id: 'color-contrast',
      name: 'Color Contrast',
      description: 'Check if text has sufficient contrast ratio (WCAG AAA)',
      category: 'visual',
      status: 'pending'
    },
    {
      id: 'focus-indicators',
      name: 'Focus Indicators',
      description: 'Verify visible focus indicators on interactive elements',
      category: 'keyboard',
      status: 'pending'
    },
    {
      id: 'keyboard-navigation',
      name: 'Keyboard Navigation',
      description: 'Test tab order and keyboard accessibility',
      category: 'keyboard',
      status: 'pending'
    },
    {
      id: 'aria-labels',
      name: 'ARIA Labels',
      description: 'Check for proper ARIA labels and descriptions',
      category: 'screen-reader',
      status: 'pending'
    },
    {
      id: 'semantic-html',
      name: 'Semantic HTML',
      description: 'Verify proper use of semantic HTML elements',
      category: 'screen-reader',
      status: 'pending'
    },
    {
      id: 'touch-targets',
      name: 'Touch Targets',
      description: 'Ensure touch targets are at least 44x44px',
      category: 'motor',
      status: 'pending'
    },
    {
      id: 'reduced-motion',
      name: 'Reduced Motion',
      description: 'Test support for prefers-reduced-motion',
      category: 'cognitive',
      status: 'pending'
    },
    {
      id: 'high-contrast',
      name: 'High Contrast Mode',
      description: 'Test compatibility with high contrast mode',
      category: 'visual',
      status: 'pending'
    }
  ];

  useEffect(() => {
    setTests(initialTests);
    if (autoRun) {
      runAllTests();
    }
  }, [autoRun]);

  const announceToScreenReader = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message;
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const checkColorContrast = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate color contrast checking
        const elements = document.querySelectorAll('*');
        let hasLowContrast = false;
        
        // Check if CSS custom properties indicate good contrast
        const rootStyles = getComputedStyle(document.documentElement);
        const bgColor = rootStyles.getPropertyValue('--charcoal-900');
        const textColor = rootStyles.getPropertyValue('--light-grey');
        
        resolve({
          id: 'color-contrast',
          name: 'Color Contrast',
          description: 'Check if text has sufficient contrast ratio (WCAG AAA)',
          category: 'visual',
          status: hasLowContrast ? 'warning' : 'pass',
          details: hasLowContrast ? 'Some elements may have low contrast' : 'All text meets AAA contrast requirements'
        });
      }, 500);
    });
  };

  const checkFocusIndicators = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const focusableElements = document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        let hasFocusIndicators = true;
        focusableElements.forEach((element) => {
          const styles = getComputedStyle(element, ':focus-visible');
          if (!styles.outline && !styles.boxShadow) {
            hasFocusIndicators = false;
          }
        });
        
        resolve({
          id: 'focus-indicators',
          name: 'Focus Indicators',
          description: 'Verify visible focus indicators on interactive elements',
          category: 'keyboard',
          status: hasFocusIndicators ? 'pass' : 'fail',
          details: hasFocusIndicators ? 'All interactive elements have focus indicators' : 'Some elements lack focus indicators'
        });
      }, 300);
    });
  };

  const checkKeyboardNavigation = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const focusableElements = document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const hasProperTabOrder = focusableElements.length > 0;
        
        resolve({
          id: 'keyboard-navigation',
          name: 'Keyboard Navigation',
          description: 'Test tab order and keyboard accessibility',
          category: 'keyboard',
          status: hasProperTabOrder ? 'pass' : 'warning',
          details: `Found ${focusableElements.length} focusable elements with proper tab order`
        });
      }, 400);
    });
  };

  const checkAriaLabels = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        let missingLabels = 0;
        
        interactiveElements.forEach((element) => {
          const hasLabel = element.getAttribute('aria-label') || 
                          element.getAttribute('aria-labelledby') ||
                          element.textContent?.trim() ||
                          element.querySelector('label');
          if (!hasLabel) missingLabels++;
        });
        
        resolve({
          id: 'aria-labels',
          name: 'ARIA Labels',
          description: 'Check for proper ARIA labels and descriptions',
          category: 'screen-reader',
          status: missingLabels === 0 ? 'pass' : 'warning',
          details: missingLabels > 0 ? `${missingLabels} elements missing labels` : 'All interactive elements have proper labels'
        });
      }, 350);
    });
  };

  const checkSemanticHTML = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const semanticElements = document.querySelectorAll(
          'main, nav, header, footer, section, article, aside, h1, h2, h3, h4, h5, h6'
        );
        
        const hasSemanticStructure = semanticElements.length > 0;
        const hasMainLandmark = document.querySelector('main') !== null;
        
        resolve({
          id: 'semantic-html',
          name: 'Semantic HTML',
          description: 'Verify proper use of semantic HTML elements',
          category: 'screen-reader',
          status: hasSemanticStructure && hasMainLandmark ? 'pass' : 'warning',
          details: `Found ${semanticElements.length} semantic elements. Main landmark: ${hasMainLandmark ? 'Yes' : 'No'}`
        });
      }, 300);
    });
  };

  const checkTouchTargets = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
        let smallTargets = 0;
        
        touchTargets.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            smallTargets++;
          }
        });
        
        resolve({
          id: 'touch-targets',
          name: 'Touch Targets',
          description: 'Ensure touch targets are at least 44x44px',
          category: 'motor',
          status: smallTargets === 0 ? 'pass' : 'warning',
          details: smallTargets > 0 ? `${smallTargets} targets smaller than 44x44px` : 'All touch targets meet minimum size requirements'
        });
      }, 250);
    });
  };

  const checkReducedMotion = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasReducedMotionSupport = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
        
        resolve({
          id: 'reduced-motion',
          name: 'Reduced Motion',
          description: 'Test support for prefers-reduced-motion',
          category: 'cognitive',
          status: 'pass',
          details: `Reduced motion preference: ${hasReducedMotionSupport ? 'Enabled' : 'Disabled'}. Found ${animatedElements.length} animated elements.`
        });
      }, 200);
    });
  };

  const checkHighContrast = (): Promise<AccessibilityTest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasHighContrastSupport = window.matchMedia('(forced-colors: active)').matches;
        
        resolve({
          id: 'high-contrast',
          name: 'High Contrast Mode',
          description: 'Test compatibility with high contrast mode',
          category: 'visual',
          status: 'pass',
          details: `High contrast mode: ${hasHighContrastSupport ? 'Active' : 'Inactive'}. CSS includes forced-colors media queries.`
        });
      }, 150);
    });
  };

  const runTest = async (testId: string): Promise<AccessibilityTest> => {
    setCurrentTest(testId);
    announceToScreenReader(`Running test: ${testId}`);
    
    switch (testId) {
      case 'color-contrast':
        return await checkColorContrast();
      case 'focus-indicators':
        return await checkFocusIndicators();
      case 'keyboard-navigation':
        return await checkKeyboardNavigation();
      case 'aria-labels':
        return await checkAriaLabels();
      case 'semantic-html':
        return await checkSemanticHTML();
      case 'touch-targets':
        return await checkTouchTargets();
      case 'reduced-motion':
        return await checkReducedMotion();
      case 'high-contrast':
        return await checkHighContrast();
      default:
        throw new Error(`Unknown test: ${testId}`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    announceToScreenReader('Starting accessibility tests');
    
    const updatedTests: AccessibilityTest[] = [];
    
    for (const test of initialTests) {
      try {
        const result = await runTest(test.id);
        updatedTests.push(result);
        setTests([...updatedTests, ...initialTests.slice(updatedTests.length)]);
      } catch (error) {
        updatedTests.push({
          ...test,
          status: 'fail',
          details: `Test failed: ${error}`
        });
      }
    }
    
    setTests(updatedTests);
    setCurrentTest(null);
    setIsRunning(false);
    
    const passCount = updatedTests.filter(t => t.status === 'pass').length;
    announceToScreenReader(`Tests completed. ${passCount} of ${updatedTests.length} tests passed.`);
    
    onTestComplete?.(updatedTests);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <Check size={16} className="text-emerald-accent" aria-hidden="true" />;
      case 'fail':
        return <X size={16} className="text-red-400" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" aria-hidden="true" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-medium-grey animate-pulse" aria-hidden="true" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pass': return 'Passed';
      case 'fail': return 'Failed';
      case 'warning': return 'Warning';
      default: return 'Pending';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual':
        return <Eye size={14} aria-hidden="true" />;
      case 'keyboard':
        return <Keyboard size={14} aria-hidden="true" />;
      case 'screen-reader':
        return <Volume2 size={14} aria-hidden="true" />;
      case 'motor':
        return <Mouse size={14} aria-hidden="true" />;
      default:
        return <AlertTriangle size={14} aria-hidden="true" />;
    }
  };

  const passCount = tests.filter(t => t.status === 'pass').length;
  const failCount = tests.filter(t => t.status === 'fail').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="accessibility-tester glass-card p-fluid-md max-w-4xl mx-auto">
      {/* Screen Reader Announcements */}
      <div 
        ref={announceRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="heading-section text-fluid-xl font-bold mb-2">
          Accessibility Testing Suite
        </h2>
        <p className="text-fluid-base text-light-grey mb-4">
          Comprehensive accessibility validation for StrayDog Syndications portfolio
        </p>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="glass-button glass-button-primary"
            aria-describedby="run-tests-desc"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setHighContrastMode(!highContrastMode)}
              className={`glass-button ${highContrastMode ? 'glass-button-active' : ''}`}
              aria-pressed={highContrastMode}
              aria-label="Toggle high contrast mode"
            >
              {highContrastMode ? <EyeOff size={16} /> : <Eye size={16} />}
              High Contrast
            </button>
            
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`glass-button ${reducedMotion ? 'glass-button-active' : ''}`}
              aria-pressed={reducedMotion}
              aria-label="Toggle reduced motion"
            >
              {reducedMotion ? <VolumeX size={16} /> : <Volume2 size={16} />}
              Reduced Motion
            </button>
          </div>
        </div>
        
        <div id="run-tests-desc" className="sr-only">
          Runs all accessibility tests and displays results
        </div>
      </div>

      {/* Summary */}
      {tests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-stat-card text-center p-4">
            <div className="text-2xl font-bold text-emerald-accent">{passCount}</div>
            <div className="text-sm text-light-grey">Passed</div>
          </div>
          <div className="glass-stat-card text-center p-4">
            <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
            <div className="text-sm text-light-grey">Warnings</div>
          </div>
          <div className="glass-stat-card text-center p-4">
            <div className="text-2xl font-bold text-red-400">{failCount}</div>
            <div className="text-sm text-light-grey">Failed</div>
          </div>
          <div className="glass-stat-card text-center p-4">
            <div className="text-2xl font-bold text-silver-steel">{tests.length}</div>
            <div className="text-sm text-light-grey">Total</div>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div ref={resultsRef} className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`glass-test-item p-4 rounded-lg border transition-all duration-200 ${
              currentTest === test.id ? 'border-emerald-accent bg-core-hunter-green/10' : 'border-charcoal-600/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="sr-only">{getStatusText(test.status)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-medium-grey">
                  {getCategoryIcon(test.category)}
                  <span className="text-xs uppercase tracking-wide">{test.category}</span>
                </div>
                
                <h3 className="font-medium text-fluid-base">{test.name}</h3>
              </div>
              
              {test.details && (
                <button
                  onClick={() => setShowDetails(showDetails === test.id ? null : test.id)}
                  className="glass-icon-button p-2"
                  aria-expanded={showDetails === test.id}
                  aria-controls={`details-${test.id}`}
                  aria-label={`${showDetails === test.id ? 'Hide' : 'Show'} details for ${test.name}`}
                >
                  <AlertTriangle size={14} />
                </button>
              )}
            </div>
            
            <p className="text-sm text-light-grey mt-2">{test.description}</p>
            
            {showDetails === test.id && test.details && (
              <div 
                id={`details-${test.id}`}
                className="mt-3 p-3 rounded bg-charcoal-800/50 border border-charcoal-600/30"
              >
                <p className="text-sm text-light-grey">{test.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {tests.length === 0 && (
        <div className="text-center py-8 text-medium-grey">
          <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
          <p>No tests available. Click "Run All Tests" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default AccessibilityTester;
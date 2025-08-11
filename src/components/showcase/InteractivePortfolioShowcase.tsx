/**
 * Interactive Portfolio Showcase
 * Demonstrates component library with live examples and code editing
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Play, 
  Copy, 
  Download, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2,
  Settings,
  Palette,
  Layers,
  Zap,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import GlassTabs from '../ui/GlassTabs';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassBadge from '../ui/GlassBadge';
import GlassInput from '../ui/GlassInput';
import GlassModal from '../ui/GlassModal';
import { usePerformanceTracking } from '../../utils/performanceMonitor';

interface ComponentExample {
  id: string;
  name: string;
  description: string;
  category: 'ui' | 'layout' | 'interactive' | 'animation' | 'form';
  complexity: 'basic' | 'intermediate' | 'advanced';
  code: string;
  preview: React.ComponentType<any>;
  props?: Record<string, any>;
  dependencies: string[];
  tags: string[];
  featured: boolean;
  responsive: boolean;
  accessibility: boolean;
  performance: 'excellent' | 'good' | 'fair';
  lastUpdated: string;
}

interface ShowcaseFilters {
  category?: string;
  complexity?: string;
  search?: string;
  featured?: boolean;
  responsive?: boolean;
  accessibility?: boolean;
}

// Example components for showcase
const ExampleGlassCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <GlassCard className="p-6">
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/70">{content}</p>
  </GlassCard>
);

const ExampleAnimatedButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg backdrop-blur-sm"
  >
    {children}
  </motion.button>
);

const ExampleInteractiveChart: React.FC = () => {
  const [data, setData] = useState([40, 60, 80, 45, 90]);
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {data.map((value, index) => (
          <motion.div
            key={index}
            className="w-8 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t cursor-pointer"
            style={{ height: `${value}px` }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              const newData = [...data];
              newData[index] = Math.random() * 100;
              setData(newData);
            }}
          />
        ))}
      </div>
      <p className="text-white/60 text-sm">Click bars to randomize values</p>
    </div>
  );
};

const ExampleFormControls: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  return (
    <div className="space-y-4">
      <GlassInput
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
      <GlassInput
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
        rows={3}
      />
      <GlassButton className="w-full">
        Send Message
      </GlassButton>
    </div>
  );
};

// Mock component examples
const componentExamples: ComponentExample[] = [
  {
    id: '1',
    name: 'Glass Card',
    description: 'Glassmorphic card component with backdrop blur and transparency effects',
    category: 'ui',
    complexity: 'basic',
    code: `<GlassCard className="p-6">
  <h3 className="text-lg font-semibold text-white mb-2">Glass Card</h3>
  <p className="text-white/70">Beautiful glassmorphic design with backdrop blur effects.</p>
</GlassCard>`,
    preview: ExampleGlassCard,
    props: { title: 'Glass Card', content: 'Beautiful glassmorphic design with backdrop blur effects.' },
    dependencies: ['framer-motion', 'tailwindcss'],
    tags: ['glass', 'card', 'ui', 'modern'],
    featured: true,
    responsive: true,
    accessibility: true,
    performance: 'excellent',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Animated Button',
    description: 'Interactive button with hover and tap animations using Framer Motion',
    category: 'interactive',
    complexity: 'intermediate',
    code: `<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg backdrop-blur-sm"
>
  Click Me!
</motion.button>`,
    preview: ExampleAnimatedButton,
    props: { children: 'Click Me!' },
    dependencies: ['framer-motion', 'tailwindcss'],
    tags: ['animation', 'button', 'interactive', 'motion'],
    featured: true,
    responsive: true,
    accessibility: true,
    performance: 'good',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    name: 'Interactive Chart',
    description: 'Clickable bar chart with smooth animations and state management',
    category: 'interactive',
    complexity: 'advanced',
    code: `const [data, setData] = useState([40, 60, 80, 45, 90]);

return (
  <div className="space-y-4">
    <div className="flex space-x-2">
      {data.map((value, index) => (
        <motion.div
          key={index}
          className="w-8 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t cursor-pointer"
          style={{ height: \`\${value}px\` }}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            const newData = [...data];
            newData[index] = Math.random() * 100;
            setData(newData);
          }}
        />
      ))}
    </div>
    <p className="text-white/60 text-sm">Click bars to randomize values</p>
  </div>
);`,
    preview: ExampleInteractiveChart,
    props: {},
    dependencies: ['framer-motion', 'react', 'tailwindcss'],
    tags: ['chart', 'interactive', 'data', 'visualization'],
    featured: false,
    responsive: true,
    accessibility: false,
    performance: 'good',
    lastUpdated: '2024-01-13'
  },
  {
    id: '4',
    name: 'Form Controls',
    description: 'Complete form with glassmorphic inputs and validation',
    category: 'form',
    complexity: 'intermediate',
    code: `const [formData, setFormData] = useState({ name: '', email: '', message: '' });

return (
  <div className="space-y-4">
    <GlassInput
      placeholder="Your Name"
      value={formData.name}
      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
    />
    <GlassInput
      type="email"
      placeholder="Your Email"
      value={formData.email}
      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
    />
    <textarea
      placeholder="Your Message"
      value={formData.message}
      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
      rows={3}
    />
    <GlassButton className="w-full">
      Send Message
    </GlassButton>
  </div>
);`,
    preview: ExampleFormControls,
    props: {},
    dependencies: ['react', 'tailwindcss'],
    tags: ['form', 'input', 'validation', 'glass'],
    featured: false,
    responsive: true,
    accessibility: true,
    performance: 'excellent',
    lastUpdated: '2024-01-12'
  }
];

interface InteractivePortfolioShowcaseProps {
  className?: string;
}

export function InteractivePortfolioShowcase({ className = '' }: InteractivePortfolioShowcaseProps) {
  const { trackRender, startTiming, endTiming } = usePerformanceTracking('InteractivePortfolioShowcase');
  const [filters, setFilters] = useState<ShowcaseFilters>({});
  const [selectedExample, setSelectedExample] = useState<ComponentExample | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  useEffect(() => {
    startTiming('showcase-load');
    return () => {
      endTiming('showcase-load');
      trackRender();
    };
  }, []);
  
  const filteredExamples = useMemo(() => {
    let filtered = [...componentExamples];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(example => 
        example.name.toLowerCase().includes(searchTerm) ||
        example.description.toLowerCase().includes(searchTerm) ||
        example.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(example => example.category === filters.category);
    }
    
    if (filters.complexity) {
      filtered = filtered.filter(example => example.complexity === filters.complexity);
    }
    
    if (filters.featured !== undefined) {
      filtered = filtered.filter(example => example.featured === filters.featured);
    }
    
    if (filters.responsive !== undefined) {
      filtered = filtered.filter(example => example.responsive === filters.responsive);
    }
    
    if (filters.accessibility !== undefined) {
      filtered = filtered.filter(example => example.accessibility === filters.accessibility);
    }
    
    return filtered;
  }, [filters]);
  
  const categories = useMemo(() => {
    return [...new Set(componentExamples.map(example => example.category))];
  }, []);
  
  const complexityLevels = useMemo(() => {
    return [...new Set(componentExamples.map(example => example.complexity))];
  }, []);
  
  const handleCopyCode = async (code: string, exampleId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(exampleId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  const getDeviceClass = () => {
    switch (devicePreview) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };
  
  const renderExampleCard = (example: ComponentExample) => {
    const PreviewComponent = example.preview;
    
    return (
      <motion.div
        key={example.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        className="cursor-pointer"
        onClick={() => setSelectedExample(example)}
      >
        <GlassCard className="h-full overflow-hidden">
          {/* Preview Area */}
          <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 border-b border-white/10">
            <div className={`${getDeviceClass()} transition-all duration-300`}>
              <PreviewComponent {...example.props} />
            </div>
          </div>
          
          {/* Info Area */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{example.name}</h3>
              <div className="flex items-center space-x-2">
                {example.featured && (
                  <GlassBadge variant="warning" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </GlassBadge>
                )}
                <GlassBadge 
                  variant={example.complexity === 'basic' ? 'success' : example.complexity === 'intermediate' ? 'warning' : 'error'}
                  size="sm"
                >
                  {example.complexity}
                </GlassBadge>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-4 line-clamp-2">
              {example.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {example.tags.slice(0, 3).map(tag => (
                <span key={tag} className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                  {tag}
                </span>
              ))}
              {example.tags.length > 3 && (
                <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                  +{example.tags.length - 3}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center space-x-3">
                {example.responsive && <span title="Responsive">📱</span>}
                {example.accessibility && <span title="Accessible">♿</span>}
                <span className={`px-2 py-1 rounded ${
                  example.performance === 'excellent' ? 'bg-green-500/20 text-green-300' :
                  example.performance === 'good' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {example.performance}
                </span>
              </div>
              <span>{new Date(example.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  };
  
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Interactive Component Showcase
        </h1>
        <p className="text-white/70 text-lg">
          Explore and interact with our glassmorphic component library
        </p>
      </div>
      
      {/* Controls */}
      <GlassCard className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <GlassInput
            placeholder="Search components..."
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            icon={Code}
          />
          
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="" className="bg-gray-800">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-800 capitalize">
                {cat}
              </option>
            ))}
          </select>
          
          <select
            value={filters.complexity || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, complexity: e.target.value || undefined }))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="" className="bg-gray-800">All Levels</option>
            {complexityLevels.map(level => (
              <option key={level} value={level} className="bg-gray-800 capitalize">
                {level}
              </option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
            >
              Clear
            </GlassButton>
          </div>
        </div>
        
        {/* Device Preview Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Preview:</span>
            <div className="flex items-center space-x-1">
              {[
                { key: 'desktop', icon: Monitor, label: 'Desktop' },
                { key: 'tablet', icon: Tablet, label: 'Tablet' },
                { key: 'mobile', icon: Smartphone, label: 'Mobile' }
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setDevicePreview(key as any)}
                  className={`p-2 rounded transition-colors ${
                    devicePreview === key
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Filters:</span>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked || undefined }))}
                className="rounded"
              />
              <span className="text-white/80 text-sm">Featured</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.responsive || false}
                onChange={(e) => setFilters(prev => ({ ...prev, responsive: e.target.checked || undefined }))}
                className="rounded"
              />
              <span className="text-white/80 text-sm">Responsive</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.accessibility || false}
                onChange={(e) => setFilters(prev => ({ ...prev, accessibility: e.target.checked || undefined }))}
                className="rounded"
              />
              <span className="text-white/80 text-sm">Accessible</span>
            </label>
          </div>
        </div>
      </GlassCard>
      
      {/* Component Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredExamples.map(renderExampleCard)}
        </AnimatePresence>
      </motion.div>
      
      {/* Detailed View Modal */}
      <GlassModal
        isOpen={!!selectedExample}
        onClose={() => setSelectedExample(null)}
        title={selectedExample?.name || ''}
        size="xl"
      >
        {selectedExample && (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className={`${getDeviceClass()} ${isFullscreen ? 'min-h-96' : ''} transition-all duration-300`}>
                <selectedExample.preview {...selectedExample.props} />
              </div>
            </div>
            
            {/* Code */}
            {showCode && (
              <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Source Code</h3>
                  <div className="flex items-center space-x-2">
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(selectedExample.code, selectedExample.id)}
                    >
                      {copiedCode === selectedExample.id ? (
                        <span className="text-green-400">Copied!</span>
                      ) : (
                        <><Copy className="w-4 h-4 mr-2" />Copy</>
                      )}
                    </GlassButton>
                  </div>
                </div>
                
                <pre className="p-4 text-sm text-white/80 overflow-x-auto">
                  <code>{selectedExample.code}</code>
                </pre>
              </div>
            )}
            
            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Category:</span>
                    <span className="text-white capitalize">{selectedExample.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Complexity:</span>
                    <span className="text-white capitalize">{selectedExample.complexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Performance:</span>
                    <span className="text-white capitalize">{selectedExample.performance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Last Updated:</span>
                    <span className="text-white">{new Date(selectedExample.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExample.dependencies.map(dep => (
                    <GlassBadge key={dep} variant="info" size="sm">
                      {dep}
                    </GlassBadge>
                  ))}
                </div>
                
                <h4 className="text-white font-semibold mb-3 mt-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExample.tags.map(tag => (
                    <span key={tag} className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassModal>
      
      {filteredExamples.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/40 mb-4">
            <Code className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white/60 mb-2">
            No components found
          </h3>
          <p className="text-white/40">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

export default InteractivePortfolioShowcase;
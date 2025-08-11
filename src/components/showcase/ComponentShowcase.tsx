/**
 * Enhanced Component Showcase with Live Code Editing
 * Interactive demos for all glassmorphic components with real-time editing
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, Copy, Download, Eye, EyeOff, Palette, Settings } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassInput from '../ui/GlassInput';
import GlassModal from '../ui/GlassModal';
import GlassTabs from '../ui/GlassTabs';
import { usePerformanceTracking } from '../../utils/performanceMonitor';

interface ComponentDemo {
  id: string;
  name: string;
  description: string;
  category: 'atoms' | 'molecules' | 'organisms';
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  propTypes: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'select' | 'color';
    options?: string[];
    default: any;
    description: string;
  }>;
  codeTemplate: string;
  examples: {
    name: string;
    props: Record<string, any>;
    description: string;
  }[];
}

const componentDemos: ComponentDemo[] = [
  {
    id: 'glass-button',
    name: 'Glass Button',
    description: 'Interactive glassmorphic button with hover effects and multiple variants',
    category: 'atoms',
    component: GlassButton,
    defaultProps: {
      children: 'Click me',
      variant: 'primary',
      size: 'md',
      disabled: false
    },
    propTypes: {
      children: {
        type: 'string',
        default: 'Click me',
        description: 'Button text content'
      },
      variant: {
        type: 'select',
        options: ['primary', 'secondary', 'ghost', 'danger'],
        default: 'primary',
        description: 'Button style variant'
      },
      size: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
        default: 'md',
        description: 'Button size'
      },
      disabled: {
        type: 'boolean',
        default: false,
        description: 'Disable button interaction'
      }
    },
    codeTemplate: `<GlassButton
  variant="{variant}"
  size="{size}"
  disabled={disabled}
>
  {children}
</GlassButton>`,
    examples: [
      {
        name: 'Primary Action',
        props: { children: 'Get Started', variant: 'primary', size: 'lg' },
        description: 'Main call-to-action button'
      },
      {
        name: 'Secondary Action',
        props: { children: 'Learn More', variant: 'secondary', size: 'md' },
        description: 'Secondary action button'
      },
      {
        name: 'Danger Action',
        props: { children: 'Delete', variant: 'danger', size: 'sm' },
        description: 'Destructive action button'
      }
    ]
  },
  {
    id: 'glass-card',
    name: 'Glass Card',
    description: 'Flexible glassmorphic container with customizable blur and opacity',
    category: 'atoms',
    component: GlassCard,
    defaultProps: {
      children: 'Card content goes here',
      blur: 'md',
      opacity: 20,
      padding: 'md',
      rounded: 'lg'
    },
    propTypes: {
      children: {
        type: 'string',
        default: 'Card content goes here',
        description: 'Card content'
      },
      blur: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl'],
        default: 'md',
        description: 'Backdrop blur intensity'
      },
      opacity: {
        type: 'number',
        default: 20,
        description: 'Background opacity (0-100)'
      },
      padding: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl'],
        default: 'md',
        description: 'Internal padding'
      },
      rounded: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl', 'full'],
        default: 'lg',
        description: 'Border radius'
      }
    },
    codeTemplate: `<GlassCard
  blur="{blur}"
  opacity={opacity}
  padding="{padding}"
  rounded="{rounded}"
>
  {children}
</GlassCard>`,
    examples: [
      {
        name: 'Info Card',
        props: { children: 'Information card with medium blur', blur: 'md', opacity: 15 },
        description: 'Standard information display'
      },
      {
        name: 'Feature Card',
        props: { children: 'Feature highlight with strong blur', blur: 'xl', opacity: 30 },
        description: 'Prominent feature showcase'
      }
    ]
  },
  {
    id: 'glass-input',
    name: 'Glass Input',
    description: 'Glassmorphic input field with floating labels and validation states',
    category: 'atoms',
    component: GlassInput,
    defaultProps: {
      placeholder: 'Enter text...',
      label: 'Input Label',
      type: 'text',
      disabled: false,
      error: false
    },
    propTypes: {
      placeholder: {
        type: 'string',
        default: 'Enter text...',
        description: 'Placeholder text'
      },
      label: {
        type: 'string',
        default: 'Input Label',
        description: 'Input label'
      },
      type: {
        type: 'select',
        options: ['text', 'email', 'password', 'number'],
        default: 'text',
        description: 'Input type'
      },
      disabled: {
        type: 'boolean',
        default: false,
        description: 'Disable input'
      },
      error: {
        type: 'boolean',
        default: false,
        description: 'Error state'
      }
    },
    codeTemplate: `<GlassInput
  label="{label}"
  placeholder="{placeholder}"
  type="{type}"
  disabled={disabled}
  error={error}
/>`,
    examples: [
      {
        name: 'Email Input',
        props: { label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
        description: 'Email input field'
      },
      {
        name: 'Password Input',
        props: { label: 'Password', placeholder: 'Enter password', type: 'password' },
        description: 'Password input field'
      }
    ]
  }
];

interface ComponentShowcaseProps {
  className?: string;
}

export function ComponentShowcase({ className = '' }: ComponentShowcaseProps) {
  const { trackRender, startTiming, endTiming } = usePerformanceTracking('ComponentShowcase');
  const [selectedDemo, setSelectedDemo] = useState<ComponentDemo>(componentDemos[0]);
  const [currentProps, setCurrentProps] = useState<Record<string, any>>(componentDemos[0].defaultProps);
  const [showCode, setShowCode] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  useEffect(() => {
    startTiming('component-load');
    return () => {
      endTiming('component-load');
      trackRender();
    };
  }, []);
  
  useEffect(() => {
    setCurrentProps(selectedDemo.defaultProps);
  }, [selectedDemo]);
  
  const generatedCode = useMemo(() => {
    let code = selectedDemo.codeTemplate;
    Object.entries(currentProps).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      if (typeof value === 'string') {
        code = code.replace(placeholder, value);
      } else if (typeof value === 'boolean') {
        code = code.replace(placeholder, value.toString());
      } else {
        code = code.replace(placeholder, value.toString());
      }
    });
    return code;
  }, [selectedDemo, currentProps]);
  
  const handlePropChange = (propName: string, value: any) => {
    setCurrentProps(prev => ({ ...prev, [propName]: value }));
  };
  
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDemo.id}-example.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderPropControl = (propName: string, propConfig: ComponentDemo['propTypes'][string]) => {
    const value = currentProps[propName];
    
    switch (propConfig.type) {
      case 'string':
        return (
          <GlassInput
            label={propName}
            value={value}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            placeholder={propConfig.description}
          />
        );
      
      case 'number':
        return (
          <GlassInput
            label={propName}
            type="number"
            value={value}
            onChange={(e) => handlePropChange(propName, Number(e.target.value))}
            placeholder={propConfig.description}
          />
        );
      
      case 'boolean':
        return (
          <label className="flex items-center space-x-2 text-white/80">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handlePropChange(propName, e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
            />
            <span>{propName}</span>
          </label>
        );
      
      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              {propName}
            </label>
            <select
              value={value}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {propConfig.options?.map(option => (
                <option key={option} value={option} className="bg-gray-800">
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const DemoComponent = selectedDemo.component;
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Component Showcase
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Interactive playground for exploring and customizing glassmorphic components
          </p>
        </motion.div>
        
        {/* Component Selector */}
        <GlassCard className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {componentDemos.map((demo) => (
              <motion.button
                key={demo.id}
                onClick={() => setSelectedDemo(demo)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedDemo.id === demo.id
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-semibold text-white mb-1">{demo.name}</h3>
                <p className="text-white/60 text-sm mb-2">{demo.description}</p>
                <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                  {demo.category}
                </span>
              </motion.button>
            ))}
          </div>
        </GlassCard>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedDemo.name}</h2>
                <div className="flex items-center space-x-2">
                  <GlassButton
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </GlassButton>
                  <GlassButton size="sm" variant="ghost" onClick={copyCode}>
                    <Copy className="w-4 h-4" />
                  </GlassButton>
                  <GlassButton size="sm" variant="ghost" onClick={downloadCode}>
                    <Download className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>
              
              <GlassTabs
                tabs={[
                  { 
                    id: 'preview', 
                    label: 'Preview', 
                    icon: Eye,
                    content: (
                      <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/20 min-h-[200px] flex items-center justify-center">
                        <DemoComponent {...currentProps} />
                      </div>
                    )
                  },
                  { 
                    id: 'code', 
                    label: 'Code', 
                    icon: Code,
                    content: (
                      <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code className="text-green-400">{generatedCode}</code>
                      </pre>
                    )
                  },
                  { 
                    id: 'examples', 
                    label: 'Examples', 
                    icon: Play,
                    content: (
                      <div className="space-y-4">
                        {selectedDemo.examples.map((example, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">{example.name}</h4>
                              <GlassButton
                                size="sm"
                                variant="ghost"
                                onClick={() => setCurrentProps({ ...selectedDemo.defaultProps, ...example.props })}
                              >
                                Apply
                              </GlassButton>
                            </div>
                            <p className="text-white/60 text-sm mb-3">{example.description}</p>
                            <div className="flex items-center justify-center p-4 bg-white/5 rounded border border-white/10">
                              <DemoComponent {...selectedDemo.defaultProps} {...example.props} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }
                ]}
                defaultTab="preview"
              />
            </GlassCard>
          </div>
          
          {/* Controls Panel */}
          <div>
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Properties</h3>
                <Settings className="w-5 h-5 text-white/60" />
              </div>
              
              <div className="space-y-4">
                {Object.entries(selectedDemo.propTypes).map(([propName, propConfig]) => (
                  <div key={propName}>
                    {renderPropControl(propName, propConfig)}
                    <p className="text-xs text-white/50 mt-1">{propConfig.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="font-semibold text-white mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentProps(selectedDemo.defaultProps)}
                    className="w-full"
                  >
                    Reset to Default
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={copyCode}
                    className="w-full"
                  >
                    Copy Code
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentShowcase;
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2, RefreshCw, Download } from 'lucide-react';
import { ChatMessageComponent, ChatMessage } from '../molecules/ChatMessage';
import { ChatInput } from '../molecules/ChatInput';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { projects } from '../../data/projects';

interface AIChatProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const portfolioContext = {
  name: "Portfolio Developer",
  experience: "5+ years",
  specialties: ["React", "TypeScript", "Next.js", "Node.js", "Full-Stack Development"],
  projects: projects,
  skills: {
    frontend: ["React", "Vue.js", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Express", "Python", "Django", "MongoDB", "PostgreSQL"],
    tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code"]
  },
  achievements: [
    "Built 15+ production applications",
    "Achieved 95+ Lighthouse scores consistently",
    "Led development teams of 3-5 developers",
    "Contributed to open-source projects"
  ]
};

export const AIChat: React.FC<AIChatProps> = ({ isOpen = false, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hi! I'm your AI assistant for this portfolio. I can answer questions about the developer's experience, projects, skills, and background. What would you like to know?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses based on portfolio data
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      const featuredProjects = portfolioContext.projects.filter(p => p.featured);
      return `I've worked on ${portfolioContext.projects.length} projects, with ${featuredProjects.length} featured ones. Some highlights include:

• **${featuredProjects[0]?.title}**: ${featuredProjects[0]?.description}
• **${featuredProjects[1]?.title}**: ${featuredProjects[1]?.description}

Each project demonstrates different aspects of modern web development, from game logic to enterprise applications. Would you like to know more about any specific project?`;
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      return `I specialize in modern web development with expertise in:

**Frontend**: ${portfolioContext.skills.frontend.join(', ')}
**Backend**: ${portfolioContext.skills.backend.join(', ')}
**Tools**: ${portfolioContext.skills.tools.join(', ')}

I'm particularly passionate about React ecosystem and TypeScript for building scalable, maintainable applications. What specific technology would you like to discuss?`;
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return `I have ${portfolioContext.experience} of professional development experience, specializing in ${portfolioContext.specialties.join(', ')}.

Key achievements:
${portfolioContext.achievements.map(achievement => `• ${achievement}`).join('\n')}

I focus on creating high-performance, user-centric applications with clean, maintainable code. What aspect of my experience interests you most?`;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('work together')) {
      return `I'm always interested in discussing new opportunities! Here are the best ways to connect:

• **Email**: Available through the contact form
• **LinkedIn**: Professional networking and updates
• **GitHub**: Code samples and contributions

I'm particularly interested in projects involving React, TypeScript, and modern web technologies. What kind of project are you working on?`;
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('optimization')) {
      const avgPerformance = Math.round(
        portfolioContext.projects.reduce((acc, p) => acc + (p.metrics.performance || 0), 0) /
        portfolioContext.projects.filter(p => p.metrics.performance).length
      );
      return `Performance is a key focus in all my projects. I consistently achieve ${avgPerformance}%+ Lighthouse scores through:

• **Code Splitting**: Lazy loading and dynamic imports
• **Image Optimization**: WebP formats and responsive images
• **Bundle Analysis**: Tree shaking and minimal dependencies
• **Caching Strategies**: Service workers and CDN optimization

Every project is built with performance-first mindset. Would you like to see specific performance metrics?`;
    }
    
    if (lowerMessage.includes('react') || lowerMessage.includes('typescript')) {
      return `React and TypeScript are my primary tools for frontend development! I love this combination because:

• **Type Safety**: Catch errors at compile time
• **Developer Experience**: Excellent IDE support and refactoring
• **Scalability**: Perfect for large applications
• **Modern Patterns**: Hooks, context, and functional components

I've built ${portfolioContext.projects.filter(p => p.technologies.includes('React') || p.technologies.includes('TypeScript')).length} projects using React/TypeScript. Want to dive deeper into any specific aspect?`;
    }
    
    if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult') || lowerMessage.includes('problem')) {
      const complexProjects = portfolioContext.projects.filter(p => p.complexity === 'advanced');
      return `I thrive on challenging problems! One of my most complex projects was **${complexProjects[0]?.title}**:

**Challenge**: ${complexProjects[0]?.challenges[0]}
**Solution**: ${complexProjects[0]?.solutions[0]}
**Result**: ${complexProjects[0]?.results[0]}

I approach complex problems by breaking them down, researching best practices, and iterating on solutions. What kind of challenges are you facing?`;
    }
    
    // Default response
    return `That's a great question! I can help you learn more about:

• **Projects**: Detailed breakdowns of ${portfolioContext.projects.length} applications
• **Skills**: ${portfolioContext.specialties.join(', ')} and more
• **Experience**: ${portfolioContext.experience} of development work
• **Process**: How I approach development challenges

What specific aspect would you like to explore? Feel free to ask about any project, technology, or experience!`;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(content);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          role: 'assistant',
          timestamp: new Date()
        };
        return [...withoutTyping, aiMessage];
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'I apologize, but I encountered an error. Please try asking your question again.',
          role: 'assistant',
          timestamp: new Date()
        };
        return [...withoutTyping, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    // Copy functionality is handled in ChatMessage component
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    console.log(`Feedback for message ${messageId}: ${feedback}`);
    // Here you would typically send feedback to your analytics service
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: `Hi! I'm your AI assistant for this portfolio. I can answer questions about the developer's experience, projects, skills, and background. What would you like to know?`,
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  };

  const exportChat = () => {
    const chatText = messages
      .filter(msg => !msg.isTyping)
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white">
              Portfolio AI
            </Typography>
            <span className="text-xs text-green-400">● Online</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-white"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportChat}
            className="p-2 text-gray-400 hover:text-white"
            title="Export chat"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-gray-400 hover:text-white"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-white"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  onCopy={handleCopy}
                  onFeedback={handleFeedback}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about projects, skills, experience..."
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
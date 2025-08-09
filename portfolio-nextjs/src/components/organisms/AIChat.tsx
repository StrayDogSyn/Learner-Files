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
  name: "AI-Enhanced Full Stack Developer",
  specialization: "Justice Reform Technology",
  experience: "5+ years",
  specialties: ["Claude 4.1 Integration", "AI/ML", "React", "TypeScript", "Next.js", "Justice Reform Tech"],
  projects: projects,
  skills: {
    ai: ["Claude 4.1", "OpenAI GPT", "Machine Learning", "Natural Language Processing", "Bias Detection AI", "Legal Document Analysis"],
    frontend: ["React", "Vue.js", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Express", "Python", "Django", "MongoDB", "PostgreSQL", "AI APIs"],
    justice: ["Legal Tech", "Case Management Systems", "Bias Detection", "Reform Analytics", "Transparency Tools"],
    tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code", "Jupyter", "TensorFlow"]
  },
  achievements: [
    "Reduced judicial bias by 23% through AI-powered analysis tools",
    "Built 15+ production applications including 8 justice reform platforms",
    "Achieved 95+ Lighthouse scores consistently",
    "Led development teams of 3-5 developers on legal tech projects",
    "Contributed to open-source justice reform initiatives",
    "Integrated Claude 4.1 into 12+ legal applications",
    "Improved case resolution efficiency by 31% through AI automation"
  ],
  justiceReformFocus: {
    biasDetection: "AI models that identify and mitigate bias in legal proceedings",
    legalAccess: "Democratizing legal knowledge through AI-powered guidance",
    caseManagement: "Intelligent systems for evidence analysis and outcome prediction",
    transparency: "Public dashboards increasing accountability in justice system",
    reformAnalytics: "Data-driven insights for evidence-based policy making"
  }
};

export const AIChat: React.FC<AIChatProps> = ({ isOpen = false, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hi! I'm Claude 4.1, your AI assistant specializing in justice reform technology. I can discuss my creator's work in AI-enhanced legal solutions, bias detection systems, case management platforms, and how AI is transforming the justice system. Ask me about specific projects, Claude 4.1 integration, or justice reform impact! What would you like to explore?`,
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
      return `I've built ${portfolioContext.projects.length} projects, with ${featuredProjects.length} featured ones focusing on justice reform technology. Key highlights include:

• **JusticeAI Platform**: Claude 4.1-powered legal document analysis reducing bias by 23%
• **CaseFlow Manager**: AI-driven case management improving resolution efficiency by 31%
• **BiasGuard System**: Real-time bias detection in legal proceedings
• **LegalAccess Portal**: Democratizing legal knowledge through AI guidance

Each project leverages Claude 4.1 and advanced AI to address systemic issues in the justice system. Would you like to explore any specific justice reform application?`;
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      return `I specialize in AI-enhanced justice reform technology with expertise in:

**AI/ML**: ${portfolioContext.skills.ai.join(', ')}
**Justice Reform**: ${portfolioContext.skills.justice.join(', ')}
**Frontend**: ${portfolioContext.skills.frontend.join(', ')}
**Backend**: ${portfolioContext.skills.backend.join(', ')}
**Tools**: ${portfolioContext.skills.tools.join(', ')}

I'm particularly passionate about integrating Claude 4.1 into legal applications to reduce bias and improve access to justice. What specific AI or justice reform technology would you like to discuss?`;
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return `I have ${portfolioContext.experience} of professional development experience as an ${portfolioContext.name} specializing in ${portfolioContext.specialization}.

Key achievements in justice reform:
${portfolioContext.achievements.map(achievement => `• ${achievement}`).join('\n')}

I focus on leveraging Claude 4.1 and AI to create transformative solutions that address systemic issues in the justice system. What aspect of my justice reform work interests you most?`;
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
    
    if (lowerMessage.includes('claude') || lowerMessage.includes('4.1')) {
      return `Claude 4.1 is the cornerstone of my justice reform applications! Here's how I leverage it:

**Legal Document Analysis**: Claude 4.1 processes contracts, case files, and legal briefs with 94% accuracy
**Bias Detection**: Advanced language models identify discriminatory patterns in legal text
**Case Prediction**: AI analyzes historical data to predict case outcomes and recommend strategies
**Legal Research**: Automated research across vast legal databases in seconds
**Plain Language Translation**: Converting complex legal jargon into accessible language

I've integrated Claude 4.1 into 12+ legal applications, achieving measurable improvements in efficiency and fairness. Want to see a specific implementation?`;
    }
    
    if (lowerMessage.includes('sample') || lowerMessage.includes('question') || lowerMessage.includes('help')) {
      const sampleQuestions = [
        "How do you use Claude 4.1 in justice reform?",
        "Tell me about your bias detection systems",
        "What justice reform projects have you built?",
        "How does AI improve legal accessibility?"
      ];
      return `Here are some questions you can ask me:\n\n${sampleQuestions.map(q => `• ${q}`).join('\n')}\n\nFeel free to ask about any aspect of my justice reform work, AI integration, or specific projects!`;
    }
    
    if (lowerMessage.includes('bias') || lowerMessage.includes('discrimination') || lowerMessage.includes('fairness')) {
      return `Bias detection is one of my core specializations! My AI systems address bias through:

**Language Analysis**: Claude 4.1 identifies discriminatory language in legal documents
**Sentencing Patterns**: ML models detect disparities in sentencing across demographics
**Jury Selection**: AI ensures diverse, unbiased jury composition
**Hiring Practices**: Bias detection in legal profession recruitment
**Case Assignment**: Fair distribution of cases across judges and attorneys

**Real Impact**: My bias detection systems have reduced discriminatory outcomes by 23% in pilot programs. The technology is now being adopted by courts in 8 states. How can AI help address bias in your context?`;
    }
    
    if (lowerMessage.includes('justice') || lowerMessage.includes('reform') || lowerMessage.includes('legal')) {
      return `Justice reform through technology is my passion! Here are my key focus areas:

**${Object.entries(portfolioContext.justiceReformFocus).map(([key, value]) => `• **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}`).join('\n')}

**Current Projects**:
• JusticeAI Platform: Serving 15,000+ legal professionals
• BiasGuard System: Deployed in 8 state court systems
• LegalAccess Portal: Providing free legal guidance to 50,000+ users

**Measurable Impact**: 31% improvement in case resolution efficiency, 23% reduction in bias, 67% increase in legal access for underserved communities. What aspect of justice reform interests you most?`;
    }
    
    if (lowerMessage.includes('challenge') || lowerMessage.includes('difficult') || lowerMessage.includes('problem')) {
      return `I thrive on challenging justice reform problems! Here's a complex case study:

**Challenge**: Reducing racial bias in sentencing decisions across a state court system
**Solution**: Built BiasGuard - a Claude 4.1-powered system that analyzes sentencing patterns and provides real-time bias alerts
**Implementation**: Integrated with existing case management systems, trained on 100,000+ historical cases
**Result**: 23% reduction in sentencing disparities, 89% judge adoption rate, now expanding to 8 states

**Technical Complexity**: Real-time NLP processing, sensitive data handling, judicial workflow integration, and measurable bias metrics. What justice reform challenges are you working on?`;
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
    } catch {
      // Error generating AI response
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

  const handleFeedback = () => {
    // Feedback recorded for message
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
              placeholder="Ask about justice reform, AI integration, bias detection..."
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
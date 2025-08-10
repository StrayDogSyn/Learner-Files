// Chatbot Widget for Visitor Engagement and Support

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import analytics from '../utils/analytics';

// Message Types
interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

// Chatbot Configuration
interface ChatbotConfig {
  apiEndpoint?: string;
  apiKey?: string;
  welcomeMessage: string;
  placeholderText: string;
  theme: 'light' | 'dark' | 'auto';
  position: 'bottom-right' | 'bottom-left';
  enableTypingIndicator: boolean;
  enableSuggestions: boolean;
  maxMessages: number;
}

// Predefined Responses
const predefinedResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm SOLO's AI assistant. How can I help you today?",
    "Hi there! Welcome to my portfolio. What would you like to know?",
    "Hey! I'm here to help you learn more about SOLO's work. What interests you?"
  ],
  services: [
    "I offer full-stack web development, UI/UX design, and consulting services. Would you like to know more about any specific service?",
    "My services include React/Node.js development, responsive design, and digital strategy. What project do you have in mind?"
  ],
  projects: [
    "I've worked on various projects including e-commerce platforms, SaaS applications, and mobile apps. Check out my portfolio section for detailed case studies!",
    "My recent projects showcase modern web technologies and innovative solutions. Which type of project interests you most?"
  ],
  contact: [
    "You can reach me through the contact form, email me directly, or schedule a call. What works best for you?",
    "I'd love to discuss your project! Feel free to use the contact form or send me a message directly."
  ],
  pricing: [
    "Project pricing depends on scope and complexity. I offer both fixed-price and hourly arrangements. Would you like to discuss your specific needs?",
    "I provide competitive rates based on project requirements. Let's schedule a call to discuss your budget and timeline."
  ],
  timeline: [
    "Project timelines vary based on complexity. Typical projects range from 2-12 weeks. What's your target launch date?",
    "I can usually start new projects within 1-2 weeks. Timeline depends on your specific requirements."
  ],
  technologies: [
    "I specialize in React, Node.js, TypeScript, and modern web technologies. I also work with various databases and cloud platforms.",
    "My tech stack includes React, Vue, Node.js, Python, PostgreSQL, MongoDB, and AWS. What technology are you interested in?"
  ],
  availability: [
    "I'm currently accepting new projects! My availability depends on project scope and timeline. Let's discuss your needs.",
    "I have availability for new projects starting next month. Would you like to schedule a consultation?"
  ]
};

// Intent Detection (Simple keyword-based)
const detectIntent = (message: string): { intent: string; confidence: number } => {
  const lowerMessage = message.toLowerCase();
  
  const intentKeywords: Record<string, string[]> = {
    greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    services: ['service', 'what do you do', 'what can you do', 'offerings', 'capabilities'],
    projects: ['project', 'portfolio', 'work', 'examples', 'case study', 'showcase'],
    contact: ['contact', 'reach', 'email', 'phone', 'call', 'meeting', 'schedule'],
    pricing: ['price', 'cost', 'rate', 'budget', 'how much', 'pricing', 'quote'],
    timeline: ['timeline', 'how long', 'duration', 'when', 'deadline', 'delivery'],
    technologies: ['tech', 'technology', 'stack', 'framework', 'language', 'tools'],
    availability: ['available', 'availability', 'free', 'start', 'when can you']
  };
  
  let bestMatch = { intent: 'general', confidence: 0 };
  
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const confidence = matches / keywords.length;
    
    if (confidence > bestMatch.confidence) {
      bestMatch = { intent, confidence };
    }
  }
  
  return bestMatch;
};

// Generate Response
const generateResponse = (intent: string, userMessage: string): string => {
  const responses = predefinedResponses[intent] || [
    "That's an interesting question! I'd be happy to discuss this further. Feel free to reach out through the contact form for a detailed conversation.",
    "Thanks for your question! For specific inquiries like this, I recommend getting in touch directly so I can provide you with the most accurate information."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Suggestion Generator
const generateSuggestions = (intent: string): string[] => {
  const suggestions: Record<string, string[]> = {
    greeting: ['Tell me about your services', 'Show me your projects', 'How can I contact you?'],
    services: ['What technologies do you use?', 'Can you show me examples?', 'What are your rates?'],
    projects: ['What services do you offer?', 'How long do projects take?', 'Can we schedule a call?'],
    contact: ['What are your rates?', 'When are you available?', 'Tell me about your process'],
    general: ['View my portfolio', 'Learn about my services', 'Get in touch']
  };
  
  return suggestions[intent] || suggestions.general;
};

const ChatbotWidget: React.FC<{ config?: Partial<ChatbotConfig> }> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const defaultConfig: ChatbotConfig = {
    welcomeMessage: "Hi! I'm SOLO's AI assistant. I can help you learn about my services, projects, and how we can work together. What would you like to know?",
    placeholderText: "Type your message...",
    theme: 'auto',
    position: 'bottom-right',
    enableTypingIndicator: true,
    enableSuggestions: true,
    maxMessages: 50
  };
  
  const chatConfig = { ...defaultConfig, ...config };

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: chatConfig.welcomeMessage,
        timestamp: new Date(),
        metadata: {
          intent: 'greeting',
          confidence: 1,
          suggestions: ['Tell me about your services', 'Show me your projects', 'How can I contact you?']
        }
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Handle new bot messages for unread count
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Track user message
    analytics.trackEvent('chatbot_message_sent', {
      message_length: content.length,
      session_message_count: messages.length + 1
    });

    // Show typing indicator
    if (chatConfig.enableTypingIndicator) {
      setIsTyping(true);
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Detect intent and generate response
    const { intent, confidence } = detectIntent(content);
    const response = generateResponse(intent, content);
    const suggestions = chatConfig.enableSuggestions ? generateSuggestions(intent) : [];

    const botMessage: ChatMessage = {
      id: `bot_${Date.now()}`,
      type: 'bot',
      content: response,
      timestamp: new Date(),
      metadata: {
        intent,
        confidence,
        suggestions
      }
    };

    setIsTyping(false);
    setMessages(prev => {
      const newMessages = [...prev, botMessage];
      // Limit message history
      if (newMessages.length > chatConfig.maxMessages) {
        return newMessages.slice(-chatConfig.maxMessages);
      }
      return newMessages;
    });

    // Track bot response
    analytics.trackEvent('chatbot_response_generated', {
      intent,
      confidence,
      response_length: response.length
    });
  }, [messages, chatConfig]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    analytics.trackEvent('chatbot_suggestion_clicked', {
      suggestion_text: suggestion
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      analytics.trackEvent('chatbot_opened', {
        message_count: messages.length
      });
    } else {
      analytics.trackEvent('chatbot_closed', {
        session_duration: Date.now() - (messages[0]?.timestamp.getTime() || Date.now()),
        message_count: messages.length
      });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    analytics.trackEvent('chatbot_minimized', {
      minimized: !isMinimized
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[chatConfig.position]} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div className={`mb-4 w-80 h-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
          isMinimized ? 'h-12' : 'h-96'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">SOLO Assistant</h3>
                <p className="text-xs text-white/60">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white/60" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white/60" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-64">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 border border-white/20 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Suggestions */}
                {chatConfig.enableSuggestions && messages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1]?.metadata?.suggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white/80 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={chatConfig.placeholderText}
                    className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        
        {/* Unread Badge */}
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20"></div>
      </button>
    </div>
  );
};

export default ChatbotWidget;
export type { ChatMessage, ChatbotConfig };
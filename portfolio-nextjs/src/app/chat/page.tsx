'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AIChat } from '../../components/organisms/AIChat';
import { Typography } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { MessageCircle, Sparkles, Zap, Brain } from 'lucide-react';

export default function ChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Context Aware",
      description: "Understands my projects, skills, and experience in detail"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Responses",
      description: "Get immediate answers about my background and capabilities"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "Helpful prompts to guide your conversation"
    }
  ];

  const sampleQuestions = [
    "What's your most challenging project?",
    "How do you approach problem-solving?",
    "Tell me about your React experience",
    "What makes you different from other developers?",
    "Can you walk me through your development process?",
    "What technologies are you most excited about?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <Typography variant="h1" className="text-white">
              AI Portfolio Assistant
            </Typography>
          </div>
          <Typography variant="body" className="text-gray-300 max-w-2xl mx-auto">
            Chat with my AI assistant to learn about my experience, projects, and skills. 
            Get instant, detailed answers about my development background and capabilities.
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Features */}
            <div>
              <Typography variant="h2" className="text-white mb-6">
                AI Assistant Features
              </Typography>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-blue-400 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <Typography variant="h4" className="text-white mb-2">
                          {feature.title}
                        </Typography>
                        <Typography variant="body" className="text-gray-300">
                          {feature.description}
                        </Typography>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div>
              <Typography variant="h3" className="text-white mb-4">
                Try Asking About:
              </Typography>
              <div className="grid grid-cols-1 gap-3">
                {sampleQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    onClick={() => {
                      // This would send the question to the chat
                      setIsChatOpen(true);
                    }}
                    className="text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-200 group"
                  >
                    <span className="text-blue-400 group-hover:text-blue-300 transition-colors">&ldquo;</span>
                    {question}
                    <span className="text-blue-400 group-hover:text-blue-300 transition-colors">&rdquo;</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Button
                variant="primary"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {isChatOpen ? 'Hide Chat' : 'Open Chat'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <Typography variant="h3" className="text-white mb-4">
                Start a Conversation
              </Typography>
              <Typography variant="body" className="text-gray-300 mb-6">
                The AI assistant is ready to answer your questions about my development experience, 
                project details, technical skills, and career background.
              </Typography>
              
              {!isChatOpen && (
                <Button
                  variant="accent"
                  onClick={() => setIsChatOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Launch Chat
                </Button>
              )}
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/30 rounded-full blur-sm"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/30 rounded-full blur-sm"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
            <div className="text-gray-300">Projects Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
            <div className="text-gray-300">AI Availability</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">Instant</div>
            <div className="text-gray-300">Response Time</div>
          </div>
        </motion.div>
      </div>

      {/* AI Chat Component */}
      <AIChat 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
}
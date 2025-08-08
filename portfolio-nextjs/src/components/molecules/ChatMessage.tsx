'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: ChatMessage;
  onCopy?: (content: string) => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  onFeedback
}) => {
  const isUser = message.role === 'user';
  const isTyping = message.isTyping;

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
      navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 mb-6 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-green-500 to-teal-600'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${
        isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'
      }`}>
        {/* Message Bubble */}
        <motion.div
          className={`relative px-4 py-3 rounded-2xl backdrop-blur-md border ${
            isUser
              ? 'bg-blue-500/20 border-blue-400/30 text-white'
              : 'bg-white/10 border-white/20 text-gray-100'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Typing Animation */}
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
            </div>
          ) : (
            <Typography variant="body" className="whitespace-pre-wrap">
              {message.content}
            </Typography>
          )}

          {/* Message Tail */}
          <div className={`absolute top-3 w-3 h-3 transform rotate-45 ${
            isUser
              ? '-right-1 bg-blue-500/20 border-r border-b border-blue-400/30'
              : '-left-1 bg-white/10 border-l border-b border-white/20'
          }`} />
        </motion.div>

        {/* Message Actions */}
        {!isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center gap-2 mt-2 ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Timestamp */}
            <span className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>

            {/* Action Buttons */}
            {!isUser && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="p-1 h-6 w-6 text-gray-400 hover:text-white transition-colors"
                  title="Copy message"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                
                {onFeedback && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFeedback(message.id, 'positive')}
                      className="p-1 h-6 w-6 text-gray-400 hover:text-green-400 transition-colors"
                      title="Good response"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFeedback(message.id, 'negative')}
                      className="p-1 h-6 w-6 text-gray-400 hover:text-red-400 transition-colors"
                      title="Poor response"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
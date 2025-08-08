'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Mic, MicOff, Zap } from 'lucide-react';
import { Button } from '../atoms/Button';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const suggestedPrompts = [
  "Tell me about your experience with React and TypeScript",
  "What's your most challenging project?",
  "How do you approach problem-solving?",
  "What technologies are you most excited about?",
  "Can you walk me through your development process?",
  "What makes you different from other developers?"
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Ask me anything about my experience, projects, or skills..."
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'voice-message.wav', { type: 'audio/wav' });
        setAttachments(prev => [...prev, file]);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      // Error starting recording
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      {/* Suggested Prompts */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-4"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Suggested Questions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-200"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl"
        >
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              >
                <Paperclip className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 truncate max-w-32">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Input Area */}
      <motion.div
        className={`relative bg-white/10 backdrop-blur-md border-2 rounded-2xl transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-400/50 bg-blue-500/10' 
            : 'border-white/20 hover:border-white/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag Overlay */}
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center z-10"
          >
            <div className="text-center">
              <Paperclip className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <span className="text-blue-300 font-medium">Drop files here</span>
            </div>
          </motion.div>
        )}

        <div className="flex items-end gap-3 p-4">
          {/* Suggestion Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`p-2 transition-colors ${
              showSuggestions ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
            }`}
            title="Show suggested questions"
          >
            <Zap className="w-5 h-5" />
          </Button>

          {/* File Upload */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Voice Recording */}
          <Button
            variant="ghost"
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 transition-colors ${
              isRecording 
                ? 'text-red-400 animate-pulse' 
                : 'text-gray-400 hover:text-white'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(false)}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none min-h-[24px] max-h-32 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              rows={1}
            />
          </div>

          {/* Send Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
            className={`p-2 transition-all duration-300 ${
              message.trim() || attachments.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 scale-100'
                : 'bg-gray-600 scale-95'
            }`}
            title="Send message"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          aria-label="Upload files for chat"
        />
      </motion.div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 flex items-center justify-center"
        >
          <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-full px-4 py-2 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-400 rounded-full"
            />
            <span className="text-red-300 text-sm font-medium">Recording...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
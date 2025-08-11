import { BaseAPIClient } from './BaseAPIClient';
import {
  ClaudeConfig,
  ClaudeRequest,
  ClaudeResponse,
  ClaudeMessage,
  ClaudeModel,
  ClaudeStreamResponse,
  ClaudeUsage,
  ClaudeError,
  APIResponse
} from './types';

/**
 * Claude AI Service
 * Provides integration with Anthropic's Claude API
 * Features:
 * - Multiple model support (Claude 3.5 Sonnet, Claude 3 Haiku, etc.)
 * - Streaming responses
 * - Token usage tracking
 * - Conversation management
 * - Safety and content filtering
 * - Custom system prompts
 */
export class ClaudeService extends BaseAPIClient {
  private claudeConfig: ClaudeConfig;
  private conversations: Map<string, ClaudeMessage[]>;
  private usageTracking: Map<string, ClaudeUsage>;

  constructor(config: ClaudeConfig) {
    super({
      baseURL: 'https://api.anthropic.com',
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': config.version || '2023-06-01',
        'Content-Type': 'application/json'
      },
      timeout: config.timeout || 60000,
      retries: config.retries || 3,
      rateLimit: {
        requests: config.rateLimit?.requests || 50,
        window: config.rateLimit?.window || 60000
      }
    });

    this.claudeConfig = {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4096,
      temperature: 0.7,
      topP: 1,
      topK: -1,
      stop_sequences: [],
      stream: false,
      safetySettings: {
        harmBlockThreshold: 'BLOCK_MEDIUM_AND_ABOVE',
        enableContentFiltering: true
      },
      ...config
    };

    this.conversations = new Map();
    this.usageTracking = new Map();

    // Add Claude-specific request interceptor
    this.addRequestInterceptor({
      onRequest: async (request) => {
        // Add anthropic-specific headers
        if (request.url.includes('/messages')) {
          request.headers = {
            ...request.headers,
            'anthropic-beta': 'messages-2023-12-15'
          };
        }
        return request;
      },
      onRequestError: async (error) => {
        console.error('Claude request error:', error);
        return error;
      }
    });

    // Add Claude-specific response interceptor
    this.addResponseInterceptor({
      onResponse: async (response) => {
        // Track usage if present
        if (response.data && typeof response.data === 'object' && 'usage' in response.data) {
          this.trackUsage(response.data.usage as ClaudeUsage);
        }
        return response;
      },
      onResponseError: async (error) => {
        return this.handleClaudeError(error);
      }
    });
  }

  /**
   * Send a message to Claude
   */
  async sendMessage(
    messages: ClaudeMessage[],
    options?: Partial<ClaudeRequest>
  ): Promise<ClaudeResponse> {
    const request: ClaudeRequest = {
      model: options?.model || this.claudeConfig.model,
      messages: this.formatMessages(messages),
      max_tokens: options?.max_tokens || this.claudeConfig.maxTokens,
      temperature: options?.temperature ?? this.claudeConfig.temperature,
      top_p: options?.top_p ?? this.claudeConfig.topP,
      top_k: options?.top_k ?? this.claudeConfig.topK,
      stop_sequences: options?.stop_sequences || this.claudeConfig.stop_sequences,
      stream: options?.stream ?? this.claudeConfig.stream,
      system: options?.systemPrompt || this.claudeConfig.systemPrompt,
      metadata: {
        user_id: options?.userId,
        conversation_id: options?.conversationId
      }
    };

    // Apply safety settings
    if (this.claudeConfig.safetySettings?.enableContentFiltering) {
      request.messages = await this.applyContentFiltering(request.messages);
    }

    try {
      const response = await this.post<ClaudeResponse>('/v1/messages', request);
      
      // Store conversation if conversation ID provided
      if (options?.conversationId) {
        this.updateConversation(options.conversationId, messages, response.data.content);
      }

      return response.data;
    } catch (error) {
      throw this.handleClaudeError(error);
    }
  }

  /**
   * Send a streaming message to Claude
   */
  async sendStreamingMessage(
    messages: ClaudeMessage[],
    onChunk: (chunk: ClaudeStreamResponse) => void,
    options?: Partial<ClaudeRequest>
  ): Promise<ClaudeResponse> {
    const request: ClaudeRequest = {
      model: options?.model || this.claudeConfig.model,
      messages: this.formatMessages(messages),
      max_tokens: options?.max_tokens || this.claudeConfig.maxTokens,
      temperature: options?.temperature ?? this.claudeConfig.temperature,
      top_p: options?.top_p ?? this.claudeConfig.topP,
      top_k: options?.top_k ?? this.claudeConfig.topK,
      stop_sequences: options?.stop_sequences || this.claudeConfig.stop_sequences,
      stream: true,
      system: options?.systemPrompt || this.claudeConfig.systemPrompt,
      metadata: {
        user_id: options?.userId,
        conversation_id: options?.conversationId
      }
    };

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${this.config.baseURL}/v1/messages`, {
          method: 'POST',
          headers: {
            ...this.config.headers,
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body reader available');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullResponse: ClaudeResponse | null = null;

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  if (fullResponse) {
                    resolve(fullResponse);
                  } else {
                    reject(new Error('Stream ended without complete response'));
                  }
                  return;
                }

                try {
                  const chunk: ClaudeStreamResponse = JSON.parse(data);
                  onChunk(chunk);

                  // Build full response from chunks
                  if (chunk.type === 'message_start') {
                    fullResponse = {
                      id: chunk.message.id,
                      type: 'message',
                      role: 'assistant',
                      content: [],
                      model: chunk.message.model,
                      stop_reason: null,
                      stop_sequence: null,
                      usage: chunk.message.usage
                    };
                  } else if (chunk.type === 'content_block_delta' && fullResponse) {
                    if (chunk.delta.type === 'text_delta') {
                      // Add or update text content
                      const lastContent = fullResponse.content[fullResponse.content.length - 1];
                      if (lastContent && lastContent.type === 'text') {
                        lastContent.text += chunk.delta.text;
                      } else {
                        fullResponse.content.push({
                          type: 'text',
                          text: chunk.delta.text
                        });
                      }
                    }
                  } else if (chunk.type === 'message_delta' && fullResponse) {
                    fullResponse.stop_reason = chunk.delta.stop_reason;
                    fullResponse.stop_sequence = chunk.delta.stop_sequence;
                  }
                } catch (parseError) {
                  console.warn('Failed to parse streaming chunk:', parseError);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        if (fullResponse) {
          resolve(fullResponse);
        } else {
          reject(new Error('Stream ended without complete response'));
        }
      } catch (error) {
        reject(this.handleClaudeError(error));
      }
    });
  }

  /**
   * Get conversation history
   */
  getConversation(conversationId: string): ClaudeMessage[] {
    return this.conversations.get(conversationId) || [];
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  /**
   * Get all conversations
   */
  getAllConversations(): Map<string, ClaudeMessage[]> {
    return new Map(this.conversations);
  }

  /**
   * Get usage statistics
   */
  getUsageStats(timeframe?: 'hour' | 'day' | 'week' | 'month'): ClaudeUsage {
    const now = Date.now();
    let cutoff = 0;

    switch (timeframe) {
      case 'hour':
        cutoff = now - 60 * 60 * 1000;
        break;
      case 'day':
        cutoff = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        cutoff = now - 30 * 24 * 60 * 60 * 1000;
        break;
    }

    const totalUsage: ClaudeUsage = {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0
    };

    for (const [timestamp, usage] of this.usageTracking.entries()) {
      const time = parseInt(timestamp);
      if (time >= cutoff) {
        totalUsage.input_tokens += usage.input_tokens;
        totalUsage.output_tokens += usage.output_tokens;
        totalUsage.total_tokens += usage.total_tokens;
      }
    }

    return totalUsage;
  }

  /**
   * Estimate token count for text
   */
  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    // This is an approximation; for exact counts, you'd need Claude's tokenizer
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if model supports feature
   */
  supportsFeature(model: ClaudeModel, feature: 'vision' | 'function_calling' | 'streaming'): boolean {
    const modelCapabilities = {
      'claude-3-5-sonnet-20241022': ['vision', 'function_calling', 'streaming'],
      'claude-3-5-haiku-20241022': ['streaming'],
      'claude-3-opus-20240229': ['vision', 'streaming']
    };

    return modelCapabilities[model]?.includes(feature) || false;
  }

  /**
   * Get available models
   */
  getAvailableModels(): ClaudeModel[] {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229'
    ];
  }

  /**
   * Private helper methods
   */
  private formatMessages(messages: ClaudeMessage[]): ClaudeMessage[] {
    return messages.map(message => ({
      role: message.role,
      content: typeof message.content === 'string' 
        ? [{ type: 'text', text: message.content }]
        : message.content
    }));
  }

  private updateConversation(
    conversationId: string,
    userMessages: ClaudeMessage[],
    assistantContent: any[]
  ): void {
    const conversation = this.conversations.get(conversationId) || [];
    
    // Add user messages
    conversation.push(...userMessages);
    
    // Add assistant response
    conversation.push({
      role: 'assistant',
      content: assistantContent
    });

    this.conversations.set(conversationId, conversation);
  }

  private trackUsage(usage: ClaudeUsage): void {
    const timestamp = Date.now().toString();
    this.usageTracking.set(timestamp, usage);

    // Clean up old usage data (keep last 30 days)
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    for (const [ts] of this.usageTracking.entries()) {
      if (parseInt(ts) < cutoff) {
        this.usageTracking.delete(ts);
      }
    }
  }

  private async applyContentFiltering(messages: ClaudeMessage[]): Promise<ClaudeMessage[]> {
    // Basic content filtering - in production, you'd want more sophisticated filtering
    const filteredMessages = messages.map(message => {
      if (typeof message.content === 'string') {
        // Remove potentially harmful content patterns
        const filtered = message.content
          .replace(/\b(hack|exploit|vulnerability)\b/gi, '[FILTERED]')
          .replace(/\b(password|secret|token)\s*[:=]\s*\S+/gi, '[FILTERED]');
        
        return { ...message, content: filtered };
      }
      return message;
    });

    return filteredMessages;
  }

  private handleClaudeError(error: any): ClaudeError {
    if (error.status === 400) {
      return {
        message: 'Invalid request parameters',
        status: 400,
        code: 'INVALID_REQUEST',
        type: 'invalid_request_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false
      };
    }

    if (error.status === 401) {
      return {
        message: 'Invalid API key',
        status: 401,
        code: 'AUTHENTICATION_ERROR',
        type: 'authentication_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false
      };
    }

    if (error.status === 429) {
      return {
        message: 'Rate limit exceeded',
        status: 429,
        code: 'RATE_LIMIT_ERROR',
        type: 'rate_limit_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: true
      };
    }

    if (error.status === 500) {
      return {
        message: 'Internal server error',
        status: 500,
        code: 'API_ERROR',
        type: 'api_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: true
      };
    }

    return {
      message: error.message || 'Unknown Claude API error',
      status: error.status,
      code: error.code || 'UNKNOWN_ERROR',
      type: 'api_error',
      details: error.details,
      timestamp: Date.now(),
      retryCount: error.retryCount || 0,
      isRetryable: error.isRetryable || false
    };
  }

  /**
   * Utility methods for common use cases
   */
  async askQuestion(
    question: string,
    context?: string,
    options?: Partial<ClaudeRequest>
  ): Promise<string> {
    const messages: ClaudeMessage[] = [];
    
    if (context) {
      messages.push({
        role: 'user',
        content: `Context: ${context}\n\nQuestion: ${question}`
      });
    } else {
      messages.push({
        role: 'user',
        content: question
      });
    }

    const response = await this.sendMessage(messages, options);
    
    // Extract text from response
    const textContent = response.content.find(c => c.type === 'text');
    return textContent?.text || '';
  }

  async summarizeText(
    text: string,
    maxLength?: number,
    options?: Partial<ClaudeRequest>
  ): Promise<string> {
    const prompt = `Please summarize the following text${maxLength ? ` in approximately ${maxLength} words` : ''}:\n\n${text}`;
    
    return this.askQuestion(prompt, undefined, {
      ...options,
      temperature: 0.3 // Lower temperature for more consistent summaries
    });
  }

  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string,
    options?: Partial<ClaudeRequest>
  ): Promise<string> {
    const prompt = `Translate the following text ${sourceLanguage ? `from ${sourceLanguage} ` : ''}to ${targetLanguage}:\n\n${text}`;
    
    return this.askQuestion(prompt, undefined, {
      ...options,
      temperature: 0.1 // Very low temperature for accurate translations
    });
  }

  async analyzeCode(
    code: string,
    language: string,
    analysisType: 'review' | 'explain' | 'optimize' | 'debug' = 'review',
    options?: Partial<ClaudeRequest>
  ): Promise<string> {
    const prompts = {
      review: `Please review this ${language} code and provide feedback on code quality, best practices, and potential improvements:`,
      explain: `Please explain what this ${language} code does, breaking it down step by step:`,
      optimize: `Please suggest optimizations for this ${language} code:`,
      debug: `Please help debug this ${language} code and identify potential issues:`
    };

    const prompt = `${prompts[analysisType]}\n\n\`\`\`${language}\n${code}\n\`\`\``;
    
    return this.askQuestion(prompt, undefined, options);
  }
}
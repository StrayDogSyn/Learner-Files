import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// AI Service Configuration
interface AIConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  model: 'gpt-4' | 'claude-3-sonnet';
}

class AIService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    
    if (config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey,
        dangerouslyAllowBrowser: true
      });
    }
    
    if (config.anthropicApiKey) {
      this.anthropic = new Anthropic({
        apiKey: config.anthropicApiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async enhanceProjectDescription(projectName: string, currentDescription: string): Promise<string> {
    const prompt = `Enhance this project description for a portfolio:

Project: ${projectName}
Current Description: ${currentDescription}

Make it more engaging, professional, and highlight the technical skills demonstrated. Keep it concise but impactful.`;

    try {
      if (this.config.model === 'gpt-4' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.7
        });
        return response.choices[0]?.message?.content || currentDescription;
      } else if (this.config.model === 'claude-3-sonnet' && this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }]
        });
        return response.content[0]?.type === 'text' ? response.content[0].text : currentDescription;
      }
    } catch (error) {
      console.error('AI Enhancement Error:', error);
    }
    
    return currentDescription;
  }

  async analyzeCode(code: string, language: string): Promise<string> {
    const prompt = `Analyze this ${language} code and provide insights:

\`\`\`${language}
${code}
\`\`\`

Provide a brief analysis covering:
1. Code quality and best practices
2. Potential improvements
3. Technical highlights

Keep it concise and constructive.`;

    try {
      if (this.config.model === 'gpt-4' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.3
        });
        return response.choices[0]?.message?.content || 'Analysis unavailable';
      } else if (this.config.model === 'claude-3-sonnet' && this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }]
        });
        return response.content[0]?.type === 'text' ? response.content[0].text : 'Analysis unavailable';
      }
    } catch (error) {
      console.error('Code Analysis Error:', error);
    }
    
    return 'Analysis unavailable';
  }

  async chatWithAI(message: string, context?: string): Promise<string> {
    const systemPrompt = context 
      ? `You are an AI assistant helping with a portfolio website. Context: ${context}`
      : 'You are an AI assistant helping with a portfolio website. Be helpful, concise, and professional.';

    try {
      if (this.config.model === 'gpt-4' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 250,
          temperature: 0.7
        });
        return response.choices[0]?.message?.content || 'Sorry, I could not process your request.';
      } else if (this.config.model === 'claude-3-sonnet' && this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 250,
          system: systemPrompt,
          messages: [{ role: 'user', content: message }]
        });
        return response.content[0]?.type === 'text' ? response.content[0].text : 'Sorry, I could not process your request.';
      }
    } catch (error) {
      console.error('Chat Error:', error);
    }
    
    return 'Sorry, I could not process your request.';
  }

  isConfigured(): boolean {
    return !!(this.openai || this.anthropic);
  }
}

// Create singleton instance
const aiService = new AIService({
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  model: 'gpt-4' // Default to GPT-4, can be changed based on available keys
});

export default aiService;
export { AIService, type AIConfig };
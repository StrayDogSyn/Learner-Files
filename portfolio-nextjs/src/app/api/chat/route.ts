import { NextRequest, NextResponse } from 'next/server'
import { portfolioData } from '@/data/projects'
import { caseStudies } from '@/data/case-studies'

// Rate limiting configuration
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW
    rateLimitMap.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime }
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetTime: record.resetTime }
}

// Portfolio context for AI responses
const PORTFOLIO_CONTEXT = `
You are an AI assistant representing StrayDog Syndications, an AI-Enhanced Full Stack Developer specializing in Justice Reform Technology.

KEY INFORMATION:
- Name: StrayDog Syndications
- Specialization: AI-Enhanced Full Stack Development with focus on Justice Reform Technology
- Mission: Leveraging AI to transform justice systems and create equitable solutions
- Core Technologies: Next.js, React, TypeScript, Node.js, Python, AI/ML, Claude 4.1
- Expertise Areas: Justice Reform, AI Integration, Full Stack Development, Performance Optimization

JUSTICE REFORM FOCUS:
- Criminal justice system modernization
- Legal process automation
- Bias detection and mitigation in legal AI
- Transparency tools for law enforcement
- Rehabilitation and reentry support systems
- Court system efficiency improvements

PROJECTS OVERVIEW:
${portfolioData.map(project => `- ${project.title}: ${project.description}`).join('\n')}

CASE STUDIES:
${caseStudies.map(study => `- ${study.title}: ${study.description}`).join('\n')}

RESPONSE GUIDELINES:
1. Be professional, knowledgeable, and passionate about justice reform
2. Highlight AI integration capabilities and 10x developer productivity
3. Reference specific projects and technologies when relevant
4. Emphasize the social impact and ethical considerations
5. Keep responses concise but informative
6. Always maintain focus on justice reform applications
`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

interface ChatRequest {
  message: string
  conversation?: ChatMessage[]
  context?: string
}

// Claude API integration
async function callClaudeAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY
  const apiUrl = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages'
  const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022'
  const maxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS || '4096')

  if (!apiKey) {
    throw new Error('Claude API key not configured')
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: PORTFOLIO_CONTEXT + '\n\nConversation:\n' + 
                    messages.map(m => `${m.role}: ${m.content}`).join('\n')
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.content[0]?.text || 'I apologize, but I encountered an issue generating a response.'
  } catch (error) {
    console.error('Claude API Error:', error)
    throw error
  }
}

// Fallback AI responses when Claude API is not available
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
    return `I specialize in AI-enhanced full stack development with a focus on justice reform technology. Some of my key projects include:

• **Justice Analytics Platform** - AI-powered system for analyzing legal case patterns and outcomes
• **Bias Detection System** - ML algorithms to identify and mitigate bias in legal processes
• **Court Efficiency Optimizer** - Automated scheduling and case management system
• **Rehabilitation Tracker** - AI-driven platform for monitoring and supporting reentry programs

Each project leverages cutting-edge AI to create more equitable and efficient justice systems.`
  }
  
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
    return `My technology stack is designed for high-performance, AI-enhanced applications:

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
**Backend:** Node.js, Python, Express, FastAPI
**AI/ML:** Claude 4.1, OpenAI GPT-4, TensorFlow, PyTorch
**Database:** PostgreSQL, MongoDB, Vector databases
**Cloud:** AWS, Vercel, Docker, Kubernetes
**Justice Tech:** Legal APIs, Court data systems, Compliance frameworks

I integrate AI at every layer to achieve 10x developer productivity and create intelligent, responsive applications.`
  }
  
  if (lowerMessage.includes('justice') || lowerMessage.includes('reform') || lowerMessage.includes('legal')) {
    return `Justice reform is at the core of everything I do. I believe technology, especially AI, can transform our justice system to be more:

• **Equitable** - Reducing bias and ensuring fair treatment
• **Transparent** - Providing clear insights into legal processes
• **Efficient** - Streamlining court operations and case management
• **Rehabilitative** - Supporting successful reentry and reducing recidivism

My projects focus on practical solutions that make a real difference in people's lives while maintaining the highest ethical standards.`
  }
  
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('claude')) {
    return `I leverage AI extensively in my development work, particularly Claude 4.1 for:

• **Code Generation & Review** - Automated code analysis and optimization
• **Legal Document Processing** - NLP for contract and case analysis
• **Predictive Analytics** - Forecasting case outcomes and resource needs
• **Bias Detection** - Identifying unfair patterns in legal data
• **User Experience** - Intelligent interfaces that adapt to user needs

AI isn't just a tool for me—it's a force multiplier that enables 10x productivity while ensuring ethical, responsible development.`
  }
  
  return `Thank you for your question! I'm StrayDog Syndications, an AI-Enhanced Full Stack Developer specializing in Justice Reform Technology. I combine cutting-edge AI with modern development practices to create solutions that transform justice systems.

I'd be happy to discuss:
• My justice reform projects and their impact
• AI integration strategies and implementation
• Full stack development with modern technologies
• How technology can create more equitable systems

What specific aspect would you like to explore?`
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    const rateLimit = checkRateLimit(rateLimitKey)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      )
    }

    // Parse request body
    const body: ChatRequest = await request.json()
    const { message, conversation = [] } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long. Please limit to 2000 characters.' },
        { status: 400 }
      )
    }

    // Build conversation history
    const messages: ChatMessage[] = [
      ...conversation.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message.trim(), timestamp: Date.now() }
    ]

    let assistantResponse: string

    try {
      // Try Claude API first
      assistantResponse = await callClaudeAPI(messages)
    } catch (error) {
      console.warn('Claude API unavailable, using fallback:', error)
      // Use fallback response if Claude API fails
      assistantResponse = generateFallbackResponse(message)
    }

    const response = {
      message: assistantResponse,
      timestamp: Date.now(),
      conversation: [
        ...messages,
        { role: 'assistant' as const, content: assistantResponse, timestamp: Date.now() }
      ]
    }

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
      }
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.',
        message: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'AI Chat API is running',
    features: [
      'Claude 4.1 Integration',
      'Justice Reform Context',
      'Rate Limiting',
      'Conversation History',
      'Fallback Responses'
    ],
    endpoints: {
      POST: 'Send chat message',
      GET: 'API status'
    }
  })
}
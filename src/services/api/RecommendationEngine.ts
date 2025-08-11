import { ClaudeService } from './ClaudeService';
import { AnalyticsService } from './AnalyticsService';
import { EnhancedAnalyticsService } from './EnhancedAnalyticsService';

export interface UserBehaviorData {
  userId?: string;
  sessionId: string;
  demographics: {
    location?: { country: string; city: string; timezone: string };
    device: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
    language: string;
  };
  interactions: {
    pageViews: Array<{
      page: string;
      timestamp: Date;
      duration: number;
      scrollDepth: number;
      exitPage: boolean;
    }>;
    clicks: Array<{
      element: string;
      page: string;
      timestamp: Date;
      position: { x: number; y: number };
    }>;
    searches: Array<{
      query: string;
      results: number;
      timestamp: Date;
      clickedResults: string[];
    }>;
    forms: Array<{
      formId: string;
      completed: boolean;
      abandonedAt?: string;
      timestamp: Date;
    }>;
  };
  preferences: {
    contentTypes: string[];
    topics: string[];
    engagementPatterns: {
      preferredTimeOfDay: string;
      sessionDuration: number;
      returnFrequency: number;
    };
  };
  goals: {
    identified: string[];
    achieved: string[];
    inProgress: string[];
  };
}

export interface ContentItem {
  id: string;
  type: 'project' | 'blog_post' | 'case_study' | 'tutorial' | 'showcase';
  title: string;
  description: string;
  url: string;
  tags: string[];
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
    featured: boolean;
    priority: number;
  };
  performance: {
    views: number;
    engagement: number;
    conversions: number;
    averageTimeOnPage: number;
    bounceRate: number;
    socialShares: number;
  };
  seoData: {
    keywords: string[];
    metaDescription: string;
    searchRanking?: Record<string, number>;
  };
}

export interface Recommendation {
  id: string;
  type: 'content' | 'layout' | 'cta' | 'navigation' | 'personalization';
  category: 'engagement' | 'conversion' | 'retention' | 'discovery' | 'performance';
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-1
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number; // 1-10
  targetAudience: {
    segments: string[];
    demographics: Record<string, any>;
    behaviors: string[];
  };
  implementation: {
    steps: Array<{
      step: string;
      description: string;
      estimatedTime: string;
      resources: string[];
    }>;
    timeline: string;
    dependencies: string[];
    successMetrics: string[];
  };
  content?: {
    items: ContentItem[];
    placement: string;
    format: string;
    timing: string;
  };
  abTest?: {
    hypothesis: string;
    variants: Array<{
      name: string;
      description: string;
      changes: string[];
    }>;
    successCriteria: string[];
    duration: string;
  };
  generatedAt: Date;
  validUntil: Date;
}

export interface RecommendationContext {
  currentPage: string;
  userSegment: string;
  sessionData: {
    duration: number;
    pageViews: number;
    interactions: number;
    referrer?: string;
  };
  businessGoals: string[];
  constraints: {
    budget?: number;
    timeline?: string;
    resources?: string[];
    technical?: string[];
  };
  preferences: {
    contentTypes: string[];
    excludeCategories: string[];
    prioritizeConversions: boolean;
    focusAreas: string[];
  };
}

export interface PersonalizationRule {
  id: string;
  name: string;
  description: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: any;
  }>;
  actions: Array<{
    type: 'show_content' | 'hide_content' | 'modify_layout' | 'change_cta' | 'redirect';
    target: string;
    value: any;
  }>;
  priority: number;
  active: boolean;
  performance: {
    impressions: number;
    conversions: number;
    conversionRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

class RecommendationEngine {
  private claudeService: ClaudeService;
  private analyticsService: AnalyticsService;
  private enhancedAnalyticsService: EnhancedAnalyticsService;
  private contentDatabase: Map<string, ContentItem> = new Map();
  private userProfiles: Map<string, UserBehaviorData> = new Map();
  private personalizationRules: Map<string, PersonalizationRule> = new Map();
  private recommendationCache: Map<string, Recommendation[]> = new Map();
  private mlModels: Map<string, any> = new Map();

  constructor() {
    this.claudeService = new ClaudeService();
    this.analyticsService = new AnalyticsService({
      trackingId: 'default',
      enableAutoTracking: true,
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      enableUserTracking: true,
      enableConversionTracking: true,
      enableHeatmapTracking: true,
      enableSessionRecording: true,
      privacyCompliant: true,
      cookieConsent: true,
      dataRetentionDays: 365,
      anonymizeIPs: true,
      respectDoNotTrack: true
    });
    this.enhancedAnalyticsService = new EnhancedAnalyticsService({
      ga4MeasurementId: 'G-XXXXXXXXXX',
      mixpanelToken: 'your-mixpanel-token',
      enableHeatmaps: true,
      enableSessionRecording: true,
      enableAIInsights: true,
      privacyCompliant: true,
      consentRequired: true,
      dataRetentionDays: 365
    });
    this.initializeContentDatabase();
    this.initializePersonalizationRules();
  }

  /**
   * Generate personalized recommendations for a user
   */
  public async generateRecommendations(
    userId: string,
    context: RecommendationContext,
    options: {
      maxRecommendations?: number;
      includeABTests?: boolean;
      focusAreas?: string[];
      excludeTypes?: string[];
    } = {}
  ): Promise<Recommendation[]> {
    try {
      console.log(`Generating recommendations for user ${userId}`);

      // Get user behavior data
      const userBehavior = await this.getUserBehaviorData(userId);
      
      // Analyze user patterns
      const userInsights = await this.analyzeUserPatterns(userBehavior);
      
      // Get content performance data
      const contentPerformance = await this.getContentPerformanceData();
      
      // Generate AI-powered recommendations
      const aiRecommendations = await this.generateAIRecommendations(
        userBehavior,
        userInsights,
        contentPerformance,
        context
      );
      
      // Apply business rules and filters
      const filteredRecommendations = this.applyBusinessRules(
        aiRecommendations,
        context,
        options
      );
      
      // Rank and prioritize recommendations
      const rankedRecommendations = this.rankRecommendations(
        filteredRecommendations,
        userBehavior,
        context
      );
      
      // Cache recommendations
      this.cacheRecommendations(userId, rankedRecommendations);
      
      const maxRecommendations = options.maxRecommendations || 10;
      return rankedRecommendations.slice(0, maxRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Generate AI-powered recommendations using Claude
   */
  private async generateAIRecommendations(
    userBehavior: UserBehaviorData,
    userInsights: any,
    contentPerformance: any,
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    try {
      const prompt = this.buildRecommendationPrompt(
        userBehavior,
        userInsights,
        contentPerformance,
        context
      );
      
      const response = await this.claudeService.generateCompletion([{ role: 'user', content: prompt }], {
        prompt,
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4000,
        temperature: 0.4
      });

      return this.parseRecommendationsFromResponse(response.content);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return [];
    }
  }

  /**
   * Build prompt for AI recommendation generation
   */
  private buildRecommendationPrompt(
    userBehavior: UserBehaviorData,
    userInsights: any,
    contentPerformance: any,
    context: RecommendationContext
  ): string {
    return `
As an AI recommendation engine for a portfolio website, analyze the following user data and generate personalized content and UX recommendations:

## User Behavior Analysis

### Demographics
- Device: ${userBehavior.demographics.device}
- Location: ${userBehavior.demographics.location?.city}, ${userBehavior.demographics.location?.country}
- Browser: ${userBehavior.demographics.browser}
- Language: ${userBehavior.demographics.language}

### Interaction Patterns
- Total Page Views: ${userBehavior.interactions.pageViews.length}
- Average Session Duration: ${userBehavior.interactions.pageViews.reduce((sum, pv) => sum + pv.duration, 0) / userBehavior.interactions.pageViews.length / 1000}s
- Average Scroll Depth: ${(userBehavior.interactions.pageViews.reduce((sum, pv) => sum + pv.scrollDepth, 0) / userBehavior.interactions.pageViews.length * 100).toFixed(1)}%
- Click Interactions: ${userBehavior.interactions.clicks.length}
- Search Queries: ${userBehavior.interactions.searches.length}

### Most Viewed Pages
${userBehavior.interactions.pageViews
  .reduce((acc, pv) => {
    acc[pv.page] = (acc[pv.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
  ? Object.entries(userBehavior.interactions.pageViews.reduce((acc, pv) => {
      acc[pv.page] = (acc[pv.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([page, views]) => `- ${page}: ${views} views`)
    .join('\n')
  : 'No page view data'}

### User Preferences
- Content Types: ${userBehavior.preferences.contentTypes.join(', ')}
- Topics of Interest: ${userBehavior.preferences.topics.join(', ')}
- Preferred Session Duration: ${userBehavior.preferences.engagementPatterns.sessionDuration}s

### Goals
- Identified Goals: ${userBehavior.goals.identified.join(', ')}
- Achieved Goals: ${userBehavior.goals.achieved.join(', ')}
- In Progress: ${userBehavior.goals.inProgress.join(', ')}

## Current Context
- Current Page: ${context.currentPage}
- User Segment: ${context.userSegment}
- Session Duration: ${context.sessionData.duration}s
- Page Views This Session: ${context.sessionData.pageViews}
- Business Goals: ${context.businessGoals.join(', ')}

## Content Performance Data
${contentPerformance ? `
### Top Performing Content
${contentPerformance.topContent?.map((item: any) => 
  `- ${item.title}: ${item.views} views, ${(item.engagement * 100).toFixed(1)}% engagement`
).join('\n') || 'No performance data'}

### Content Gaps
${contentPerformance.gaps?.map((gap: any) => `- ${gap.category}: ${gap.description}`).join('\n') || 'No gaps identified'}
` : 'No content performance data available'}

Based on this analysis, provide personalized recommendations in the following JSON format:

{
  "recommendations": [
    {
      "type": "content|layout|cta|navigation|personalization",
      "category": "engagement|conversion|retention|discovery|performance",
      "title": "Recommendation title",
      "description": "Detailed description",
      "reasoning": "Why this recommendation is relevant",
      "confidence": 0.85,
      "impact": "high|medium|low",
      "effort": "low|medium|high",
      "priority": 8,
      "targetAudience": {
        "segments": ["segment1", "segment2"],
        "behaviors": ["behavior1", "behavior2"]
      },
      "implementation": {
        "steps": [
          {
            "step": "Step name",
            "description": "Step description",
            "estimatedTime": "2 hours",
            "resources": ["resource1"]
          }
        ],
        "timeline": "1 week",
        "successMetrics": ["metric1", "metric2"]
      },
      "content": {
        "placement": "hero|sidebar|footer|inline",
        "format": "card|banner|list|carousel",
        "timing": "immediate|delayed|exit_intent"
      }
    }
  ]
}

Focus on:
1. Content recommendations based on user interests and behavior
2. UX improvements for better engagement
3. Personalization opportunities
4. Conversion optimization suggestions
5. Navigation and discovery enhancements

Provide 5-8 high-quality, actionable recommendations.
`;
  }

  /**
   * Parse recommendations from AI response
   */
  private parseRecommendationsFromResponse(response: string): Recommendation[] {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const recommendations: Recommendation[] = [];

      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        parsed.recommendations.forEach((rec: any, index: number) => {
          recommendations.push({
            id: `rec_${Date.now()}_${index}`,
            type: rec.type || 'content',
            category: rec.category || 'engagement',
            title: rec.title || 'Untitled Recommendation',
            description: rec.description || '',
            reasoning: rec.reasoning || '',
            confidence: rec.confidence || 0.5,
            impact: rec.impact || 'medium',
            effort: rec.effort || 'medium',
            priority: rec.priority || 5,
            targetAudience: rec.targetAudience || { segments: [], demographics: {}, behaviors: [] },
            implementation: rec.implementation || { steps: [], timeline: '', dependencies: [], successMetrics: [] },
            content: rec.content,
            generatedAt: new Date(),
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Valid for 7 days
          });
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error parsing recommendations from response:', error);
      return [];
    }
  }

  /**
   * Get user behavior data
   */
  private async getUserBehaviorData(userId: string): Promise<UserBehaviorData> {
    // Check cache first
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!;
    }

    // Mock user behavior data - in real implementation, this would come from analytics
    const mockData: UserBehaviorData = {
      userId,
      sessionId: `session_${Date.now()}`,
      demographics: {
        location: { country: 'United States', city: 'San Francisco', timezone: 'PST' },
        device: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
        language: 'en-US'
      },
      interactions: {
        pageViews: [
          { page: '/portfolio', timestamp: new Date(), duration: 45000, scrollDepth: 0.8, exitPage: false },
          { page: '/about', timestamp: new Date(), duration: 30000, scrollDepth: 0.6, exitPage: false },
          { page: '/contact', timestamp: new Date(), duration: 15000, scrollDepth: 0.9, exitPage: true }
        ],
        clicks: [
          { element: 'portfolio-item-1', page: '/portfolio', timestamp: new Date(), position: { x: 300, y: 200 } },
          { element: 'contact-button', page: '/about', timestamp: new Date(), position: { x: 500, y: 400 } }
        ],
        searches: [
          { query: 'react projects', results: 5, timestamp: new Date(), clickedResults: ['project-1'] }
        ],
        forms: [
          { formId: 'contact-form', completed: false, abandonedAt: 'email', timestamp: new Date() }
        ]
      },
      preferences: {
        contentTypes: ['projects', 'tutorials', 'case-studies'],
        topics: ['web-development', 'react', 'javascript', 'ui-design'],
        engagementPatterns: {
          preferredTimeOfDay: 'afternoon',
          sessionDuration: 180,
          returnFrequency: 3
        }
      },
      goals: {
        identified: ['learn-about-developer', 'view-portfolio', 'contact-for-project'],
        achieved: ['view-portfolio'],
        inProgress: ['contact-for-project']
      }
    };

    this.userProfiles.set(userId, mockData);
    return mockData;
  }

  /**
   * Analyze user patterns to extract insights
   */
  private async analyzeUserPatterns(userBehavior: UserBehaviorData): Promise<any> {
    // Analyze engagement patterns
    const avgSessionDuration = userBehavior.interactions.pageViews.reduce(
      (sum, pv) => sum + pv.duration, 0
    ) / userBehavior.interactions.pageViews.length;

    const avgScrollDepth = userBehavior.interactions.pageViews.reduce(
      (sum, pv) => sum + pv.scrollDepth, 0
    ) / userBehavior.interactions.pageViews.length;

    // Identify content preferences
    const pageFrequency = userBehavior.interactions.pageViews.reduce((acc, pv) => {
      acc[pv.page] = (acc[pv.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostViewedPages = Object.entries(pageFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([page]) => page);

    // Analyze interaction patterns
    const clickHeatmap = userBehavior.interactions.clicks.reduce((acc, click) => {
      const key = `${click.page}_${click.element}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      engagement: {
        avgSessionDuration,
        avgScrollDepth,
        interactionRate: userBehavior.interactions.clicks.length / userBehavior.interactions.pageViews.length
      },
      preferences: {
        mostViewedPages,
        contentTypes: userBehavior.preferences.contentTypes,
        topics: userBehavior.preferences.topics
      },
      patterns: {
        clickHeatmap,
        searchBehavior: userBehavior.interactions.searches.map(s => s.query),
        formInteraction: userBehavior.interactions.forms.length > 0
      },
      goals: {
        conversionFunnel: {
          awareness: userBehavior.interactions.pageViews.length > 0,
          interest: avgSessionDuration > 30000,
          consideration: userBehavior.interactions.clicks.length > 2,
          action: userBehavior.interactions.forms.some(f => f.completed)
        }
      }
    };
  }

  /**
   * Get content performance data
   */
  private async getContentPerformanceData(): Promise<any> {
    // Mock content performance data
    return {
      topContent: [
        { title: 'React Portfolio Project', views: 1500, engagement: 0.75, conversions: 45 },
        { title: 'JavaScript Tutorial Series', views: 1200, engagement: 0.68, conversions: 32 },
        { title: 'UI Design Case Study', views: 900, engagement: 0.82, conversions: 28 }
      ],
      gaps: [
        { category: 'Backend Development', description: 'Limited content on server-side technologies' },
        { category: 'Mobile Development', description: 'No mobile app development showcases' }
      ],
      trends: {
        popularTopics: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        emergingInterests: ['AI/ML', 'Web3', 'Serverless'],
        seasonalPatterns: { peak: 'Q4', low: 'Q2' }
      }
    };
  }

  /**
   * Apply business rules and filters
   */
  private applyBusinessRules(
    recommendations: Recommendation[],
    context: RecommendationContext,
    options: any
  ): Recommendation[] {
    return recommendations.filter(rec => {
      // Filter by excluded types
      if (options.excludeTypes && options.excludeTypes.includes(rec.type)) {
        return false;
      }

      // Filter by focus areas
      if (options.focusAreas && !options.focusAreas.includes(rec.category)) {
        return false;
      }

      // Filter by confidence threshold
      if (rec.confidence < 0.6) {
        return false;
      }

      return true;
    });
  }

  /**
   * Rank recommendations by relevance and impact
   */
  private rankRecommendations(
    recommendations: Recommendation[],
    userBehavior: UserBehaviorData,
    context: RecommendationContext
  ): Recommendation[] {
    return recommendations.sort((a, b) => {
      // Calculate relevance score
      const scoreA = this.calculateRelevanceScore(a, userBehavior, context);
      const scoreB = this.calculateRelevanceScore(b, userBehavior, context);
      
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate relevance score for a recommendation
   */
  private calculateRelevanceScore(
    recommendation: Recommendation,
    userBehavior: UserBehaviorData,
    context: RecommendationContext
  ): number {
    let score = 0;

    // Base score from confidence and priority
    score += recommendation.confidence * 40;
    score += (recommendation.priority / 10) * 30;

    // Impact weight
    const impactWeights = { high: 20, medium: 10, low: 5 };
    score += impactWeights[recommendation.impact];

    // Effort penalty (prefer low effort)
    const effortPenalty = { low: 0, medium: -5, high: -10 };
    score += effortPenalty[recommendation.effort];

    // Context relevance
    if (recommendation.category === 'conversion' && context.businessGoals.includes('increase_conversions')) {
      score += 15;
    }

    // User behavior alignment
    if (recommendation.type === 'content' && 
        userBehavior.preferences.contentTypes.some(type => 
          recommendation.description.toLowerCase().includes(type.toLowerCase())
        )) {
      score += 10;
    }

    return score;
  }

  /**
   * Cache recommendations
   */
  private cacheRecommendations(userId: string, recommendations: Recommendation[]): void {
    this.recommendationCache.set(userId, recommendations);
    
    // Clean up old cache entries
    if (this.recommendationCache.size > 100) {
      const oldestKey = this.recommendationCache.keys().next().value;
      this.recommendationCache.delete(oldestKey);
    }
  }

  /**
   * Get cached recommendations
   */
  public getCachedRecommendations(userId: string): Recommendation[] | undefined {
    return this.recommendationCache.get(userId);
  }

  /**
   * Initialize content database
   */
  private initializeContentDatabase(): void {
    // Mock content items
    const mockContent: ContentItem[] = [
      {
        id: 'content_1',
        type: 'project',
        title: 'E-commerce React App',
        description: 'Full-stack e-commerce application built with React and Node.js',
        url: '/portfolio/ecommerce-app',
        tags: ['react', 'nodejs', 'ecommerce', 'fullstack'],
        category: 'web-development',
        difficulty: 'advanced',
        estimatedReadTime: 10,
        metadata: {
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          author: 'Portfolio Owner',
          featured: true,
          priority: 9
        },
        performance: {
          views: 1500,
          engagement: 0.75,
          conversions: 45,
          averageTimeOnPage: 180,
          bounceRate: 0.25,
          socialShares: 32
        },
        seoData: {
          keywords: ['react ecommerce', 'fullstack project', 'web development'],
          metaDescription: 'Comprehensive e-commerce application showcasing modern web development skills'
        }
      }
    ];

    mockContent.forEach(item => {
      this.contentDatabase.set(item.id, item);
    });
  }

  /**
   * Initialize personalization rules
   */
  private initializePersonalizationRules(): void {
    const mockRules: PersonalizationRule[] = [
      {
        id: 'rule_1',
        name: 'Mobile User Content Optimization',
        description: 'Show mobile-optimized content for mobile users',
        conditions: [
          { field: 'device', operator: 'equals', value: 'mobile' }
        ],
        actions: [
          { type: 'show_content', target: 'mobile-portfolio', value: true }
        ],
        priority: 8,
        active: true,
        performance: {
          impressions: 1000,
          conversions: 85,
          conversionRate: 0.085
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    mockRules.forEach(rule => {
      this.personalizationRules.set(rule.id, rule);
    });
  }

  /**
   * Apply personalization rules
   */
  public applyPersonalizationRules(
    userId: string,
    context: RecommendationContext
  ): PersonalizationRule[] {
    const applicableRules: PersonalizationRule[] = [];
    
    this.personalizationRules.forEach(rule => {
      if (rule.active && this.evaluateRuleConditions(rule, context)) {
        applicableRules.push(rule);
      }
    });

    return applicableRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Evaluate rule conditions
   */
  private evaluateRuleConditions(
    rule: PersonalizationRule,
    context: RecommendationContext
  ): boolean {
    return rule.conditions.every(condition => {
      // This would implement actual condition evaluation logic
      return true; // Simplified for demo
    });
  }

  /**
   * Get content recommendations
   */
  public getContentRecommendations(
    userId: string,
    limit: number = 5
  ): ContentItem[] {
    const userBehavior = this.userProfiles.get(userId);
    if (!userBehavior) {
      return Array.from(this.contentDatabase.values()).slice(0, limit);
    }

    // Score content based on user preferences
    const scoredContent = Array.from(this.contentDatabase.values())
      .map(content => ({
        content,
        score: this.calculateContentScore(content, userBehavior)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.content);

    return scoredContent;
  }

  /**
   * Calculate content relevance score
   */
  private calculateContentScore(content: ContentItem, userBehavior: UserBehaviorData): number {
    let score = 0;

    // Base performance score
    score += content.performance.engagement * 50;
    score += (content.performance.conversions / content.performance.views) * 30;

    // User preference alignment
    const topicMatch = userBehavior.preferences.topics.some(topic => 
      content.tags.includes(topic) || content.category.includes(topic)
    );
    if (topicMatch) score += 20;

    // Content type preference
    if (userBehavior.preferences.contentTypes.includes(content.type)) {
      score += 15;
    }

    // Recency bonus
    const daysSinceUpdate = (Date.now() - content.metadata.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) score += 10;

    // Featured content bonus
    if (content.metadata.featured) score += 5;

    return score;
  }
}

// Create singleton instance
const recommendationEngine = new RecommendationEngine();

export default recommendationEngine;

// Export types
export type {
  UserBehaviorData,
  ContentItem,
  Recommendation,
  RecommendationContext,
  PersonalizationRule
};
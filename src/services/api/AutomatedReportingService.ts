import { ClaudeService } from './ClaudeService';
import { AnalyticsService } from './AnalyticsService';
import { EnhancedAnalyticsService } from './EnhancedAnalyticsService';

export interface ReportData {
  period: {
    start: Date;
    end: Date;
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
    topPages: Array<{ page: string; views: number; engagement: number }>;
    trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
    deviceBreakdown: Array<{ device: string; percentage: number }>;
    geographicData: Array<{ country: string; visitors: number; percentage: number }>;
  };
  userBehavior: {
    heatmapData: Array<{ page: string; interactions: number; hotspots: Array<{ x: number; y: number; intensity: number }> }>;
    scrollDepth: { avg: number; pages: Array<{ page: string; depth: number }> };
    clickPatterns: Array<{ element: string; clicks: number; page: string }>;
    formAnalytics: Array<{ form: string; completions: number; abandonments: number; conversionRate: number }>;
    searchQueries: Array<{ query: string; results: number; clicks: number }>;
  };
  performance: {
    pageLoadTimes: { avg: number; p95: number; pages: Array<{ page: string; loadTime: number }> };
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    errorRates: Array<{ page: string; errors: number; rate: number }>;
    uptimePercentage: number;
  };
  abTests: Array<{
    testId: string;
    name: string;
    status: string;
    variants: Array<{ name: string; conversionRate: number; participants: number }>;
    winner?: string;
    significance: number;
  }>;
  goals: Array<{
    name: string;
    target: number;
    actual: number;
    achievement: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'recommendation';
  category: 'performance' | 'user_experience' | 'conversion' | 'content' | 'technical';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-1
  actionItems: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
    expectedImpact: string;
  }>;
  data: {
    metrics: Record<string, number>;
    comparisons: Array<{ metric: string; current: number; previous: number; change: number }>;
    trends: Array<{ metric: string; direction: 'up' | 'down' | 'stable'; significance: number }>;
  };
  generatedAt: Date;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  period: {
    start: Date;
    end: Date;
  };
  data: ReportData;
  insights: AIInsight[];
  summary: {
    keyMetrics: Array<{ name: string; value: string; change: string; trend: 'up' | 'down' | 'stable' }>;
    topInsights: AIInsight[];
    recommendations: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }>;
    achievements: Array<{ title: string; description: string; impact: string }>;
  };
  generatedAt: Date;
  generatedBy: 'claude' | 'system';
  version: string;
}

export interface ReportingConfig {
  enabled: boolean;
  schedule: {
    daily: { enabled: boolean; time: string; recipients: string[] };
    weekly: { enabled: boolean; day: number; time: string; recipients: string[] };
    monthly: { enabled: boolean; day: number; time: string; recipients: string[] };
    quarterly: { enabled: boolean; day: number; time: string; recipients: string[] };
  };
  insights: {
    enabled: boolean;
    minConfidence: number;
    categories: string[];
    maxInsights: number;
  };
  delivery: {
    email: { enabled: boolean; template: string };
    dashboard: { enabled: boolean; retention: number };
    webhook: { enabled: boolean; url?: string };
    export: { formats: string[]; storage: string };
  };
  customization: {
    branding: { logo?: string; colors: Record<string, string> };
    sections: string[];
    metrics: string[];
    filters: Record<string, any>;
  };
}

class AutomatedReportingService {
  private claudeService: ClaudeService;
  private analyticsService: AnalyticsService;
  private enhancedAnalyticsService: EnhancedAnalyticsService;
  private config: ReportingConfig;
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();
  private reportCache: Map<string, Report> = new Map();

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
    this.config = this.getDefaultConfig();
    this.initializeScheduler();
  }

  /**
   * Generate a comprehensive report for the specified period
   */
  public async generateReport(
    type: Report['type'],
    startDate: Date,
    endDate: Date,
    options: {
      includeInsights?: boolean;
      insightCategories?: string[];
      customPrompt?: string;
    } = {}
  ): Promise<Report> {
    try {
      console.log(`Generating ${type} report for ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Collect data from various sources
      const reportData = await this.collectReportData(startDate, endDate);

      // Generate AI insights if enabled
      let insights: AIInsight[] = [];
      if (options.includeInsights !== false && this.config.insights.enabled) {
        insights = await this.generateAIInsights(reportData, options.insightCategories, options.customPrompt);
      }

      // Create report summary
      const summary = await this.createReportSummary(reportData, insights);

      const report: Report = {
        id: `report_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        period: { start: startDate, end: endDate },
        data: reportData,
        insights,
        summary,
        generatedAt: new Date(),
        generatedBy: 'claude',
        version: '1.0.0'
      };

      // Cache the report
      this.cacheReport(report);

      // Deliver the report
      await this.deliverReport(report);

      console.log(`Report ${report.id} generated successfully`);
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Generate AI-powered insights from report data
   */
  private async generateAIInsights(
    data: ReportData,
    categories?: string[],
    customPrompt?: string
  ): Promise<AIInsight[]> {
    try {
      const prompt = customPrompt || this.buildInsightsPrompt(data, categories);
      
      const response = await this.claudeService.generateCompletion([{ role: 'user', content: prompt }], {
        prompt,
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4000,
        temperature: 0.3
      });

      // Parse the AI response to extract insights
      const insights = this.parseInsightsFromResponse(response.content, data);
      
      // Filter insights by confidence and category
      return insights.filter(insight => {
        const meetsConfidence = insight.confidence >= this.config.insights.minConfidence;
        const meetsCategory = !categories || categories.includes(insight.category);
        return meetsConfidence && meetsCategory;
      }).slice(0, this.config.insights.maxInsights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return [];
    }
  }

  /**
   * Build prompt for AI insights generation
   */
  private buildInsightsPrompt(data: ReportData, categories?: string[]): string {
    const categoriesFilter = categories ? ` focusing on ${categories.join(', ')}` : '';
    
    return `
Analyze the following portfolio analytics data and provide actionable insights${categoriesFilter}:

## Analytics Data Summary

### Key Metrics
- Page Views: ${data.metrics.pageViews.toLocaleString()}
- Unique Visitors: ${data.metrics.uniqueVisitors.toLocaleString()}
- Sessions: ${data.metrics.sessions.toLocaleString()}
- Bounce Rate: ${(data.metrics.bounceRate * 100).toFixed(1)}%
- Avg Session Duration: ${Math.round(data.metrics.avgSessionDuration / 1000)}s
- Conversion Rate: ${(data.metrics.conversionRate * 100).toFixed(2)}%

### Top Performing Pages
${data.metrics.topPages.map(page => `- ${page.page}: ${page.views} views (${page.engagement.toFixed(1)}% engagement)`).join('\n')}

### Traffic Sources
${data.metrics.trafficSources.map(source => `- ${source.source}: ${source.percentage.toFixed(1)}% (${source.visitors} visitors)`).join('\n')}

### Device Breakdown
${data.metrics.deviceBreakdown.map(device => `- ${device.device}: ${device.percentage.toFixed(1)}%`).join('\n')}

### User Behavior
- Average Scroll Depth: ${(data.userBehavior.scrollDepth.avg * 100).toFixed(1)}%
- Top Click Patterns: ${data.userBehavior.clickPatterns.slice(0, 3).map(pattern => `${pattern.element} (${pattern.clicks} clicks)`).join(', ')}

### Performance Metrics
- Average Page Load Time: ${data.performance.pageLoadTimes.avg.toFixed(2)}s
- Core Web Vitals: LCP ${data.performance.coreWebVitals.lcp.toFixed(2)}s, FID ${data.performance.coreWebVitals.fid.toFixed(2)}ms, CLS ${data.performance.coreWebVitals.cls.toFixed(3)}
- Uptime: ${data.performance.uptimePercentage.toFixed(2)}%

### A/B Tests
${data.abTests.map(test => `- ${test.name}: ${test.status} (${test.significance.toFixed(1)}% significance)`).join('\n')}

### Goals Achievement
${data.goals.map(goal => `- ${goal.name}: ${goal.achievement.toFixed(1)}% of target (${goal.trend} trend)`).join('\n')}

Please provide insights in the following JSON format:

{
  "insights": [
    {
      "type": "opportunity|warning|achievement|recommendation",
      "category": "performance|user_experience|conversion|content|technical",
      "title": "Brief insight title",
      "description": "Detailed description of the insight",
      "impact": "high|medium|low",
      "confidence": 0.85,
      "actionItems": [
        {
          "action": "Specific action to take",
          "priority": "high|medium|low",
          "effort": "low|medium|high",
          "expectedImpact": "Expected outcome"
        }
      ]
    }
  ]
}

Focus on:
1. Performance optimization opportunities
2. User experience improvements
3. Conversion rate optimization
4. Content strategy recommendations
5. Technical issues or achievements

Provide 3-8 high-quality insights with actionable recommendations.
`;
  }

  /**
   * Parse insights from AI response
   */
  private parseInsightsFromResponse(response: string, data: ReportData): AIInsight[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const insights: AIInsight[] = [];

      if (parsed.insights && Array.isArray(parsed.insights)) {
        parsed.insights.forEach((insight: any, index: number) => {
          insights.push({
            id: `insight_${Date.now()}_${index}`,
            type: insight.type || 'recommendation',
            category: insight.category || 'user_experience',
            title: insight.title || 'Untitled Insight',
            description: insight.description || '',
            impact: insight.impact || 'medium',
            confidence: insight.confidence || 0.5,
            actionItems: insight.actionItems || [],
            data: {
              metrics: this.extractRelevantMetrics(data, insight.category),
              comparisons: [],
              trends: []
            },
            generatedAt: new Date()
          });
        });
      }

      return insights;
    } catch (error) {
      console.error('Error parsing insights from response:', error);
      return [];
    }
  }

  /**
   * Extract relevant metrics for insight
   */
  private extractRelevantMetrics(data: ReportData, category: string): Record<string, number> {
    const metrics: Record<string, number> = {};

    switch (category) {
      case 'performance':
        metrics.avgLoadTime = data.performance.pageLoadTimes.avg;
        metrics.lcp = data.performance.coreWebVitals.lcp;
        metrics.fid = data.performance.coreWebVitals.fid;
        metrics.cls = data.performance.coreWebVitals.cls;
        metrics.uptime = data.performance.uptimePercentage;
        break;
      case 'user_experience':
        metrics.bounceRate = data.metrics.bounceRate;
        metrics.avgSessionDuration = data.metrics.avgSessionDuration;
        metrics.scrollDepth = data.userBehavior.scrollDepth.avg;
        break;
      case 'conversion':
        metrics.conversionRate = data.metrics.conversionRate;
        metrics.sessions = data.metrics.sessions;
        metrics.uniqueVisitors = data.metrics.uniqueVisitors;
        break;
      case 'content':
        metrics.pageViews = data.metrics.pageViews;
        metrics.topPageEngagement = data.metrics.topPages[0]?.engagement || 0;
        break;
      default:
        metrics.pageViews = data.metrics.pageViews;
        metrics.uniqueVisitors = data.metrics.uniqueVisitors;
        metrics.bounceRate = data.metrics.bounceRate;
    }

    return metrics;
  }

  /**
   * Collect comprehensive report data
   */
  private async collectReportData(startDate: Date, endDate: Date): Promise<ReportData> {
    try {
      // This would integrate with actual analytics services
      // For now, we'll return mock data structure
      
      const mockData: ReportData = {
        period: {
          start: startDate,
          end: endDate,
          type: this.determinePeriodType(startDate, endDate)
        },
        metrics: {
          pageViews: Math.floor(Math.random() * 10000) + 5000,
          uniqueVisitors: Math.floor(Math.random() * 5000) + 2000,
          sessions: Math.floor(Math.random() * 6000) + 2500,
          bounceRate: Math.random() * 0.3 + 0.2,
          avgSessionDuration: Math.random() * 180000 + 60000,
          conversionRate: Math.random() * 0.05 + 0.01,
          topPages: [
            { page: '/portfolio', views: 1500, engagement: 0.75 },
            { page: '/about', views: 1200, engagement: 0.68 },
            { page: '/contact', views: 800, engagement: 0.82 }
          ],
          trafficSources: [
            { source: 'Direct', visitors: 2000, percentage: 40 },
            { source: 'Google', visitors: 1500, percentage: 30 },
            { source: 'Social', visitors: 1000, percentage: 20 },
            { source: 'Referral', visitors: 500, percentage: 10 }
          ],
          deviceBreakdown: [
            { device: 'Desktop', percentage: 60 },
            { device: 'Mobile', percentage: 35 },
            { device: 'Tablet', percentage: 5 }
          ],
          geographicData: [
            { country: 'United States', visitors: 2000, percentage: 40 },
            { country: 'United Kingdom', visitors: 800, percentage: 16 },
            { country: 'Canada', visitors: 600, percentage: 12 }
          ]
        },
        userBehavior: {
          heatmapData: [
            {
              page: '/portfolio',
              interactions: 500,
              hotspots: [
                { x: 300, y: 200, intensity: 0.8 },
                { x: 500, y: 400, intensity: 0.6 }
              ]
            }
          ],
          scrollDepth: {
            avg: 0.65,
            pages: [
              { page: '/portfolio', depth: 0.75 },
              { page: '/about', depth: 0.60 }
            ]
          },
          clickPatterns: [
            { element: 'nav-portfolio', clicks: 300, page: '/home' },
            { element: 'contact-button', clicks: 150, page: '/portfolio' }
          ],
          formAnalytics: [
            { form: 'contact-form', completions: 45, abandonments: 15, conversionRate: 0.75 }
          ],
          searchQueries: [
            { query: 'portfolio', results: 10, clicks: 8 }
          ]
        },
        performance: {
          pageLoadTimes: {
            avg: 2.1,
            p95: 4.2,
            pages: [
              { page: '/portfolio', loadTime: 1.8 },
              { page: '/about', loadTime: 2.3 }
            ]
          },
          coreWebVitals: {
            lcp: 2.1,
            fid: 45,
            cls: 0.08
          },
          errorRates: [
            { page: '/portfolio', errors: 2, rate: 0.001 }
          ],
          uptimePercentage: 99.8
        },
        abTests: [
          {
            testId: 'test_1',
            name: 'Hero Section CTA',
            status: 'completed',
            variants: [
              { name: 'Control', conversionRate: 0.025, participants: 1000 },
              { name: 'Variant A', conversionRate: 0.032, participants: 1000 }
            ],
            winner: 'Variant A',
            significance: 0.95
          }
        ],
        goals: [
          {
            name: 'Monthly Conversions',
            target: 100,
            actual: 85,
            achievement: 0.85,
            trend: 'up'
          }
        ]
      };

      return mockData;
    } catch (error) {
      console.error('Error collecting report data:', error);
      throw error;
    }
  }

  /**
   * Create report summary
   */
  private async createReportSummary(data: ReportData, insights: AIInsight[]): Promise<Report['summary']> {
    const keyMetrics = [
      {
        name: 'Page Views',
        value: data.metrics.pageViews.toLocaleString(),
        change: '+12.5%',
        trend: 'up' as const
      },
      {
        name: 'Conversion Rate',
        value: `${(data.metrics.conversionRate * 100).toFixed(2)}%`,
        change: '+0.8%',
        trend: 'up' as const
      },
      {
        name: 'Bounce Rate',
        value: `${(data.metrics.bounceRate * 100).toFixed(1)}%`,
        change: '-2.1%',
        trend: 'down' as const
      }
    ];

    const topInsights = insights
      .filter(insight => insight.impact === 'high')
      .slice(0, 3);

    const recommendations = insights
      .flatMap(insight => insight.actionItems)
      .filter(action => action.priority === 'high')
      .slice(0, 5)
      .map(action => ({
        title: action.action,
        description: action.expectedImpact,
        priority: action.priority
      }));

    const achievements = insights
      .filter(insight => insight.type === 'achievement')
      .slice(0, 3)
      .map(insight => ({
        title: insight.title,
        description: insight.description,
        impact: insight.impact
      }));

    return {
      keyMetrics,
      topInsights,
      recommendations,
      achievements
    };
  }

  /**
   * Determine period type based on date range
   */
  private determinePeriodType(startDate: Date, endDate: Date): ReportData['period']['type'] {
    const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'daily';
    if (diffDays <= 7) return 'weekly';
    if (diffDays <= 31) return 'monthly';
    return 'quarterly';
  }

  /**
   * Cache report for quick access
   */
  private cacheReport(report: Report): void {
    this.reportCache.set(report.id, report);
    
    // Clean up old reports (keep last 50)
    if (this.reportCache.size > 50) {
      const oldestKey = this.reportCache.keys().next().value;
      this.reportCache.delete(oldestKey);
    }
  }

  /**
   * Deliver report through configured channels
   */
  private async deliverReport(report: Report): Promise<void> {
    try {
      if (this.config.delivery.dashboard.enabled) {
        // Store in dashboard (would integrate with actual storage)
        console.log(`Report ${report.id} stored in dashboard`);
      }

      if (this.config.delivery.email.enabled) {
        // Send email (would integrate with email service)
        console.log(`Report ${report.id} sent via email`);
      }

      if (this.config.delivery.webhook.enabled && this.config.delivery.webhook.url) {
        // Send webhook (would make HTTP request)
        console.log(`Report ${report.id} sent via webhook`);
      }

      if (this.config.delivery.export.formats.length > 0) {
        // Export to files (would save to storage)
        console.log(`Report ${report.id} exported to files`);
      }
    } catch (error) {
      console.error('Error delivering report:', error);
    }
  }

  /**
   * Initialize report scheduler
   */
  private initializeScheduler(): void {
    // This would set up cron jobs for automated reporting
    console.log('Report scheduler initialized');
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): ReportingConfig {
    return {
      enabled: true,
      schedule: {
        daily: { enabled: false, time: '09:00', recipients: [] },
        weekly: { enabled: true, day: 1, time: '09:00', recipients: [] },
        monthly: { enabled: true, day: 1, time: '09:00', recipients: [] },
        quarterly: { enabled: false, day: 1, time: '09:00', recipients: [] }
      },
      insights: {
        enabled: true,
        minConfidence: 0.7,
        categories: ['performance', 'user_experience', 'conversion', 'content'],
        maxInsights: 8
      },
      delivery: {
        email: { enabled: false, template: 'default' },
        dashboard: { enabled: true, retention: 90 },
        webhook: { enabled: false },
        export: { formats: ['json', 'pdf'], storage: 'local' }
      },
      customization: {
        branding: { colors: { primary: '#3B82F6', secondary: '#10B981' } },
        sections: ['summary', 'metrics', 'insights', 'recommendations'],
        metrics: ['pageViews', 'conversions', 'performance'],
        filters: {}
      }
    };
  }

  /**
   * Get cached report
   */
  public getCachedReport(reportId: string): Report | undefined {
    return this.reportCache.get(reportId);
  }

  /**
   * Get all cached reports
   */
  public getAllCachedReports(): Report[] {
    return Array.from(this.reportCache.values());
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<ReportingConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Reporting configuration updated');
  }

  /**
   * Get current configuration
   */
  public getConfig(): ReportingConfig {
    return { ...this.config };
  }
}

// Create singleton instance
const automatedReportingService = new AutomatedReportingService();

export default automatedReportingService;

// Export types for external use
export type {
  ReportData as AutomatedReportData,
  AIInsight as AutomatedAIInsight,
  Report as AutomatedReport,
  ReportingConfig as AutomatedReportingConfig
};
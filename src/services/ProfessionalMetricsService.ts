import { getWebSocketService } from './WebSocketService';

export interface ContactFormMetrics {
  formId: string;
  formName: string;
  views: number;
  starts: number; // Users who started filling
  completions: number;
  submissions: number;
  conversionRate: number;
  averageTimeToComplete: number;
  abandonmentPoints: {
    fieldName: string;
    abandonments: number;
  }[];
  validationErrors: {
    fieldName: string;
    errorType: string;
    count: number;
  }[];
}

export interface ResumeDownloadMetrics {
  totalDownloads: number;
  uniqueDownloads: number;
  downloadsBySource: {
    source: string;
    downloads: number;
  }[];
  downloadsByDevice: {
    device: string;
    downloads: number;
  }[];
  downloadsByLocation: {
    country: string;
    city: string;
    downloads: number;
  }[];
  downloadTrends: {
    date: string;
    downloads: number;
  }[];
}

export interface SocialMediaMetrics {
  platform: string;
  clicks: number;
  uniqueClicks: number;
  clickThroughRate: number;
  referralTraffic: number;
  engagementTime: number;
  conversionEvents: {
    type: string;
    count: number;
  }[];
}

export interface ProfessionalGoal {
  id: string;
  name: string;
  type: 'contact_form' | 'resume_download' | 'social_click' | 'project_view' | 'custom';
  target: number;
  current: number;
  timeframe: 'daily' | 'weekly' | 'monthly';
  active: boolean;
  createdAt: Date;
}

export interface ConversionFunnel {
  id: string;
  name: string;
  steps: {
    name: string;
    selector: string;
    users: number;
    conversionRate: number;
  }[];
  totalUsers: number;
  completionRate: number;
}

export interface LeadQualityMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  leadSources: {
    source: string;
    leads: number;
    quality: 'high' | 'medium' | 'low';
  }[];
  responseTime: {
    average: number;
    median: number;
  };
  followUpRate: number;
}

class ProfessionalMetricsService {
  private isTracking = false;
  private contactForms: Map<string, ContactFormMetrics> = new Map();
  private resumeMetrics: ResumeDownloadMetrics;
  private socialMetrics: Map<string, SocialMediaMetrics> = new Map();
  private goals: Map<string, ProfessionalGoal> = new Map();
  private conversionFunnels: Map<string, ConversionFunnel> = new Map();
  private leadMetrics: LeadQualityMetrics;
  private webSocketService = getWebSocketService();
  private eventListeners: (() => void)[] = [];

  constructor() {
    this.resumeMetrics = {
      totalDownloads: 0,
      uniqueDownloads: 0,
      downloadsBySource: [],
      downloadsByDevice: [],
      downloadsByLocation: [],
      downloadTrends: []
    };

    this.leadMetrics = {
      totalLeads: 0,
      qualifiedLeads: 0,
      leadSources: [],
      responseTime: { average: 0, median: 0 },
      followUpRate: 0
    };
  }

  async initialize(): Promise<void> {
    if (this.isTracking) return;

    try {
      this.loadStoredData();
      this.setupFormTracking();
      this.setupSocialMediaTracking();
      this.setupResumeTracking();
      this.setupGoalTracking();
      this.isTracking = true;
      
      console.log('Professional metrics tracking initialized');
    } catch (error) {
      console.error('Failed to initialize professional metrics:', error);
      throw error;
    }
  }

  private loadStoredData(): void {
    // Load contact form metrics
    const storedForms = localStorage.getItem('professional_metrics_forms');
    if (storedForms) {
      try {
        const data = JSON.parse(storedForms);
        Object.entries(data).forEach(([id, metrics]) => {
          this.contactForms.set(id, metrics as ContactFormMetrics);
        });
      } catch (error) {
        console.error('Failed to load contact form metrics:', error);
      }
    }

    // Load resume metrics
    const storedResume = localStorage.getItem('professional_metrics_resume');
    if (storedResume) {
      try {
        this.resumeMetrics = JSON.parse(storedResume);
      } catch (error) {
        console.error('Failed to load resume metrics:', error);
      }
    }

    // Load social media metrics
    const storedSocial = localStorage.getItem('professional_metrics_social');
    if (storedSocial) {
      try {
        const data = JSON.parse(storedSocial);
        Object.entries(data).forEach(([platform, metrics]) => {
          this.socialMetrics.set(platform, metrics as SocialMediaMetrics);
        });
      } catch (error) {
        console.error('Failed to load social media metrics:', error);
      }
    }

    // Load goals
    const storedGoals = localStorage.getItem('professional_metrics_goals');
    if (storedGoals) {
      try {
        const data = JSON.parse(storedGoals);
        Object.entries(data).forEach(([id, goal]) => {
          this.goals.set(id, goal as ProfessionalGoal);
        });
      } catch (error) {
        console.error('Failed to load goals:', error);
      }
    }
  }

  private setupFormTracking(): void {
    // Track all forms on the page
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const formId = form.id || form.getAttribute('data-form-id') || `form-${Date.now()}`;
      const formName = form.getAttribute('data-form-name') || form.getAttribute('name') || 'Contact Form';
      
      // Initialize form metrics if not exists
      if (!this.contactForms.has(formId)) {
        this.contactForms.set(formId, {
          formId,
          formName,
          views: 0,
          starts: 0,
          completions: 0,
          submissions: 0,
          conversionRate: 0,
          averageTimeToComplete: 0,
          abandonmentPoints: [],
          validationErrors: []
        });
      }

      // Track form view
      this.trackFormView(formId);

      // Track form interactions
      this.setupFormInteractionTracking(form, formId);
    });
  }

  private setupFormInteractionTracking(form: HTMLFormElement, formId: string): void {
    let formStartTime: number | null = null;
    let hasStarted = false;
    const fieldInteractions: Map<string, number> = new Map();

    // Track form start (first input focus)
    const startHandler = () => {
      if (!hasStarted) {
        hasStarted = true;
        formStartTime = Date.now();
        this.trackFormStart(formId);
      }
    };

    // Track field interactions
    const fieldHandler = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const fieldName = target.name || target.id || target.type;
      
      if (event.type === 'focus') {
        startHandler();
      } else if (event.type === 'blur') {
        const interactionTime = fieldInteractions.get(fieldName) || 0;
        fieldInteractions.set(fieldName, interactionTime + 1);
      } else if (event.type === 'invalid') {
        this.trackValidationError(formId, fieldName, 'validation_failed');
      }
    };

    // Track form submission
    const submitHandler = (event: SubmitEvent) => {
      event.preventDefault();
      
      const completionTime = formStartTime ? Date.now() - formStartTime : 0;
      this.trackFormSubmission(formId, completionTime);
      
      // Allow form to submit normally
      setTimeout(() => {
        form.submit();
      }, 100);
    };

    // Track form abandonment
    const abandonmentHandler = () => {
      if (hasStarted && formStartTime) {
        // Find the last interacted field
        let lastField = '';
        let maxInteractions = 0;
        fieldInteractions.forEach((interactions, fieldName) => {
          if (interactions > maxInteractions) {
            maxInteractions = interactions;
            lastField = fieldName;
          }
        });
        
        if (lastField) {
          this.trackFormAbandonment(formId, lastField);
        }
      }
    };

    // Add event listeners
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', fieldHandler);
      input.addEventListener('blur', fieldHandler);
      input.addEventListener('invalid', fieldHandler);
    });

    form.addEventListener('submit', submitHandler);
    window.addEventListener('beforeunload', abandonmentHandler);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        abandonmentHandler();
      }
    });

    // Store cleanup functions
    this.eventListeners.push(() => {
      inputs.forEach(input => {
        input.removeEventListener('focus', fieldHandler);
        input.removeEventListener('blur', fieldHandler);
        input.removeEventListener('invalid', fieldHandler);
      });
      form.removeEventListener('submit', submitHandler);
      window.removeEventListener('beforeunload', abandonmentHandler);
    });
  }

  private setupSocialMediaTracking(): void {
    // Track social media links
    const socialLinks = document.querySelectorAll('a[href*="linkedin.com"], a[href*="github.com"], a[href*="twitter.com"], a[href*="instagram.com"], a[href*="facebook.com"], a[href*="youtube.com"]');
    
    socialLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const platform = this.extractPlatformFromUrl(href);
      
      if (platform) {
        // Initialize platform metrics if not exists
        if (!this.socialMetrics.has(platform)) {
          this.socialMetrics.set(platform, {
            platform,
            clicks: 0,
            uniqueClicks: 0,
            clickThroughRate: 0,
            referralTraffic: 0,
            engagementTime: 0,
            conversionEvents: []
          });
        }

        const clickHandler = (event: MouseEvent) => {
          this.trackSocialMediaClick(platform, href);
        };

        link.addEventListener('click', clickHandler);
        this.eventListeners.push(() => {
          link.removeEventListener('click', clickHandler);
        });
      }
    });
  }

  private setupResumeTracking(): void {
    // Track resume download links
    const resumeLinks = document.querySelectorAll('a[href*=".pdf"], a[download*="resume"], a[download*="cv"], a[href*="resume"], a[href*="cv"]');
    
    resumeLinks.forEach(link => {
      const clickHandler = (event: MouseEvent) => {
        const href = link.getAttribute('href') || '';
        const source = document.referrer || 'direct';
        this.trackResumeDownload(href, source);
      };

      link.addEventListener('click', clickHandler);
      this.eventListeners.push(() => {
        link.removeEventListener('click', clickHandler);
      });
    });
  }

  private setupGoalTracking(): void {
    // Check goals periodically
    const checkGoals = () => {
      this.goals.forEach(goal => {
        if (goal.active && goal.current >= goal.target) {
          this.triggerGoalCompletion(goal);
        }
      });
    };

    setInterval(checkGoals, 60000); // Check every minute
  }

  // Contact Form Tracking Methods
  trackFormView(formId: string): void {
    const metrics = this.contactForms.get(formId);
    if (metrics) {
      metrics.views++;
      this.updateFormMetrics(formId, metrics);
    }
  }

  trackFormStart(formId: string): void {
    const metrics = this.contactForms.get(formId);
    if (metrics) {
      metrics.starts++;
      this.updateFormMetrics(formId, metrics);
    }
  }

  trackFormSubmission(formId: string, completionTime: number): void {
    const metrics = this.contactForms.get(formId);
    if (metrics) {
      metrics.submissions++;
      metrics.completions++;
      
      // Update average completion time
      const totalTime = metrics.averageTimeToComplete * (metrics.completions - 1) + completionTime;
      metrics.averageTimeToComplete = totalTime / metrics.completions;
      
      // Update conversion rate
      metrics.conversionRate = (metrics.submissions / metrics.views) * 100;
      
      this.updateFormMetrics(formId, metrics);
      
      // Update lead metrics
      this.leadMetrics.totalLeads++;
      this.updateLeadMetrics();
      
      // Check goals
      this.updateGoalProgress('contact_form', 1);
      
      // Send real-time update
      this.webSocketService.send({
        type: 'form_submission',
        data: {
          formId,
          timestamp: Date.now(),
          conversionRate: metrics.conversionRate
        },
        timestamp: Date.now(),
        id: `form-submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    }
  }

  trackFormAbandonment(formId: string, fieldName: string): void {
    const metrics = this.contactForms.get(formId);
    if (metrics) {
      const existingPoint = metrics.abandonmentPoints.find(point => point.fieldName === fieldName);
      if (existingPoint) {
        existingPoint.abandonments++;
      } else {
        metrics.abandonmentPoints.push({
          fieldName,
          abandonments: 1
        });
      }
      
      this.updateFormMetrics(formId, metrics);
    }
  }

  trackValidationError(formId: string, fieldName: string, errorType: string): void {
    const metrics = this.contactForms.get(formId);
    if (metrics) {
      const existingError = metrics.validationErrors.find(
        error => error.fieldName === fieldName && error.errorType === errorType
      );
      
      if (existingError) {
        existingError.count++;
      } else {
        metrics.validationErrors.push({
          fieldName,
          errorType,
          count: 1
        });
      }
      
      this.updateFormMetrics(formId, metrics);
    }
  }

  // Resume Download Tracking
  trackResumeDownload(url: string, source: string): void {
    this.resumeMetrics.totalDownloads++;
    
    // Track unique downloads (simplified - in real app, use user ID or session)
    const uniqueKey = `${url}-${source}-${new Date().toDateString()}`;
    const existingDownload = localStorage.getItem(`resume_download_${uniqueKey}`);
    if (!existingDownload) {
      this.resumeMetrics.uniqueDownloads++;
      localStorage.setItem(`resume_download_${uniqueKey}`, 'true');
    }
    
    // Track by source
    const sourceMetric = this.resumeMetrics.downloadsBySource.find(s => s.source === source);
    if (sourceMetric) {
      sourceMetric.downloads++;
    } else {
      this.resumeMetrics.downloadsBySource.push({ source, downloads: 1 });
    }
    
    // Track by device
    const device = this.getDeviceType();
    const deviceMetric = this.resumeMetrics.downloadsByDevice.find(d => d.device === device);
    if (deviceMetric) {
      deviceMetric.downloads++;
    } else {
      this.resumeMetrics.downloadsByDevice.push({ device, downloads: 1 });
    }
    
    // Track daily trend
    const today = new Date().toISOString().split('T')[0];
    const trendMetric = this.resumeMetrics.downloadTrends.find(t => t.date === today);
    if (trendMetric) {
      trendMetric.downloads++;
    } else {
      this.resumeMetrics.downloadTrends.push({ date: today, downloads: 1 });
    }
    
    // Keep only last 30 days of trends
    if (this.resumeMetrics.downloadTrends.length > 30) {
      this.resumeMetrics.downloadTrends = this.resumeMetrics.downloadTrends.slice(-30);
    }
    
    this.updateResumeMetrics();
    
    // Update goals
    this.updateGoalProgress('resume_download', 1);
    
    // Send real-time update
    this.webSocketService.send({
      type: 'resume_download',
      data: {
        url,
        source,
        timestamp: Date.now(),
        totalDownloads: this.resumeMetrics.totalDownloads
      },
      timestamp: Date.now(),
      id: `resume-download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }

  // Social Media Tracking
  trackSocialMediaClick(platform: string, url: string): void {
    const metrics = this.socialMetrics.get(platform);
    if (metrics) {
      metrics.clicks++;
      
      // Track unique clicks (simplified)
      const uniqueKey = `${platform}-${new Date().toDateString()}`;
      const existingClick = localStorage.getItem(`social_click_${uniqueKey}`);
      if (!existingClick) {
        metrics.uniqueClicks++;
        localStorage.setItem(`social_click_${uniqueKey}`, 'true');
      }
      
      // Calculate CTR (simplified - would need impression data in real app)
      metrics.clickThroughRate = (metrics.uniqueClicks / Math.max(metrics.clicks, 1)) * 100;
      
      this.updateSocialMetrics(platform, metrics);
      
      // Update goals
      this.updateGoalProgress('social_click', 1);
      
      // Send real-time update
      this.webSocketService.send({
        type: 'social_media_click',
        data: {
          platform,
          url,
          timestamp: Date.now(),
          totalClicks: metrics.clicks
        },
        timestamp: Date.now(),
        id: `social-click-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    }
  }

  // Goal Management
  createGoal(goal: Omit<ProfessionalGoal, 'id' | 'createdAt'>): string {
    const id = `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newGoal: ProfessionalGoal = {
      ...goal,
      id,
      createdAt: new Date()
    };
    
    this.goals.set(id, newGoal);
    this.saveGoals();
    
    return id;
  }

  updateGoalProgress(type: ProfessionalGoal['type'], increment: number): void {
    this.goals.forEach(goal => {
      if (goal.active && goal.type === type) {
        goal.current += increment;
        
        if (goal.current >= goal.target) {
          this.triggerGoalCompletion(goal);
        }
      }
    });
    
    this.saveGoals();
  }

  private triggerGoalCompletion(goal: ProfessionalGoal): void {
    console.log(`Goal completed: ${goal.name}`);
    
    // Send real-time notification
    this.webSocketService.send({
      type: 'goal_completion',
      data: {
        goalId: goal.id,
        goalName: goal.name,
        target: goal.target,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      id: `goal-completion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }

  // Conversion Funnel Tracking
  createConversionFunnel(funnel: Omit<ConversionFunnel, 'id'>): string {
    const id = `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFunnel: ConversionFunnel = {
      ...funnel,
      id
    };
    
    this.conversionFunnels.set(id, newFunnel);
    this.saveConversionFunnels();
    
    return id;
  }

  trackFunnelStep(funnelId: string, stepIndex: number): void {
    const funnel = this.conversionFunnels.get(funnelId);
    if (funnel && funnel.steps[stepIndex]) {
      funnel.steps[stepIndex].users++;
      
      // Recalculate conversion rates
      for (let i = 0; i < funnel.steps.length; i++) {
        const step = funnel.steps[i];
        if (i === 0) {
          step.conversionRate = 100; // First step is always 100%
          funnel.totalUsers = step.users;
        } else {
          const previousStep = funnel.steps[i - 1];
          step.conversionRate = previousStep.users > 0 ? (step.users / previousStep.users) * 100 : 0;
        }
      }
      
      // Calculate overall completion rate
      const lastStep = funnel.steps[funnel.steps.length - 1];
      funnel.completionRate = funnel.totalUsers > 0 ? (lastStep.users / funnel.totalUsers) * 100 : 0;
      
      this.saveConversionFunnels();
    }
  }

  // Utility Methods
  private extractPlatformFromUrl(url: string): string | null {
    const platforms = {
      'linkedin.com': 'linkedin',
      'github.com': 'github',
      'twitter.com': 'twitter',
      'instagram.com': 'instagram',
      'facebook.com': 'facebook',
      'youtube.com': 'youtube'
    };
    
    for (const [domain, platform] of Object.entries(platforms)) {
      if (url.includes(domain)) {
        return platform;
      }
    }
    
    return null;
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Data Access Methods
  getContactFormMetrics(formId?: string): ContactFormMetrics[] {
    if (formId) {
      const metrics = this.contactForms.get(formId);
      return metrics ? [metrics] : [];
    }
    return Array.from(this.contactForms.values());
  }

  getResumeMetrics(): ResumeDownloadMetrics {
    return { ...this.resumeMetrics };
  }

  getSocialMediaMetrics(platform?: string): SocialMediaMetrics[] {
    if (platform) {
      const metrics = this.socialMetrics.get(platform);
      return metrics ? [metrics] : [];
    }
    return Array.from(this.socialMetrics.values());
  }

  getGoals(): ProfessionalGoal[] {
    return Array.from(this.goals.values());
  }

  getConversionFunnels(): ConversionFunnel[] {
    return Array.from(this.conversionFunnels.values());
  }

  getLeadMetrics(): LeadQualityMetrics {
    return { ...this.leadMetrics };
  }

  // Data Persistence
  private updateFormMetrics(formId: string, metrics: ContactFormMetrics): void {
    this.contactForms.set(formId, metrics);
    this.saveContactFormMetrics();
  }

  private updateSocialMetrics(platform: string, metrics: SocialMediaMetrics): void {
    this.socialMetrics.set(platform, metrics);
    this.saveSocialMetrics();
  }

  private updateResumeMetrics(): void {
    this.saveResumeMetrics();
  }

  private updateLeadMetrics(): void {
    this.saveLeadMetrics();
  }

  private saveContactFormMetrics(): void {
    const data: Record<string, ContactFormMetrics> = {};
    this.contactForms.forEach((metrics, id) => {
      data[id] = metrics;
    });
    localStorage.setItem('professional_metrics_forms', JSON.stringify(data));
  }

  private saveResumeMetrics(): void {
    localStorage.setItem('professional_metrics_resume', JSON.stringify(this.resumeMetrics));
  }

  private saveSocialMetrics(): void {
    const data: Record<string, SocialMediaMetrics> = {};
    this.socialMetrics.forEach((metrics, platform) => {
      data[platform] = metrics;
    });
    localStorage.setItem('professional_metrics_social', JSON.stringify(data));
  }

  private saveGoals(): void {
    const data: Record<string, ProfessionalGoal> = {};
    this.goals.forEach((goal, id) => {
      data[id] = goal;
    });
    localStorage.setItem('professional_metrics_goals', JSON.stringify(data));
  }

  private saveConversionFunnels(): void {
    const data: Record<string, ConversionFunnel> = {};
    this.conversionFunnels.forEach((funnel, id) => {
      data[id] = funnel;
    });
    localStorage.setItem('professional_metrics_funnels', JSON.stringify(data));
  }

  private saveLeadMetrics(): void {
    localStorage.setItem('professional_metrics_leads', JSON.stringify(this.leadMetrics));
  }

  // Export Methods
  exportProfessionalMetrics(format: 'json' | 'csv'): string {
    const data = {
      contactForms: Array.from(this.contactForms.values()),
      resumeMetrics: this.resumeMetrics,
      socialMetrics: Array.from(this.socialMetrics.values()),
      goals: Array.from(this.goals.values()),
      conversionFunnels: Array.from(this.conversionFunnels.values()),
      leadMetrics: this.leadMetrics
    };
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    // CSV format (simplified)
    const headers = ['metric_type', 'name', 'value', 'timestamp'];
    const rows: string[][] = [];
    
    // Add contact form data
    data.contactForms.forEach(form => {
      rows.push(['contact_form', form.formName, form.submissions.toString(), new Date().toISOString()]);
    });
    
    // Add resume data
    rows.push(['resume_downloads', 'Total Downloads', data.resumeMetrics.totalDownloads.toString(), new Date().toISOString()]);
    
    // Add social media data
    data.socialMetrics.forEach(social => {
      rows.push(['social_media', social.platform, social.clicks.toString(), new Date().toISOString()]);
    });
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  clearData(): void {
    this.contactForms.clear();
    this.socialMetrics.clear();
    this.goals.clear();
    this.conversionFunnels.clear();
    
    this.resumeMetrics = {
      totalDownloads: 0,
      uniqueDownloads: 0,
      downloadsBySource: [],
      downloadsByDevice: [],
      downloadsByLocation: [],
      downloadTrends: []
    };
    
    this.leadMetrics = {
      totalLeads: 0,
      qualifiedLeads: 0,
      leadSources: [],
      responseTime: { average: 0, median: 0 },
      followUpRate: 0
    };
    
    localStorage.removeItem('professional_metrics_forms');
    localStorage.removeItem('professional_metrics_resume');
    localStorage.removeItem('professional_metrics_social');
    localStorage.removeItem('professional_metrics_goals');
    localStorage.removeItem('professional_metrics_funnels');
    localStorage.removeItem('professional_metrics_leads');
  }

  destroy(): void {
    this.isTracking = false;
    
    // Remove event listeners
    this.eventListeners.forEach(removeListener => removeListener());
    this.eventListeners = [];
    
    console.log('Professional metrics tracking destroyed');
  }
}

export default ProfessionalMetricsService;
import { BaseAPIClient } from './BaseAPIClient';
import {
  EmailConfig,
  EmailMessage,
  EmailTemplate,
  EmailAttachment,
  EmailRecipient,
  EmailCampaign,
  EmailStats,
  EmailError,
  APIResponse
} from './types';

/**
 * Email Service
 * Provides comprehensive email functionality
 * Features:
 * - Transactional emails
 * - Template management
 * - Bulk email campaigns
 * - Email tracking and analytics
 * - Attachment handling
 * - Bounce and complaint management
 * - A/B testing
 * - Scheduling
 */
export class EmailService extends BaseAPIClient {
  private emailConfig: EmailConfig;
  private templates: Map<string, EmailTemplate>;
  private campaigns: Map<string, EmailCampaign>;
  private stats: EmailStats;

  constructor(config: EmailConfig) {
    super({
      baseURL: config.apiEndpoint || 'https://api.emailservice.com',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Email-Provider': config.provider || 'custom'
      },
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      rateLimit: {
        requests: config.rateLimit?.requests || 100,
        window: config.rateLimit?.window || 60000
      }
    });

    this.emailConfig = {
      provider: 'sendgrid',
      defaultFrom: {
        email: 'noreply@example.com',
        name: 'Learner Files'
      },
      enableTracking: true,
      enableClickTracking: true,
      enableOpenTracking: true,
      enableUnsubscribeTracking: true,

      enableSpamChecking: true,
      maxAttachmentSize: 25 * 1024 * 1024, // 25MB
      allowedAttachmentTypes: [
        'pdf', 'doc', 'docx', 'txt', 'rtf',
        'jpg', 'jpeg', 'png', 'gif',
        'zip', 'rar', '7z'
      ],
      ...config
    };

    this.templates = new Map();
    this.campaigns = new Map();
    this.stats = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      complained: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0
    };

    // Add email-specific interceptors
    this.addRequestInterceptor({
      onRequest: async (request) => {
        // Add provider-specific headers
        if (this.emailConfig.provider === 'sendgrid') {
          request.headers = {
            ...request.headers,
            'X-SMTPAPI': JSON.stringify({
              category: ['transactional']
            })
          };
        }
        return request;
      },
      onRequestError: async (error) => {
        console.error('Email request error:', error);
        return error;
      }
    });

    this.addResponseInterceptor({
      onResponse: async (response) => {
        // Update stats from response
        if (response.data && typeof response.data === 'object' && 'stats' in response.data) {
          this.updateStats(response.data.stats as Partial<EmailStats>);
        }
        return response;
      },
      onResponseError: async (error) => {
        return this.handleEmailError(error);
      }
    });
  }

  /**
   * Send a single email
   */
  async sendEmail(message: EmailMessage): Promise<{
    messageId: string;
    status: 'sent' | 'queued' | 'failed';
    timestamp: number;
  }> {
    try {
      // Validate message
      this.validateEmailMessage(message);

      // Process attachments
      const processedMessage = await this.processAttachments(message);

      // Apply default settings
      const finalMessage = {
        from: message.from || this.emailConfig.defaultFrom,
        tracking: {
          openTracking: message.tracking?.openTracking ?? this.emailConfig.enableOpenTracking,
          clickTracking: message.tracking?.clickTracking ?? this.emailConfig.enableClickTracking,
          unsubscribeTracking: message.tracking?.unsubscribeTracking ?? this.emailConfig.enableUnsubscribeTracking
        },
        ...processedMessage
      };

      // Send email
      const response = await this.post<{
        messageId: string;
        status: 'sent' | 'queued' | 'failed';
        timestamp: number;
      }>('/send', finalMessage);

      // Update stats
      this.stats.sent++;

      return response.data;

    } catch (error) {
      throw this.handleEmailError(error);
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(
    messages: EmailMessage[],
    options?: {
      batchSize?: number;
      delayBetweenBatches?: number;
      continueOnError?: boolean;
    }
  ): Promise<{
    successful: number;
    failed: number;
    results: Array<{
      messageId?: string;
      status: 'sent' | 'queued' | 'failed';
      error?: string;
    }>;
  }> {
    const batchSize = options?.batchSize || 100;
    const delay = options?.delayBetweenBatches || 1000;
    const continueOnError = options?.continueOnError ?? true;

    const results: Array<{
      messageId?: string;
      status: 'sent' | 'queued' | 'failed';
      error?: string;
    }> = [];

    let successful = 0;
    let failed = 0;

    // Process in batches
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      
      try {
        const batchResponse = await this.post<{
          results: Array<{
            messageId?: string;
            status: 'sent' | 'queued' | 'failed';
            error?: string;
          }>;
        }>('/send-bulk', {
          messages: batch,
          options: {
            tracking: {
              openTracking: this.emailConfig.enableOpenTracking,
              clickTracking: this.emailConfig.enableClickTracking,
              unsubscribeTracking: this.emailConfig.enableUnsubscribeTracking
            }
          }
        });

        // Process batch results
        for (const result of batchResponse.data.results) {
          results.push(result);
          if (result.status === 'sent' || result.status === 'queued') {
            successful++;
          } else {
            failed++;
          }
        }

        // Delay between batches
        if (i + batchSize < messages.length && delay > 0) {
          await this.sleep(delay);
        }

      } catch (error) {
        // Handle batch error
        const batchResults = batch.map(() => ({
          status: 'failed' as const,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
        
        results.push(...batchResults);
        failed += batch.length;

        if (!continueOnError) {
          throw error;
        }
      }
    }

    // Update stats
    this.stats.sent += successful;

    return {
      successful,
      failed,
      results
    };
  }

  /**
   * Send email using template
   */
  async sendTemplateEmail(
    templateId: string,
    to: EmailRecipient | EmailRecipient[],
    templateData: Record<string, any>,
    options?: {
      from?: EmailRecipient;
      subject?: string;
      scheduledAt?: Date;
      tracking?: {
        openTracking?: boolean;
        clickTracking?: boolean;
        unsubscribeTracking?: boolean;
      };
    }
  ): Promise<{
    messageId: string;
    status: 'sent' | 'queued' | 'scheduled' | 'failed';
    timestamp: number;
  }> {
    const message: EmailMessage = {
      to: Array.isArray(to) ? to : [to],
      from: options?.from || this.emailConfig.defaultFrom,
      templateId,
      templateData,
      subject: options?.subject,
      scheduledAt: options?.scheduledAt,
      tracking: options?.tracking
    };

    return this.sendEmail(message);
  }

  /**
   * Template Management
   */
  async createTemplate(template: {
    name: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    variables?: string[];
    category?: string;
  }): Promise<EmailTemplate> {
    const response = await this.post<EmailTemplate>('/templates', template);
    const createdTemplate = response.data;
    
    this.templates.set(createdTemplate.id, createdTemplate);
    return createdTemplate;
  }

  async updateTemplate(
    templateId: string,
    updates: Partial<EmailTemplate>
  ): Promise<EmailTemplate> {
    const response = await this.patch<EmailTemplate>(`/templates/${templateId}`, updates);
    const updatedTemplate = response.data;
    
    this.templates.set(templateId, updatedTemplate);
    return updatedTemplate;
  }

  async getTemplate(templateId: string): Promise<EmailTemplate> {
    // Check cache first
    const cached = this.templates.get(templateId);
    if (cached) {
      return cached;
    }

    const response = await this.get<EmailTemplate>(`/templates/${templateId}`);
    const template = response.data;
    
    this.templates.set(templateId, template);
    return template;
  }

  async listTemplates(
    options?: {
      category?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    templates: EmailTemplate[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await this.get<{
      templates: EmailTemplate[];
      total: number;
      page: number;
      limit: number;
    }>('/templates', { params: options });
    
    // Cache templates
    response.data.templates.forEach(template => {
      this.templates.set(template.id, template);
    });
    
    return response.data;
  }

  async deleteTemplate(templateId: string): Promise<void> {
    await this.delete(`/templates/${templateId}`);
    this.templates.delete(templateId);
  }

  /**
   * Campaign Management
   */
  async createCampaign(campaign: {
    name: string;
    subject: string;
    templateId?: string;
    htmlContent?: string;
    textContent?: string;
    recipients: EmailRecipient[];
    scheduledAt?: Date;
    abTest?: {
      enabled: boolean;
      subjectVariants?: string[];
      contentVariants?: string[];
      testPercentage?: number;
    };
  }): Promise<EmailCampaign> {
    const response = await this.post<EmailCampaign>('/campaigns', campaign);
    const createdCampaign = response.data;
    
    this.campaigns.set(createdCampaign.id, createdCampaign);
    return createdCampaign;
  }

  async sendCampaign(campaignId: string): Promise<{
    campaignId: string;
    status: 'sent' | 'scheduled' | 'failed';
    recipientCount: number;
    timestamp: number;
  }> {
    const response = await this.post<{
      campaignId: string;
      status: 'sent' | 'scheduled' | 'failed';
      recipientCount: number;
      timestamp: number;
    }>(`/campaigns/${campaignId}/send`);
    
    return response.data;
  }

  async getCampaignStats(campaignId: string): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    const response = await this.get<{
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      complained: number;
      unsubscribed: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
    }>(`/campaigns/${campaignId}/stats`);
    
    return response.data;
  }

  /**
   * Email Tracking and Analytics
   */
  async getEmailStats(
    timeframe?: {
      startDate: Date;
      endDate: Date;
    }
  ): Promise<EmailStats & {
    openRate: number;
    clickRate: number;
    bounceRate: number;
    complaintRate: number;
    unsubscribeRate: number;
  }> {
    const response = await this.get<EmailStats & {
      openRate: number;
      clickRate: number;
      bounceRate: number;
      complaintRate: number;
      unsubscribeRate: number;
    }>('/stats', {
      params: timeframe ? {
        startDate: timeframe.startDate.toISOString(),
        endDate: timeframe.endDate.toISOString()
      } : undefined
    });
    
    this.updateStats(response.data);
    return response.data;
  }

  async getMessageStatus(messageId: string): Promise<{
    messageId: string;
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
    events: Array<{
      type: string;
      timestamp: number;
      data?: Record<string, any>;
    }>;
  }> {
    const response = await this.get<{
      messageId: string;
      status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
      events: Array<{
        type: string;
        timestamp: number;
        data?: Record<string, any>;
      }>;
    }>(`/messages/${messageId}/status`);
    
    return response.data;
  }

  /**
   * Bounce and Complaint Handling
   */
  async getBounces(
    options?: {
      startDate?: Date;
      endDate?: Date;
      type?: 'hard' | 'soft';
      page?: number;
      limit?: number;
    }
  ): Promise<{
    bounces: Array<{
      email: string;
      type: 'hard' | 'soft';
      reason: string;
      timestamp: number;
      messageId?: string;
    }>;
    total: number;
  }> {
    const response = await this.get<{
      bounces: Array<{
        email: string;
        type: 'hard' | 'soft';
        reason: string;
        timestamp: number;
        messageId?: string;
      }>;
      total: number;
    }>('/bounces', { params: options });
    
    return response.data;
  }

  async getComplaints(
    options?: {
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    complaints: Array<{
      email: string;
      reason?: string;
      timestamp: number;
      messageId?: string;
    }>;
    total: number;
  }> {
    const response = await this.get<{
      complaints: Array<{
        email: string;
        reason?: string;
        timestamp: number;
        messageId?: string;
      }>;
      total: number;
    }>('/complaints', { params: options });
    
    return response.data;
  }

  async suppressEmail(
    email: string,
    reason: 'bounce' | 'complaint' | 'unsubscribe' | 'manual'
  ): Promise<void> {
    await this.post('/suppressions', {
      email,
      reason,
      timestamp: Date.now()
    });
  }

  async unsuppressEmail(email: string): Promise<void> {
    await this.delete(`/suppressions/${encodeURIComponent(email)}`);
  }

  /**
   * Utility Methods
   */
  private validateEmailMessage(message: EmailMessage): void {
    if (!message.to || message.to.length === 0) {
      throw new Error('Email message must have at least one recipient');
    }

    if (!message.subject && !message.templateId) {
      throw new Error('Email message must have a subject or template ID');
    }

    if (!message.htmlContent && !message.textContent && !message.templateId) {
      throw new Error('Email message must have content or template ID');
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allRecipients = [
      ...message.to,
      ...(message.cc || []),
      ...(message.bcc || [])
    ];

    for (const recipient of allRecipients) {
      const email = typeof recipient === 'string' ? recipient : recipient.email;
      if (!emailRegex.test(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    }

    // Validate attachments
    if (message.attachments) {
      for (const attachment of message.attachments) {
        if (attachment.size > this.emailConfig.maxAttachmentSize) {
          throw new Error(`Attachment ${attachment.filename} exceeds maximum size`);
        }

        const extension = attachment.filename.split('.').pop()?.toLowerCase();
        if (extension && !this.emailConfig.allowedAttachmentTypes.includes(extension)) {
          throw new Error(`Attachment type ${extension} is not allowed`);
        }
      }
    }
  }

  private async processAttachments(message: EmailMessage): Promise<EmailMessage> {
    if (!message.attachments || message.attachments.length === 0) {
      return message;
    }

    const processedAttachments: EmailAttachment[] = [];

    for (const attachment of message.attachments) {
      if (attachment.content) {
        // Content is already provided
        processedAttachments.push(attachment);
      } else if (attachment.url) {
        // Download content from URL
        try {
          const response = await fetch(attachment.url);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
          processedAttachments.push({
            ...attachment,
            content: base64,
            size: arrayBuffer.byteLength,
            contentType: blob.type || attachment.contentType
          });
        } catch (error) {
          throw new Error(`Failed to download attachment from ${attachment.url}: ${error}`);
        }
      } else {
        throw new Error(`Attachment ${attachment.filename} must have either content or url`);
      }
    }

    return {
      ...message,
      attachments: processedAttachments
    };
  }

  private updateStats(newStats: Partial<EmailStats>): void {
    Object.assign(this.stats, newStats);
  }

  private handleEmailError(error: any): EmailError {
    if (error.status === 400) {
      return {
        message: 'Invalid email request',
        status: 400,
        code: 'INVALID_REQUEST',
        type: 'validation_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false,
        retryable: false
      };
    }

    if (error.status === 401) {
      return {
        message: 'Invalid API credentials',
        status: 401,
        code: 'UNAUTHORIZED',
        type: 'authentication_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false,
        retryable: false
      };
    }

    if (error.status === 429) {
      return {
        message: 'Email rate limit exceeded',
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
        type: 'rate_limit_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: true,
        retryable: true
      };
    }

    if (error.status === 402) {
      return {
        message: 'Insufficient email credits',
        status: 402,
        code: 'INSUFFICIENT_CREDITS',
        type: 'billing_error',
        details: error.details,
        timestamp: Date.now(),
        retryCount: error.retryCount || 0,
        isRetryable: false,
        retryable: false
      };
    }

    return {
      message: error.message || 'Unknown email service error',
      status: error.status,
      code: error.code || 'UNKNOWN_ERROR',
      type: 'api_error',
      details: error.details,
      timestamp: Date.now(),
      retryCount: error.retryCount || 0,
      isRetryable: error.isRetryable || false,
      retryable: error.isRetryable || false
    };
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Public utility methods
   */
  getCurrentStats(): EmailStats {
    return { ...this.stats };
  }

  getCachedTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  getCachedCampaigns(): EmailCampaign[] {
    return Array.from(this.campaigns.values());
  }

  clearCache(): void {
    this.templates.clear();
    this.campaigns.clear();
  }

  /**
   * Convenience methods for common email types
   */
  async sendWelcomeEmail(
    to: EmailRecipient,
    userData: Record<string, any>
  ): Promise<{ messageId: string; status: string; timestamp: number }> {
    return this.sendTemplateEmail('welcome', to, userData);
  }

  async sendPasswordResetEmail(
    to: EmailRecipient,
    resetData: { resetToken: string; resetUrl: string; expiresAt: Date }
  ): Promise<{ messageId: string; status: string; timestamp: number }> {
    return this.sendTemplateEmail('password-reset', to, resetData);
  }

  async sendNotificationEmail(
    to: EmailRecipient,
    notification: {
      title: string;
      message: string;
      actionUrl?: string;
      actionText?: string;
    }
  ): Promise<{ messageId: string; status: string; timestamp: number }> {
    return this.sendTemplateEmail('notification', to, notification);
  }

  async sendReceiptEmail(
    to: EmailRecipient,
    receiptData: {
      orderNumber: string;
      items: Array<{ name: string; price: number; quantity: number }>;
      total: number;
      date: Date;
    }
  ): Promise<{ messageId: string; status: string; timestamp: number }> {
    return this.sendTemplateEmail('receipt', to, receiptData);
  }
}
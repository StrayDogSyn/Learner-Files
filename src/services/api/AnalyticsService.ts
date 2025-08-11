// Temporary stub for AnalyticsService to resolve build issues
// This will be properly implemented after dependency conflicts are resolved

import { AnalyticsConfig, AnalyticsEvent, AnalyticsUser, AnalyticsSession } from './types';

export class AnalyticsService {
  private config: AnalyticsConfig;
  private isInitialized: boolean = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    console.log('AnalyticsService initialized (stub mode)');
  }

  public initialize(): void {
    this.isInitialized = true;
    console.log('Analytics service initialized');
  }

  public track(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }
    console.log('Tracking event:', event.name);
  }

  public page(page: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }
    console.log('Tracking page view:', page);
  }

  public identify(user: AnalyticsUser): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }
    console.log('Identifying user:', user.id);
  }

  public startSession(session: AnalyticsSession): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }
    console.log('Starting session:', session.id);
  }

  public endSession(sessionId: string): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }
    console.log('Ending session:', sessionId);
  }

  public flush(): void {
    console.log('Flushing analytics data');
  }

  public reset(): void {
    console.log('Resetting analytics service');
  }

  public getConfig(): AnalyticsConfig {
    return this.config;
  }

  public updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Analytics config updated');
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getSessionId(): string | null {
    return 'stub-session-id';
  }

  public getUserId(): string | null {
    return 'stub-user-id';
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    console.log('Tracking error:', error.message);
  }

  public trackPerformance(metric: string, value: number, context?: Record<string, any>): void {
    console.log('Tracking performance metric:', metric, value);
  }

  public trackConversion(event: string, value?: number, context?: Record<string, any>): void {
    console.log('Tracking conversion:', event, value);
  }

  public setUserProperty(property: string, value: any): void {
    console.log('Setting user property:', property, value);
  }

  public incrementUserProperty(property: string, value: number = 1): void {
    console.log('Incrementing user property:', property, value);
  }

  public trackRevenue(amount: number, currency: string = 'USD', context?: Record<string, any>): void {
    console.log('Tracking revenue:', amount, currency);
  }

  public createCohort(name: string, criteria: Record<string, any>): void {
    console.log('Creating cohort:', name);
  }

  public addToCohort(cohortName: string, userId: string): void {
    console.log('Adding user to cohort:', cohortName, userId);
  }

  public removeFromCohort(cohortName: string, userId: string): void {
    console.log('Removing user from cohort:', cohortName, userId);
  }

  public trackFunnel(step: string, funnelName: string, context?: Record<string, any>): void {
    console.log('Tracking funnel step:', step, funnelName);
  }

  public startTimer(name: string): void {
    console.log('Starting timer:', name);
  }

  public stopTimer(name: string, context?: Record<string, any>): void {
    console.log('Stopping timer:', name);
  }

  public alias(newId: string, originalId?: string): void {
    console.log('Creating alias:', newId, originalId);
  }

  public group(groupId: string, traits?: Record<string, any>): void {
    console.log('Grouping user:', groupId);
  }

  public trackABTest(testName: string, variant: string, context?: Record<string, any>): void {
    console.log('Tracking A/B test:', testName, variant);
  }

  public getABTestVariant(testName: string): string | null {
    return 'control';
  }

  public enableDebugMode(): void {
    console.log('Debug mode enabled');
  }

  public disableDebugMode(): void {
    console.log('Debug mode disabled');
  }

  public getDebugInfo(): Record<string, any> {
    return {
      initialized: this.isInitialized,
      config: this.config,
      mode: 'stub'
    };
  }
}

export default AnalyticsService;
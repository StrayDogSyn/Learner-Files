// A/B Testing Framework for CTA Optimization

import analytics from './analytics';

// Test Configuration Types
interface ABTestConfig {
  testId: string;
  testName: string;
  description?: string;
  variants: ABTestVariant[];
  trafficAllocation: number; // Percentage of users to include in test (0-100)
  conversionGoals: ConversionGoal[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  targetAudience?: TargetAudience;
}

interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // Percentage allocation (should sum to 100 across all variants)
  config: Record<string, any>; // Variant-specific configuration
}

interface ConversionGoal {
  id: string;
  name: string;
  type: 'click' | 'form_submit' | 'page_view' | 'custom';
  selector?: string; // CSS selector for click goals
  eventName?: string; // Custom event name
  value?: number; // Conversion value
}

interface TargetAudience {
  countries?: string[];
  devices?: ('desktop' | 'mobile' | 'tablet')[];
  browsers?: string[];
  newUsers?: boolean;
  returningUsers?: boolean;
}

// Test Results Types
interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: Date;
  conversions: ConversionEvent[];
}

interface ConversionEvent {
  goalId: string;
  timestamp: Date;
  value?: number;
  metadata?: Record<string, any>;
}

// Statistical Analysis Types
interface StatisticalResult {
  variant: string;
  conversions: number;
  visitors: number;
  conversionRate: number;
  confidence: number;
  isSignificant: boolean;
  uplift?: number; // Compared to control
}

class ABTestingFramework {
  private tests: Map<string, ABTestConfig> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId
  private results: ABTestResult[] = [];
  private storageKey = 'ab_test_assignments';

  constructor() {
    this.loadUserAssignments();
    this.initializeDefaultTests();
  }

  // Load user assignments from localStorage
  private loadUserAssignments(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const assignments = JSON.parse(stored);
        this.userAssignments = new Map(Object.entries(assignments).map(([userId, tests]) => [
          userId,
          new Map(Object.entries(tests as Record<string, string>))
        ]));
      }
    } catch (error) {
      console.error('Failed to load A/B test assignments:', error);
    }
  }

  // Save user assignments to localStorage
  private saveUserAssignments(): void {
    try {
      const assignments: Record<string, Record<string, string>> = {};
      this.userAssignments.forEach((tests, userId) => {
        assignments[userId] = Object.fromEntries(tests);
      });
      localStorage.setItem(this.storageKey, JSON.stringify(assignments));
    } catch (error) {
      console.error('Failed to save A/B test assignments:', error);
    }
  }

  // Initialize default tests
  private initializeDefaultTests(): void {
    // CTA Button Test
    this.createTest({
      testId: 'cta_button_optimization',
      testName: 'CTA Button Optimization',
      description: 'Test different CTA button styles and copy',
      variants: [
        {
          id: 'control',
          name: 'Original Button',
          weight: 50,
          config: {
            text: 'Get In Touch',
            style: 'primary',
            size: 'medium'
          }
        },
        {
          id: 'variant_a',
          name: 'Urgent CTA',
          weight: 50,
          config: {
            text: 'Let\'s Work Together!',
            style: 'gradient',
            size: 'large'
          }
        }
      ],
      trafficAllocation: 100,
      conversionGoals: [
        {
          id: 'contact_click',
          name: 'Contact Button Click',
          type: 'click',
          selector: '[data-testid="contact-cta"]'
        },
        {
          id: 'form_submit',
          name: 'Contact Form Submit',
          type: 'form_submit',
          value: 10
        }
      ],
      startDate: new Date(),
      isActive: true
    });

    // Hero Section Test
    this.createTest({
      testId: 'hero_section_optimization',
      testName: 'Hero Section Optimization',
      description: 'Test different hero section layouts and messaging',
      variants: [
        {
          id: 'control',
          name: 'Original Hero',
          weight: 33,
          config: {
            headline: 'Full-Stack Developer & UI/UX Designer',
            subheadline: 'Creating digital experiences that matter',
            layout: 'centered'
          }
        },
        {
          id: 'variant_a',
          name: 'Problem-Focused Hero',
          weight: 33,
          config: {
            headline: 'Turn Your Ideas Into Reality',
            subheadline: 'I help businesses build powerful web applications',
            layout: 'left-aligned'
          }
        },
        {
          id: 'variant_b',
          name: 'Results-Focused Hero',
          weight: 34,
          config: {
            headline: 'Delivered 50+ Successful Projects',
            subheadline: 'Trusted by startups and enterprises worldwide',
            layout: 'split'
          }
        }
      ],
      trafficAllocation: 80,
      conversionGoals: [
        {
          id: 'portfolio_view',
          name: 'Portfolio Section View',
          type: 'page_view'
        },
        {
          id: 'contact_engagement',
          name: 'Contact Engagement',
          type: 'custom',
          eventName: 'contact_form_submit'
        }
      ],
      startDate: new Date(),
      isActive: true
    });
  }

  // Create a new A/B test
  createTest(config: ABTestConfig): void {
    // Validate variant weights sum to 100
    const totalWeight = config.variants.reduce((sum, variant) => sum + variant.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error(`Variant weights must sum to 100, got ${totalWeight}`);
    }

    this.tests.set(config.testId, config);
  }

  // Get user ID (create if doesn't exist)
  private getUserId(): string {
    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('ab_test_user_id', userId);
    }
    return userId;
  }

  // Check if user should be included in test
  private shouldIncludeUser(test: ABTestConfig): boolean {
    const userId = this.getUserId();
    const hash = this.hashString(userId + test.testId);
    const percentage = (hash % 100) + 1;
    return percentage <= test.trafficAllocation;
  }

  // Simple hash function for consistent user assignment
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Assign user to variant
  private assignUserToVariant(testId: string): string | null {
    const test = this.tests.get(testId);
    if (!test || !test.isActive) return null;

    const userId = this.getUserId();
    
    // Check if user already assigned
    const userTests = this.userAssignments.get(userId);
    if (userTests?.has(testId)) {
      return userTests.get(testId) || null;
    }

    // Check if user should be included
    if (!this.shouldIncludeUser(test)) {
      return null;
    }

    // Assign to variant based on weighted distribution
    const hash = this.hashString(userId + testId + 'variant');
    const percentage = hash % 100;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (percentage < cumulativeWeight) {
        // Store assignment
        if (!this.userAssignments.has(userId)) {
          this.userAssignments.set(userId, new Map());
        }
        this.userAssignments.get(userId)!.set(testId, variant.id);
        this.saveUserAssignments();
        
        // Track assignment event
        analytics.trackEvent('ab_test_assignment', {
          test_id: testId,
          variant_id: variant.id,
          user_id: userId
        });
        
        return variant.id;
      }
    }
    
    return null;
  }

  // Get variant for user
  getVariant(testId: string): ABTestVariant | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    const variantId = this.assignUserToVariant(testId);
    if (!variantId) return null;

    return test.variants.find(v => v.id === variantId) || null;
  }

  // Get variant configuration
  getVariantConfig(testId: string): Record<string, any> | null {
    const variant = this.getVariant(testId);
    return variant?.config || null;
  }

  // Track conversion
  trackConversion(testId: string, goalId: string, value?: number, metadata?: Record<string, any>): void {
    const userId = this.getUserId();
    const userTests = this.userAssignments.get(userId);
    const variantId = userTests?.get(testId);
    
    if (!variantId) return; // User not in test

    const conversion: ConversionEvent = {
      goalId,
      timestamp: new Date(),
      value,
      metadata
    };

    // Find or create result record
    let result = this.results.find(r => 
      r.testId === testId && r.variantId === variantId && r.userId === userId
    );
    
    if (!result) {
      result = {
        testId,
        variantId,
        userId,
        timestamp: new Date(),
        conversions: []
      };
      this.results.push(result);
    }
    
    result.conversions.push(conversion);
    
    // Track in analytics
    analytics.trackEvent('ab_test_conversion', {
      test_id: testId,
      variant_id: variantId,
      goal_id: goalId,
      value: value,
      user_id: userId
    });
  }

  // Get test results with statistical analysis
  getTestResults(testId: string): StatisticalResult[] {
    const test = this.tests.get(testId);
    if (!test) return [];

    const results: StatisticalResult[] = [];
    const controlVariant = test.variants.find(v => v.id === 'control');
    
    for (const variant of test.variants) {
      const variantResults = this.results.filter(r => 
        r.testId === testId && r.variantId === variant.id
      );
      
      const visitors = variantResults.length;
      const conversions = variantResults.filter(r => r.conversions.length > 0).length;
      const conversionRate = visitors > 0 ? (conversions / visitors) * 100 : 0;
      
      // Calculate statistical significance (simplified)
      const confidence = this.calculateConfidence(conversions, visitors);
      const isSignificant = confidence > 95;
      
      // Calculate uplift compared to control
      let uplift: number | undefined;
      if (controlVariant && variant.id !== 'control') {
        const controlResults = this.results.filter(r => 
          r.testId === testId && r.variantId === 'control'
        );
        const controlVisitors = controlResults.length;
        const controlConversions = controlResults.filter(r => r.conversions.length > 0).length;
        const controlRate = controlVisitors > 0 ? (controlConversions / controlVisitors) * 100 : 0;
        
        if (controlRate > 0) {
          uplift = ((conversionRate - controlRate) / controlRate) * 100;
        }
      }
      
      results.push({
        variant: variant.name,
        conversions,
        visitors,
        conversionRate,
        confidence,
        isSignificant,
        uplift
      });
    }
    
    return results;
  }

  // Simplified confidence calculation
  private calculateConfidence(conversions: number, visitors: number): number {
    if (visitors < 30) return 0; // Need minimum sample size
    
    const rate = conversions / visitors;
    const standardError = Math.sqrt((rate * (1 - rate)) / visitors);
    const zScore = Math.abs(rate - 0.5) / standardError;
    
    // Simplified confidence calculation
    if (zScore > 2.58) return 99;
    if (zScore > 1.96) return 95;
    if (zScore > 1.65) return 90;
    if (zScore > 1.28) return 80;
    return Math.max(0, Math.min(100, zScore * 40));
  }

  // Get all active tests
  getActiveTests(): ABTestConfig[] {
    return Array.from(this.tests.values()).filter(test => test.isActive);
  }

  // Stop a test
  stopTest(testId: string): void {
    const test = this.tests.get(testId);
    if (test) {
      test.isActive = false;
      test.endDate = new Date();
    }
  }

  // Export results for analysis
  exportResults(testId?: string): any {
    const resultsToExport = testId 
      ? this.results.filter(r => r.testId === testId)
      : this.results;
    
    return {
      timestamp: new Date().toISOString(),
      tests: testId ? [this.tests.get(testId)] : Array.from(this.tests.values()),
      results: resultsToExport,
      summary: testId ? this.getTestResults(testId) : undefined
    };
  }
}

// React hook for A/B testing
import { useEffect, useState, useCallback } from 'react';

const abTesting = new ABTestingFramework();

export const useABTest = (testId: string) => {
  const [variant, setVariant] = useState<ABTestVariant | null>(null);
  const [config, setConfig] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const testVariant = abTesting.getVariant(testId);
    const testConfig = abTesting.getVariantConfig(testId);
    
    setVariant(testVariant);
    setConfig(testConfig);
  }, [testId]);

  const trackConversion = useCallback((goalId: string, value?: number, metadata?: Record<string, any>) => {
    abTesting.trackConversion(testId, goalId, value, metadata);
  }, [testId]);

  return {
    variant,
    config,
    trackConversion,
    isInTest: variant !== null
  };
};

// Component wrapper for A/B testing
export const ABTestWrapper: React.FC<{
  testId: string;
  children: (variant: ABTestVariant | null, config: Record<string, any> | null) => React.ReactNode;
}> = ({ testId, children }) => {
  const { variant, config } = useABTest(testId);
  return <>{children(variant, config)}</>;
};

export default abTesting;
export type { ABTestConfig, ABTestVariant, ConversionGoal, StatisticalResult };
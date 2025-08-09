# CI/CD Pipeline Documentation

## 1. Overview

This document outlines the comprehensive CI/CD pipeline for the advanced portfolio project, including automated testing, build optimization, security scanning, and deployment strategies.

## 2. GitHub Actions Workflow Structure

### 2.1 Main Deployment Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy Portfolio

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 0'  # Weekly security scans

env:
  NODE_VERSION: '18'
  CACHE_VERSION: 'v1'

jobs:
  # Job 1: Code Quality & Security
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Security audit
        run: npm audit --audit-level=moderate

      - name: CodeQL Analysis
        uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

  # Job 2: Unit & Integration Tests
  test:
    runs-on: ubuntu-latest
    needs: quality-check
    strategy:
      matrix:
        test-type: [unit, integration, accessibility]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ${{ matrix.test-type }} tests
        run: npm run test:${{ matrix.test-type }}

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: ${{ matrix.test-type }}

  # Job 3: E2E Testing
  e2e-test:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start preview server
        run: npm run preview &
        
      - name: Wait for server
        run: npx wait-on http://localhost:4173

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: e2e-artifacts
          path: |
            test-results/
            playwright-report/

  # Job 4: Performance & Lighthouse
  performance:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

      - name: Bundle analyzer
        run: npm run analyze

      - name: Upload bundle analysis
        uses: actions/upload-artifact@v4
        with:
          name: bundle-analysis
          path: dist/stats.html

  # Job 5: Cross-browser Testing
  cross-browser:
    runs-on: ${{ matrix.os }}
    needs: e2e-test
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        browser: [chromium, firefox, webkit]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install ${{ matrix.browser }}

      - name: Build application
        run: npm run build

      - name: Run cross-browser tests
        run: npx playwright test --project=${{ matrix.browser }}

  # Job 6: Build & Deploy
  deploy:
    runs-on: ubuntu-latest
    needs: [quality-check, test, e2e-test, performance]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://your-username.github.io/portfolio
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: your-domain.com

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2.2 Lighthouse Configuration (lighthouserc.json)

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173/"],
      "startServerCommand": "npm run preview",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "categories:pwa": ["error", {"minScore": 0.8}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## 3. Testing Strategy

### 3.1 Unit Testing (Vitest + Testing Library)

```typescript
// Example: Component unit test
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FilterableProjectGrid } from '../FilterableProjectGrid'

describe('FilterableProjectGrid', () => {
  it('filters projects by technology', async () => {
    const mockProjects = [
      { id: '1', name: 'React App', technologies: ['React', 'TypeScript'] },
      { id: '2', name: 'Vue App', technologies: ['Vue', 'JavaScript'] }
    ]

    render(<FilterableProjectGrid projects={mockProjects} />)
    
    const reactFilter = screen.getByRole('button', { name: /react/i })
    fireEvent.click(reactFilter)
    
    expect(screen.getByText('React App')).toBeInTheDocument()
    expect(screen.queryByText('Vue App')).not.toBeInTheDocument()
  })
})
```

### 3.2 Integration Testing

```typescript
// Example: API integration test
import { describe, it, expect, beforeEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { achievementService } from '../services/achievementService'

const server = setupServer(
  rest.post('/api/achievements/unlock', (req, res, ctx) => {
    return res(ctx.json({ success: true, badge: { id: '1', name: 'Test Badge' } }))
  })
)

describe('Achievement Service', () => {
  beforeEach(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('unlocks achievement successfully', async () => {
    const result = await achievementService.unlock('user-1', 'achievement-1')
    expect(result.success).toBe(true)
    expect(result.badge.name).toBe('Test Badge')
  })
})
```

### 3.3 E2E Testing (Playwright)

```typescript
// Example: E2E test
import { test, expect } from '@playwright/test'

test.describe('3D Showcase', () => {
  test('loads 3D models and allows interaction', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to 3D showcase
    await page.click('[data-testid="3d-showcase-link"]')
    
    // Wait for 3D scene to load
    await page.waitForSelector('[data-testid="three-canvas"]')
    
    // Test 3D interaction
    const canvas = page.locator('[data-testid="three-canvas"]')
    await canvas.click({ position: { x: 400, y: 300 } })
    
    // Verify project details appear
    await expect(page.locator('[data-testid="project-details"]')).toBeVisible()
  })

  test('achievement system works', async ({ page }) => {
    await page.goto('/')
    
    // Trigger achievement
    await page.click('[data-testid="3d-showcase-link"]')
    
    // Check for achievement notification
    await expect(page.locator('[data-testid="achievement-notification"]')).toBeVisible()
    
    // Verify achievement in profile
    await page.click('[data-testid="achievements-link"]')
    await expect(page.locator('[data-testid="3d-explorer-badge"]')).toBeVisible()
  })
})
```

### 3.4 Accessibility Testing

```typescript
// Example: Accessibility test
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'main-nav-home')
    
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'main-nav-projects')
  })
})
```

## 4. Performance Optimization

### 4.1 Bundle Analysis Configuration

```typescript
// vite.config.ts - Bundle analyzer
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui': ['framer-motion', 'lucide-react'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
```

### 4.2 PWA Configuration

```typescript
// PWA service worker configuration
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'github-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Advanced Portfolio',
        short_name: 'Portfolio',
        description: 'Interactive 3D Portfolio with Advanced Features',
        theme_color: '#0B1426',
        background_color: '#0B1426',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 5. Monitoring and Analytics

### 5.1 Error Tracking (Sentry)

```typescript
// Sentry configuration
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', /^\//],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      )
    })
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE
})
```

### 5.2 Performance Monitoring

```typescript
// Performance monitoring service
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  measureRender(componentName: string, renderTime: number) {
    this.metrics.set(`render_${componentName}`, renderTime)
    
    // Send to analytics
    this.sendMetric('component_render', {
      component: componentName,
      duration: renderTime
    })
  }

  measure3DPerformance(fps: number, drawCalls: number) {
    this.metrics.set('3d_fps', fps)
    this.metrics.set('3d_draw_calls', drawCalls)
    
    this.sendMetric('3d_performance', { fps, drawCalls })
  }

  private sendMetric(event: string, data: Record<string, any>) {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', event, data)
    }
  }
}
```

## 6. Security Measures

### 6.1 Content Security Policy

```html
<!-- CSP headers in index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.github.com https://*.supabase.co wss://*.supabase.co;
  worker-src 'self' blob:;
">
```

### 6.2 Environment Variables Security

```bash
# .env.example
VITE_GITHUB_TOKEN=your_github_token_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_MEASUREMENT_ID=your_ga_id

# Secrets in GitHub Actions
# GITHUB_TOKEN (automatic)
# SUPABASE_URL
# SUPABASE_ANON_KEY
# SENTRY_DSN
# SLACK_WEBHOOK
```

## 7. Deployment Strategy

### 7.1 Branch Strategy

- **main**: Production branch, auto-deploys to GitHub Pages
- **develop**: Development branch, deploys to staging environment
- **feature/***: Feature branches, run tests but don't deploy

### 7.2 Rollback Strategy

```yaml
# Rollback workflow
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      commit_sha:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout specific commit
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.commit_sha }}

      - name: Setup and build
        # ... setup steps

      - name: Deploy rollback
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 8. Success Metrics

### 8.1 Performance Targets

- **Lighthouse Performance**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

### 8.2 Quality Targets

- **Test Coverage**: > 80%
- **Accessibility Score**: > 95
- **Security Vulnerabilities**: 0 high/critical
- **Bundle Size**: < 500KB gzipped
- **3D Performance**: > 30 FPS on mid-range devices
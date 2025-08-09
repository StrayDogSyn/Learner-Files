# API Integration Layer

A comprehensive, type-safe API integration service for external services including GitHub, Claude AI, Analytics, Codewars, Email, and Weather APIs.

## 🚀 Features

- **GitHub Integration**: Repository stats, commit history, language analysis
- **Claude AI Integration**: AI-powered content generation and analysis
- **Analytics Tracking**: Event tracking, page views, user interactions
- **Codewars Integration**: Coding challenge statistics and achievements
- **Email Service**: Contact form and notification email handling
- **Weather API**: Location-based weather information
- **Advanced Features**:
  - Intelligent caching with TTL
  - Rate limiting protection
  - Request deduplication
  - Error handling with retry logic
  - Health monitoring
  - TypeScript support

## 📁 File Structure

```
src/
├── services/
│   └── apiService.ts          # Main API service implementation
├── types/
│   └── api.ts                 # TypeScript type definitions
├── examples/
│   └── apiServiceExamples.ts  # Usage examples and demos
└── config/
    └── apiConfig.ts           # Configuration helpers
```

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install axios @octokit/rest
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

3. **Import and Use**
   ```typescript
   import apiService from './src/services/apiService';
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GITHUB_TOKEN` | GitHub Personal Access Token | Yes |
| `REACT_APP_CLAUDE_KEY` | Claude AI API Key | Optional |
| `REACT_APP_WEATHER_API_KEY` | OpenWeatherMap API Key | Optional |
| `REACT_APP_ANALYTICS_ENDPOINT` | Analytics service URL | Optional |
| `REACT_APP_DEFAULT_FROM_EMAIL` | Default email sender | Optional |

### Getting API Keys

1. **GitHub Token**: [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Required permissions: `public_repo`, `read:user`

2. **Claude AI Key**: [Anthropic Console](https://console.anthropic.com/)
   - Sign up for Claude API access

3. **Weather API Key**: [OpenWeatherMap](https://openweathermap.org/api)
   - Free tier available with 1000 calls/day

## 📖 Usage Examples

### GitHub Integration

```typescript
import apiService from './src/services/apiService';

// Fetch repository statistics
const repoStats = await apiService.fetchProjectStats('Learner-Files');
console.log('Stars:', repoStats?.stars);
console.log('Languages:', Object.keys(repoStats?.languages || {}));

// Get all repositories
const repos = await apiService.fetchAllRepositories();
console.log(`Found ${repos.length} repositories`);
```

### Claude AI Integration

```typescript
// Simple AI query
const response = await apiService.sendToClaude(
  "Explain the benefits of TypeScript"
);

// Query with context
const contextualResponse = await apiService.sendToClaude(
  "How can I improve this codebase?",
  {
    projectType: "React TypeScript Portfolio",
    technologies: ["React", "TypeScript", "Vite"]
  }
);
```

### Analytics Tracking

```typescript
// Track page views
await apiService.trackPageView('/portfolio', {
  section: 'projects',
  user_type: 'visitor'
});

// Track user interactions
await apiService.trackUserInteraction('click', 'project_card', {
  project_name: 'API Integration Layer'
});

// Custom events
await apiService.trackEvent('feature_toggle', {
  feature: 'dark_mode',
  enabled: true
});
```

### Codewars Integration

```typescript
const codewarsData = await apiService.fetchCodewarsStats('username');
if (codewarsData) {
  console.log('Honor:', codewarsData.honor);
  console.log('Completed:', codewarsData.codeChallenges.totalCompleted);
}
```

### Email Service

```typescript
const emailResult = await apiService.sendEmail({
  to: 'contact@example.com',
  subject: 'Portfolio Contact',
  html: '<h1>New message from portfolio</h1>',
  replyTo: 'visitor@example.com'
});

if (emailResult.success) {
  console.log('Email sent:', emailResult.messageId);
}
```

### Weather Integration

```typescript
const weather = await apiService.fetchWeather('San Francisco, CA');
if (weather) {
  console.log(`${weather.name}: ${weather.main.temp}°C`);
  console.log('Condition:', weather.weather[0]?.description);
}
```

## 🧰 Advanced Features

### Caching

The service includes intelligent caching with configurable TTL:

```typescript
// Check cache status
console.log('Cache size:', apiService.getCacheSize());
console.log('Cache keys:', apiService.getCacheKeys());

// Clear specific cache entries
apiService.clearCache('github_.*'); // Clear GitHub cache only

// Clear all cache
apiService.clearCache();
```

### Health Monitoring

```typescript
const healthStatus = await apiService.healthCheck();
healthStatus.forEach(service => {
  console.log(`${service.service}: ${service.status} (${service.latency}ms)`);
});
```

### Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const data = await apiService.fetchProjectStats('repo-name');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfter);
  } else {
    console.error('API Error:', error.message);
  }
}
```

## 🔄 Rate Limiting

The service automatically handles rate limiting:

- **GitHub API**: 5000 requests/hour (authenticated)
- **Claude AI**: Varies by plan
- **Weather API**: 1000 requests/day (free tier)
- **Automatic retry** with exponential backoff
- **Request deduplication** to prevent duplicate calls

## 📊 Analytics Events

Built-in analytics tracking for:

- **Page Views**: Route changes, section visits
- **User Interactions**: Clicks, form submissions, feature usage
- **API Usage**: Success/failure rates, response times
- **Performance**: Load times, error rates
- **Custom Events**: Application-specific metrics

## 🛡️ Security Features

- **Environment variable validation**
- **API key rotation support**
- **Request sanitization**
- **Rate limiting protection**
- **Error message sanitization**

## 🧪 Testing

Run the example demonstrations:

```typescript
import examples from './src/examples/apiServiceExamples';

// Run all examples
await examples.runAllExamples();

// Or run specific examples
await examples.exampleGitHubUsage();
await examples.exampleAnalyticsUsage();
```

## 🚨 Error Handling

The service provides detailed error information:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public service: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

## 📈 Performance Optimizations

- **Request caching** with configurable TTL
- **Request deduplication** for identical concurrent requests
- **Batch operations** for multiple API calls
- **Lazy loading** of service connections
- **Memory management** with automatic cache cleanup

## 🔮 Future Enhancements

- [ ] GraphQL endpoint integration
- [ ] WebSocket support for real-time data
- [ ] Service worker caching
- [ ] Offline mode support
- [ ] Request queuing for offline scenarios
- [ ] Advanced retry strategies
- [ ] Circuit breaker pattern
- [ ] Metrics dashboard
- [ ] A/B testing integration
- [ ] CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

## 📄 License

This project is part of the StrayDogSyndicate Learner-Files portfolio and is available under the MIT License.

## 🆘 Support

For questions or issues:

1. Check the examples in `src/examples/apiServiceExamples.ts`
2. Review the type definitions in `src/types/api.ts`
3. Open an issue in the repository
4. Contact via the portfolio contact form

---

**Built with ❤️ by StrayDogSyndicate**

*Part of the comprehensive portfolio project showcasing modern web development practices and API integration patterns.*

# Analytics Dashboard Component Documentation

## Overview

The Analytics Dashboard is a comprehensive, real-time analytics visualization component built with React and Chart.js. It provides detailed insights into website performance, user behavior, and engagement metrics with live updates and interactive charts.

## Features

### ✅ Core Analytics Features
- **Real-time Visitor Counter**: Live visitor tracking with animated pulse indicator
- **Page Views Analytics**: Time-series visualization of page views and unique visitors
- **Project Performance**: Bar chart showing most viewed projects and content
- **Geographic Analytics**: Visitor location breakdown with visual progress bars
- **Device Analytics**: Device type distribution (Desktop, Mobile, Tablet)
- **Traffic Sources**: Pie chart showing traffic source distribution
- **AI Interaction Metrics**: Dual-axis chart tracking AI chat interactions and response times
- **Performance Metrics**: Bounce rate, conversion rate, session duration tracking
- **Event Tracking**: Download and click event monitoring
- **Live Activity Feed**: Real-time stream of user actions

### ✅ Technical Features
- **Real-time Updates**: WebSocket simulation for live data
- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode Support**: Automatic dark/light theme detection
- **Error Handling**: Comprehensive error states and retry mechanisms
- **Loading States**: Smooth loading animations and skeleton screens
- **Data Caching**: Efficient data management and caching
- **Export Ready**: Prepared for PDF/image export functionality
- **Accessibility**: Screen reader support and keyboard navigation

## Installation

### Dependencies

```bash
npm install react chart.js react-chartjs-2
```

### Required Chart.js Components

```javascript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);
```

## Usage

### Basic Implementation

```jsx
import React from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import './css/analytics-dashboard.css';

function App() {
  return (
    <div className="App">
      <AnalyticsDashboard />
    </div>
  );
}

export default App;
```

### With Custom Configuration

```jsx
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  return (
    <div className="App">
      <AnalyticsDashboard 
        apiEndpoint="/api/analytics"
        websocketUrl="wss://your-domain.com/analytics"
        refreshInterval={30000}
        enableRealTime={true}
      />
    </div>
  );
}
```

## Component Structure

### State Management

```javascript
const [analytics, setAnalytics] = useState({
  pageViews: [],           // Array of page view data points
  projectViews: {},        // Object with project names and view counts
  visitorLocations: [],    // Array of geographic data
  deviceTypes: {},         // Object with device type percentages
  trafficSources: {},      // Object with traffic source data
  aiInteractions: [],      // Array of AI interaction metrics
  liveVisitors: 0,         // Current live visitor count
  totalSessions: 0,        // Total session count
  bounceRate: 0,          // Bounce rate percentage
  avgSessionDuration: 0,   // Average session duration in seconds
  conversionRate: 0,       // Conversion rate percentage
  downloads: 0,           // Total downloads count
  clickEvents: 0          // Total click events count
});
```

### Real-time Data Structure

```javascript
const [realTimeData, setRealTimeData] = useState({
  activeUsers: 0,          // Currently active users
  pageViews: 0,           // Page views today
  events: []              // Recent activity events
});
```

## API Integration

### Analytics API Endpoint

Replace the mock data generator with real API calls:

```javascript
const fetchAnalytics = async () => {
  try {
    const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setAnalytics(data);
  } catch (err) {
    setError(err.message);
  }
};
```

### Google Analytics Integration

```javascript
// Example Google Analytics 4 integration
import { getAnalytics, logEvent } from 'firebase/analytics';

const fetchGoogleAnalytics = async () => {
  const analytics = getAnalytics();
  
  // Custom implementation for GA4 data fetching
  // This would require server-side GA4 Reporting API calls
  const response = await fetch('/api/ga4/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reportRequests: [{
        viewId: 'your-view-id',
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { expression: 'ga:sessions' },
          { expression: 'ga:pageviews' },
          { expression: 'ga:bounceRate' }
        ],
        dimensions: [{ name: 'ga:date' }]
      }]
    })
  });
  
  return response.json();
};
```

### WebSocket Real-time Connection

```javascript
const initializeRealTime = () => {
  wsRef.current = new WebSocket('wss://your-analytics-ws.com');
  
  wsRef.current.onopen = () => {
    console.log('Analytics WebSocket connected');
  };
  
  wsRef.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'visitor_update':
        setAnalytics(prev => ({
          ...prev,
          liveVisitors: data.count
        }));
        break;
        
      case 'page_view':
        setRealTimeData(prev => ({
          ...prev,
          pageViews: prev.pageViews + 1,
          events: [...prev.events.slice(-10), {
            type: 'page_view',
            page: data.page,
            timestamp: new Date(data.timestamp)
          }]
        }));
        break;
        
      case 'user_action':
        setRealTimeData(prev => ({
          ...prev,
          events: [...prev.events.slice(-10), data.event]
        }));
        break;
    }
  };
  
  wsRef.current.onerror = (error) => {
    console.error('WebSocket error:', error);
    setError('Real-time connection failed');
  };
};
```

## Customization

### Chart Color Themes

```javascript
const chartColors = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

// Apply to chart datasets
const pageViewsChartData = {
  datasets: [
    {
      label: 'Page Views',
      borderColor: chartColors.primary,
      backgroundColor: `${chartColors.primary}20`, // 20% opacity
      // ... other properties
    }
  ]
};
```

### Custom Metrics

Add new metrics to the dashboard:

```javascript
// 1. Update the analytics state
const [analytics, setAnalytics] = useState({
  // ... existing metrics
  customMetric: 0,
  newKPI: []
});

// 2. Create a new metric card
<div className="metric-card">
  <div className="metric-icon">📊</div>
  <div className="metric-content">
    <div className="metric-value">{analytics.customMetric}</div>
    <div className="metric-label">Custom Metric</div>
    <div className="metric-change positive">+5.2%</div>
  </div>
</div>

// 3. Add corresponding chart if needed
const customChartData = {
  labels: analytics.newKPI.map(item => item.label),
  datasets: [{
    data: analytics.newKPI.map(item => item.value),
    backgroundColor: chartColors.primary
  }]
};
```

### Time Range Customization

```javascript
// Custom time ranges
const timeRanges = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'Custom', value: 'custom' }
];

// Time range selector
<div className="time-range-selector">
  {timeRanges.map(range => (
    <button
      key={range.value}
      className={`time-range-btn ${timeRange === range.value ? 'active' : ''}`}
      onClick={() => setTimeRange(range.value)}
    >
      {range.label}
    </button>
  ))}
</div>
```

## Performance Optimization

### Memoization

```javascript
import { useMemo, useCallback } from 'react';

// Memoize chart data
const pageViewsChartData = useMemo(() => ({
  labels: analytics.pageViews.slice(-24).map(item => 
    new Date(item.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  ),
  datasets: [
    // ... dataset configuration
  ]
}), [analytics.pageViews]);

// Memoize chart options
const chartOptions = useMemo(() => ({
  responsive: true,
  maintainAspectRatio: false,
  // ... other options
}), []);
```

### Data Virtualization

For large datasets, implement virtualization:

```javascript
import { FixedSizeList as List } from 'react-window';

const ActivityFeedVirtualized = ({ events }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="activity-item">
      {/* Activity item content */}
    </div>
  );

  return (
    <List
      height={400}
      itemCount={events.length}
      itemSize={60}
    >
      {Row}
    </List>
  );
};
```

## Export Functionality

### PDF Export

```javascript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = async () => {
  const dashboard = document.querySelector('.analytics-dashboard');
  const canvas = await html2canvas(dashboard, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const imgWidth = 297; // A4 landscape width
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('analytics-dashboard.pdf');
};
```

### CSV Export

```javascript
const exportToCSV = () => {
  const csvData = [
    ['Date', 'Page Views', 'Unique Views', 'Sessions'],
    ...analytics.pageViews.map(item => [
      new Date(item.timestamp).toLocaleDateString(),
      item.views,
      item.uniqueViews,
      item.sessions || 0
    ])
  ];
  
  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'analytics-data.csv';
  link.click();
  
  window.URL.revokeObjectURL(url);
};
```

## Testing

### Component Testing

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsDashboard from './AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  test('renders dashboard with all metrics', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Portfolio Analytics')).toBeInTheDocument();
    });
    
    // Check for key metrics
    expect(screen.getByText(/live visitors/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Bounce Rate/i)).toBeInTheDocument();
  });
  
  test('time range selector works correctly', async () => {
    const user = userEvent.setup();
    render(<AnalyticsDashboard />);
    
    const sevenDayButton = screen.getByText('7D');
    await user.click(sevenDayButton);
    
    expect(sevenDayButton).toHaveClass('active');
  });
  
  test('handles error states gracefully', async () => {
    // Mock fetch to throw error
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
    
    render(<AnalyticsDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error Loading Analytics/i)).toBeInTheDocument();
    });
  });
});
```

### Performance Testing

```javascript
// Test chart rendering performance
describe('Chart Performance', () => {
  test('renders large datasets efficiently', async () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      views: Math.floor(Math.random() * 100),
      uniqueViews: Math.floor(Math.random() * 80)
    }));
    
    const start = performance.now();
    render(<AnalyticsDashboard initialData={{ pageViews: largeDataset }} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(1000); // Should render in under 1 second
  });
});
```

## Troubleshooting

### Common Issues

1. **Charts not rendering**
   - Ensure Chart.js components are properly registered
   - Check that container has defined height
   - Verify data format matches chart expectations

2. **Real-time updates not working**
   - Check WebSocket connection status
   - Verify event handlers are properly attached
   - Ensure proper cleanup in useEffect

3. **Performance issues**
   - Implement data virtualization for large datasets
   - Use useMemo for expensive calculations
   - Limit real-time update frequency

4. **Mobile responsiveness**
   - Test chart responsiveness with maintainAspectRatio: false
   - Adjust grid layouts for smaller screens
   - Optimize touch interactions

### Debug Mode

```javascript
const DEBUG = process.env.NODE_ENV === 'development';

const fetchAnalytics = async () => {
  if (DEBUG) {
    console.log('Fetching analytics data...', { timeRange });
  }
  
  try {
    // ... fetch logic
  } catch (err) {
    if (DEBUG) {
      console.error('Analytics fetch error:', err);
    }
    setError(err.message);
  }
};
```

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Chart.js Requirements**: Canvas support required
- **WebSocket Support**: For real-time features
- **CSS Grid**: For responsive layouts

## Contributing

When contributing to the Analytics Dashboard:

1. Follow React best practices and hooks patterns
2. Maintain TypeScript compatibility
3. Add tests for new features
4. Update documentation for API changes
5. Ensure responsive design principles
6. Test across different browsers and devices

## License

This component is part of the Learner-Files portfolio project and is available under the MIT License.

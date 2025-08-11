import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: 'visitor_update' | 'performance_alert' | 'goal_completion' | 'error_report' | 'system_status' | 'form_submission' | 'resume_download' | 'social_media_click';
  data: any;
  timestamp: number;
  id: string;
}

export interface VisitorUpdate {
  activeVisitors: number;
  newVisitor: {
    id: string;
    location: string;
    page: string;
    device: string;
    timestamp: number;
  } | null;
  leftVisitor: {
    id: string;
    sessionDuration: number;
  } | null;
}

export interface PerformanceAlert {
  metric: 'lcp' | 'fid' | 'cls' | 'fcp' | 'ttfb';
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  page: string;
  timestamp: number;
}

export interface GoalCompletion {
  type: 'contact_form' | 'resume_download' | 'game_completion' | 'project_view';
  details: any;
  value: number; // Business value score
  timestamp: number;
}

class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private messageQueue: WebSocketMessage[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor(private url?: string) {
    super();
    // For GitHub Pages, we'll simulate WebSocket with local storage events
    this.url = url || 'ws://localhost:3001/analytics';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        this.once('connected', resolve);
        this.once('error', reject);
        return;
      }

      this.isConnecting = true;

      try {
        // For GitHub Pages deployment, use simulated WebSocket
        if (this.isGitHubPages()) {
          this.setupSimulatedWebSocket();
          this.isConnecting = false;
          this.emit('connected');
          resolve();
          return;
        }

        this.ws = new WebSocket(this.url!);
        
        this.connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }

          // Send queued messages
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) {
              this.send(message);
            }
          }

          this.startHeartbeat();
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.cleanup();
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
          
          this.emit('disconnected', event);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private isGitHubPages(): boolean {
    return window.location.hostname.includes('github.io') || 
           window.location.hostname === 'localhost' ||
           !this.url?.startsWith('ws');
  }

  private setupSimulatedWebSocket(): void {
    console.log('Setting up simulated WebSocket for GitHub Pages');
    
    // Listen for storage events to simulate real-time updates
    window.addEventListener('storage', (event) => {
      if (event.key === 'analytics_realtime_update') {
        try {
          const message: WebSocketMessage = JSON.parse(event.newValue || '{}');
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse simulated message:', error);
        }
      }
    });

    // Simulate periodic updates
    setInterval(() => {
      this.simulateRealtimeUpdates();
    }, 30000); // Every 30 seconds

    // Start heartbeat for simulated connection
    this.startHeartbeat();
  }

  private simulateRealtimeUpdates(): void {
    // Simulate visitor updates
    const visitorUpdate: VisitorUpdate = {
      activeVisitors: Math.floor(Math.random() * 20) + 1,
      newVisitor: Math.random() > 0.7 ? {
        id: `visitor-${Date.now()}`,
        location: ['New York, US', 'London, UK', 'Toronto, CA', 'Berlin, DE'][Math.floor(Math.random() * 4)],
        page: ['/', '/portfolio', '/about', '/contact'][Math.floor(Math.random() * 4)],
        device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        timestamp: Date.now()
      } : null,
      leftVisitor: Math.random() > 0.8 ? {
        id: `visitor-${Date.now() - 300000}`,
        sessionDuration: Math.floor(Math.random() * 600) + 60
      } : null
    };

    this.handleMessage({
      type: 'visitor_update',
      data: visitorUpdate,
      timestamp: Date.now(),
      id: `msg-${Date.now()}`
    });

    // Occasionally simulate performance alerts
    if (Math.random() > 0.9) {
      const performanceAlert: PerformanceAlert = {
        metric: ['lcp', 'fid', 'cls'][Math.floor(Math.random() * 3)] as any,
        value: Math.random() * 3000 + 1000,
        threshold: 2500,
        severity: Math.random() > 0.5 ? 'warning' : 'critical',
        page: window.location.pathname,
        timestamp: Date.now()
      };

      this.handleMessage({
        type: 'performance_alert',
        data: performanceAlert,
        timestamp: Date.now(),
        id: `alert-${Date.now()}`
      });
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    this.emit('message', message);
    this.emit(message.type, message.data);
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else if (this.isGitHubPages()) {
      // For GitHub Pages, store in localStorage to simulate sending
      localStorage.setItem('analytics_realtime_update', JSON.stringify(message));
      // Trigger storage event manually for same-window updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'analytics_realtime_update',
        newValue: JSON.stringify(message)
      }));
    } else {
      // Queue message for when connection is established
      this.messageQueue.push(message);
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'system_status',
          data: { type: 'ping' },
          timestamp: Date.now(),
          id: `ping-${Date.now()}`
        });
      }
    }, 30000); // Every 30 seconds
  }

  private cleanup(): void {
    this.isConnecting = false;
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  disconnect(): void {
    this.cleanup();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.removeAllListeners();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || this.isGitHubPages();
  }

  getConnectionState(): string {
    if (this.isGitHubPages()) {
      return 'simulated';
    }
    
    if (!this.ws) {
      return 'disconnected';
    }
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }

  // Analytics-specific methods
  subscribeToVisitorUpdates(callback: (data: VisitorUpdate) => void): () => void {
    this.on('visitor_update', callback);
    return () => this.off('visitor_update', callback);
  }

  subscribeToPerformanceAlerts(callback: (data: PerformanceAlert) => void): () => void {
    this.on('performance_alert', callback);
    return () => this.off('performance_alert', callback);
  }

  subscribeToGoalCompletions(callback: (data: GoalCompletion) => void): () => void {
    this.on('goal_completion', callback);
    return () => this.off('goal_completion', callback);
  }

  // Send analytics events
  sendVisitorUpdate(data: VisitorUpdate): void {
    this.send({
      type: 'visitor_update',
      data,
      timestamp: Date.now(),
      id: `visitor-update-${Date.now()}`
    });
  }

  sendPerformanceAlert(data: PerformanceAlert): void {
    this.send({
      type: 'performance_alert',
      data,
      timestamp: Date.now(),
      id: `perf-alert-${Date.now()}`
    });
  }

  sendGoalCompletion(data: GoalCompletion): void {
    this.send({
      type: 'goal_completion',
      data,
      timestamp: Date.now(),
      id: `goal-${Date.now()}`
    });
  }
}

// Singleton instance
let webSocketService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!webSocketService) {
    webSocketService = new WebSocketService();
  }
  return webSocketService;
};

export default WebSocketService;
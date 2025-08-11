import { io, Socket } from 'socket.io-client';

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsUpdate {
  type: 'pageview' | 'event' | 'conversion' | 'session_start' | 'session_end';
  data: {
    page?: string;
    event?: string;
    value?: number;
    properties?: Record<string, any>;
    userId?: string;
    sessionId: string;
    timestamp: number;
  };
}

export interface DashboardUpdate {
  type: 'metrics' | 'chart_data' | 'alert' | 'notification';
  data: {
    metrics?: Record<string, number>;
    chartData?: {
      chartId: string;
      data: any[];
      timestamp: number;
    };
    alert?: {
      id: string;
      level: 'info' | 'warning' | 'error' | 'success';
      title: string;
      message: string;
      timestamp: number;
    };
    notification?: {
      id: string;
      type: 'insight' | 'recommendation' | 'achievement';
      title: string;
      message: string;
      data?: any;
      timestamp: number;
    };
  };
}

export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  lastConnected?: Date;
  connectionCount: number;
  latency?: number;
}

type EventCallback<T = any> = (data: T) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private connectionStatus: ConnectionStatus = {
    connected: false,
    reconnecting: false,
    connectionCount: 0
  };
  private eventListeners = new Map<string, Set<EventCallback>>();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private latencyCheckInterval: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Initialize WebSocket connection
   */
  public async initialize(options: {
    url?: string;
    userId?: string;
    sessionId?: string;
    autoConnect?: boolean;
  } = {}): Promise<void> {
    if (this.isInitialized) {
      console.warn('WebSocketService already initialized');
      return;
    }

    const {
      url = process.env.REACT_APP_WS_URL || 'ws://localhost:3001',
      userId,
      sessionId,
      autoConnect = true
    } = options;

    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        auth: {
          userId,
          sessionId,
          timestamp: Date.now()
        }
      });

      this.setupSocketEventHandlers();
      this.isInitialized = true;

      if (autoConnect) {
        await this.connect();
      }

      console.log('WebSocketService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebSocketService:', error);
      throw error;
    }
  }

  /**
   * Connect to WebSocket server
   */
  public async connect(): Promise<void> {
    if (!this.socket) {
      throw new Error('WebSocketService not initialized');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      this.socket!.once('connect', () => {
        clearTimeout(timeout);
        this.connectionStatus.connected = true;
        this.connectionStatus.reconnecting = false;
        this.connectionStatus.lastConnected = new Date();
        this.connectionStatus.connectionCount++;
        this.reconnectAttempts = 0;

        this.startHeartbeat();
        this.startLatencyCheck();
        this.processMessageQueue();
        this.emit('connection_status', this.connectionStatus);

        console.log('WebSocket connected successfully');
        resolve();
      });

      this.socket!.once('connect_error', (error) => {
        clearTimeout(timeout);
        console.error('WebSocket connection error:', error);
        reject(error);
      });

      this.socket!.connect();
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.stopHeartbeat();
      this.stopLatencyCheck();
      this.socket.disconnect();
      this.connectionStatus.connected = false;
      this.connectionStatus.reconnecting = false;
      this.emit('connection_status', this.connectionStatus);
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Send analytics update
   */
  public sendAnalyticsUpdate(update: AnalyticsUpdate): void {
    this.sendEvent('analytics_update', update);
  }

  /**
   * Send dashboard update
   */
  public sendDashboardUpdate(update: DashboardUpdate): void {
    this.sendEvent('dashboard_update', update);
  }

  /**
   * Send custom event
   */
  public sendEvent(type: string, data: any): void {
    const event: WebSocketEvent = {
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    };

    if (this.isConnected()) {
      this.socket!.emit(type, event);
    } else {
      // Queue message for later delivery
      this.messageQueue.push(event);
      console.warn(`WebSocket not connected. Queued event: ${type}`);
    }
  }

  /**
   * Subscribe to analytics updates
   */
  public onAnalyticsUpdate(callback: EventCallback<AnalyticsUpdate>): () => void {
    return this.on('analytics_update', callback);
  }

  /**
   * Subscribe to dashboard updates
   */
  public onDashboardUpdate(callback: EventCallback<DashboardUpdate>): () => void {
    return this.on('dashboard_update', callback);
  }

  /**
   * Subscribe to connection status changes
   */
  public onConnectionStatus(callback: EventCallback<ConnectionStatus>): () => void {
    return this.on('connection_status', callback);
  }

  /**
   * Subscribe to real-time insights
   */
  public onInsight(callback: EventCallback<any>): () => void {
    return this.on('insight', callback);
  }

  /**
   * Subscribe to alerts
   */
  public onAlert(callback: EventCallback<any>): () => void {
    return this.on('alert', callback);
  }

  /**
   * Subscribe to notifications
   */
  public onNotification(callback: EventCallback<any>): () => void {
    return this.on('notification', callback);
  }

  /**
   * Subscribe to custom events
   */
  public on(eventType: string, callback: EventCallback): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    this.eventListeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Emit event to all listeners
   */
  private emit(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Get current latency
   */
  public getLatency(): number | undefined {
    return this.connectionStatus.latency;
  }

  /**
   * Setup socket event handlers
   */
  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectionStatus.connected = true;
      this.connectionStatus.reconnecting = false;
      this.emit('connection_status', this.connectionStatus);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.connectionStatus.connected = false;
      this.stopHeartbeat();
      this.stopLatencyCheck();
      this.emit('connection_status', this.connectionStatus);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
      this.connectionStatus.reconnecting = false;
      this.connectionStatus.connectionCount++;
      this.processMessageQueue();
      this.emit('connection_status', this.connectionStatus);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`WebSocket reconnection attempt ${attemptNumber}`);
      this.connectionStatus.reconnecting = true;
      this.reconnectAttempts = attemptNumber;
      this.emit('connection_status', this.connectionStatus);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed');
      this.connectionStatus.reconnecting = false;
      this.emit('connection_status', this.connectionStatus);
    });

    // Handle incoming events
    this.socket.on('analytics_update', (data: AnalyticsUpdate) => {
      this.emit('analytics_update', data);
    });

    this.socket.on('dashboard_update', (data: DashboardUpdate) => {
      this.emit('dashboard_update', data);
    });

    this.socket.on('insight', (data: any) => {
      this.emit('insight', data);
    });

    this.socket.on('alert', (data: any) => {
      this.emit('alert', data);
    });

    this.socket.on('notification', (data: any) => {
      this.emit('notification', data);
    });

    this.socket.on('pong', (timestamp: number) => {
      const latency = Date.now() - timestamp;
      this.connectionStatus.latency = latency;
      this.emit('latency_update', latency);
    });
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden, reduce activity
        this.stopLatencyCheck();
      } else {
        // Page is visible, resume activity
        if (this.isConnected()) {
          this.startLatencyCheck();
        }
      }
    });

    // Handle online/offline events
    window.addEventListener('online', () => {
      console.log('Network connection restored');
      if (!this.isConnected() && this.socket) {
        this.socket.connect();
      }
    });

    window.addEventListener('offline', () => {
      console.log('Network connection lost');
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
      this.sendEvent('session_end', {
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      });
      this.disconnect();
    });
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.socket!.emit('ping', Date.now());
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Start latency checking
   */
  private startLatencyCheck(): void {
    this.stopLatencyCheck();
    this.latencyCheckInterval = setInterval(() => {
      if (this.isConnected()) {
        this.socket!.emit('ping', Date.now());
      }
    }, 10000); // Check latency every 10 seconds
  }

  /**
   * Stop latency checking
   */
  private stopLatencyCheck(): void {
    if (this.latencyCheckInterval) {
      clearInterval(this.latencyCheckInterval);
      this.latencyCheckInterval = null;
    }
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    if (this.messageQueue.length > 0 && this.isConnected()) {
      console.log(`Processing ${this.messageQueue.length} queued messages`);
      
      this.messageQueue.forEach(event => {
        this.socket!.emit(event.type, event);
      });
      
      this.messageQueue = [];
    }
  }

  /**
   * Get session ID
   */
  private getSessionId(): string {
    // Get session ID from localStorage or generate new one
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.disconnect();
    this.eventListeners.clear();
    this.messageQueue = [];
    this.isInitialized = false;
    console.log('WebSocketService destroyed');
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

// Export types
export type {
  WebSocketEvent,
  AnalyticsUpdate,
  DashboardUpdate,
  ConnectionStatus
};

// Utility functions for common operations
export const WebSocketUtils = {
  /**
   * Create analytics update event
   */
  createAnalyticsUpdate: (
    type: AnalyticsUpdate['type'],
    data: Partial<AnalyticsUpdate['data']>
  ): AnalyticsUpdate => ({
    type,
    data: {
      sessionId: webSocketService.getSessionId?.() || 'unknown',
      timestamp: Date.now(),
      ...data
    }
  }),

  /**
   * Create dashboard update event
   */
  createDashboardUpdate: (
    type: DashboardUpdate['type'],
    data: DashboardUpdate['data']
  ): DashboardUpdate => ({
    type,
    data
  }),

  /**
   * Format connection status for display
   */
  formatConnectionStatus: (status: ConnectionStatus): string => {
    if (status.connected) {
      return `Connected${status.latency ? ` (${status.latency}ms)` : ''}`;
    } else if (status.reconnecting) {
      return 'Reconnecting...';
    } else {
      return 'Disconnected';
    }
  },

  /**
   * Get connection quality based on latency
   */
  getConnectionQuality: (latency?: number): 'excellent' | 'good' | 'fair' | 'poor' | 'unknown' => {
    if (latency === undefined) return 'unknown';
    if (latency < 50) return 'excellent';
    if (latency < 150) return 'good';
    if (latency < 300) return 'fair';
    return 'poor';
  }
};
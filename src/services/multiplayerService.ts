import { io, Socket } from 'socket.io-client';
import {
  GameSession,
  Player,
  GameRoom,
  WebSocketMessage,
  PlayerAction,
  DiceGroupResult
} from '../types/knucklebones';

export interface MultiplayerEvents {
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'error': (error: Error) => void;
  
  // Room events
  'room_joined': (room: GameRoom) => void;
  'room_left': () => void;
  'room_updated': (room: GameRoom) => void;
  'player_joined': (player: Player) => void;
  'player_left': (playerId: string) => void;
  
  // Game events
  'game_started': (session: GameSession) => void;
  'game_updated': (session: GameSession) => void;
  'game_ended': (session: GameSession) => void;
  'player_action': (action: PlayerAction) => void;
  'dice_rolled': (results: DiceGroupResult[], playerId: string) => void;
  
  // Spectator events
  'spectator_joined': (spectatorId: string) => void;
  'spectator_left': (spectatorId: string) => void;
  
  // Chat events
  'chat_message': (message: ChatMessage) => void;
  'system_message': (message: string) => void;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'player' | 'spectator' | 'system';
}

export interface ConnectionConfig {
  serverUrl: string;
  autoReconnect: boolean;
  reconnectAttempts: number;
  reconnectDelay: number;
  timeout: number;
}

class MultiplayerService {
  private socket: Socket | null = null;
  private currentRoom: GameRoom | null = null;
  private currentPlayer: Player | null = null;
  private isSpectator: boolean = false;
  private eventListeners: Map<keyof MultiplayerEvents, Function[]> = new Map();
  private connectionConfig: ConnectionConfig;
  private reconnectAttempts: number = 0;
  private isConnecting: boolean = false;

  constructor(config?: Partial<ConnectionConfig>) {
    this.connectionConfig = {
      serverUrl: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001',
      autoReconnect: true,
      reconnectAttempts: 5,
      reconnectDelay: 2000,
      timeout: 10000,
      ...config
    };
  }

  // Connection management
  async connect(player: Player): Promise<boolean> {
    if (this.isConnecting || this.isConnected()) {
      return true;
    }

    this.isConnecting = true;
    this.currentPlayer = player;

    try {
      this.socket = io(this.connectionConfig.serverUrl, {
        timeout: this.connectionConfig.timeout,
        autoConnect: false,
        auth: {
          playerId: player.id,
          playerName: player.name,
          playerType: player.type
        }
      });

      this.setupEventHandlers();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, this.connectionConfig.timeout);

        this.socket!.once('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('connect');
          resolve(true);
        });

        this.socket!.once('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        });

        this.socket!.connect();
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentRoom = null;
    this.currentPlayer = null;
    this.isSpectator = false;
    this.emit('disconnect');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Room management
  async createRoom(roomName: string, gameSettings: any): Promise<GameRoom> {
    if (!this.isConnected()) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Create room timeout'));
      }, 5000);

      this.socket!.emit('create_room', {
        name: roomName,
        settings: gameSettings,
        creatorId: this.currentPlayer!.id
      });

      this.socket!.once('room_created', (room: GameRoom) => {
        clearTimeout(timeout);
        this.currentRoom = room;
        resolve(room);
      });

      this.socket!.once('create_room_error', (error: string) => {
        clearTimeout(timeout);
        reject(new Error(error));
      });
    });
  }

  async joinRoom(roomId: string, asSpectator: boolean = false): Promise<GameRoom> {
    if (!this.isConnected()) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Join room timeout'));
      }, 5000);

      this.socket!.emit('join_room', {
        roomId,
        playerId: this.currentPlayer!.id,
        asSpectator
      });

      this.socket!.once('room_joined', (room: GameRoom) => {
        clearTimeout(timeout);
        this.currentRoom = room;
        this.isSpectator = asSpectator;
        this.emit('room_joined', room);
        resolve(room);
      });

      this.socket!.once('join_room_error', (error: string) => {
        clearTimeout(timeout);
        reject(new Error(error));
      });
    });
  }

  leaveRoom(): void {
    if (this.socket && this.currentRoom) {
      this.socket.emit('leave_room', {
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer!.id
      });
      this.currentRoom = null;
      this.isSpectator = false;
      this.emit('room_left');
    }
  }

  async getRoomList(): Promise<GameRoom[]> {
    if (!this.isConnected()) {
      throw new Error('Not connected to server');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Get room list timeout'));
      }, 5000);

      this.socket!.emit('get_room_list');

      this.socket!.once('room_list', (rooms: GameRoom[]) => {
        clearTimeout(timeout);
        resolve(rooms);
      });
    });
  }

  // Game actions
  rollDice(diceGroups: any[]): void {
    if (!this.socket || !this.currentRoom || this.isSpectator) {
      throw new Error('Cannot perform action');
    }

    const action: PlayerAction = {
      playerId: this.currentPlayer!.id,
      actionType: 'roll',
      diceGroups,
      timestamp: new Date()
    };

    this.socket.emit('player_action', {
      roomId: this.currentRoom.id,
      action
    });
  }

  sendChatMessage(message: string): void {
    if (!this.socket || !this.currentRoom) {
      throw new Error('Cannot send message');
    }

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: this.currentPlayer!.id,
      senderName: this.currentPlayer!.name,
      message,
      timestamp: new Date(),
      type: this.isSpectator ? 'spectator' : 'player'
    };

    this.socket.emit('chat_message', {
      roomId: this.currentRoom.id,
      message: chatMessage
    });
  }

  // Event handling
  on<K extends keyof MultiplayerEvents>(event: K, callback: MultiplayerEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off<K extends keyof MultiplayerEvents>(event: K, callback: MultiplayerEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit<K extends keyof MultiplayerEvents>(event: K, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      this.emit('disconnect');
      
      if (this.connectionConfig.autoReconnect && reason === 'io server disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.emit('error', error);
      
      if (this.connectionConfig.autoReconnect) {
        this.attemptReconnect();
      }
    });

    // Room events
    this.socket.on('room_updated', (room: GameRoom) => {
      this.currentRoom = room;
      this.emit('room_updated', room);
    });

    this.socket.on('player_joined', (player: Player) => {
      this.emit('player_joined', player);
    });

    this.socket.on('player_left', (playerId: string) => {
      this.emit('player_left', playerId);
    });

    // Game events
    this.socket.on('game_started', (session: GameSession) => {
      this.emit('game_started', session);
    });

    this.socket.on('game_updated', (session: GameSession) => {
      this.emit('game_updated', session);
    });

    this.socket.on('game_ended', (session: GameSession) => {
      this.emit('game_ended', session);
    });

    this.socket.on('player_action', (action: PlayerAction) => {
      this.emit('player_action', action);
    });

    this.socket.on('dice_rolled', (data: { results: DiceGroupResult[], playerId: string }) => {
      this.emit('dice_rolled', data.results, data.playerId);
    });

    // Spectator events
    this.socket.on('spectator_joined', (spectatorId: string) => {
      this.emit('spectator_joined', spectatorId);
    });

    this.socket.on('spectator_left', (spectatorId: string) => {
      this.emit('spectator_left', spectatorId);
    });

    // Chat events
    this.socket.on('chat_message', (message: ChatMessage) => {
      this.emit('chat_message', message);
    });

    this.socket.on('system_message', (message: string) => {
      this.emit('system_message', message);
    });
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.connectionConfig.reconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.connectionConfig.reconnectAttempts})...`);

    await new Promise(resolve => setTimeout(resolve, this.connectionConfig.reconnectDelay));

    try {
      if (this.currentPlayer) {
        await this.connect(this.currentPlayer);
        
        // Rejoin room if we were in one
        if (this.currentRoom) {
          await this.joinRoom(this.currentRoom.id, this.isSpectator);
        }
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
      this.attemptReconnect();
    }
  }

  // Getters
  getCurrentRoom(): GameRoom | null {
    return this.currentRoom;
  }

  getCurrentPlayer(): Player | null {
    return this.currentPlayer;
  }

  getIsSpectator(): boolean {
    return this.isSpectator;
  }

  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.isConnected()) return 'connected';
    return 'disconnected';
  }
}

// Singleton instance
const multiplayerService = new MultiplayerService();
export default multiplayerService;

// Hook for React components
export const useMultiplayer = () => {
  return {
    service: multiplayerService,
    connect: multiplayerService.connect.bind(multiplayerService),
    disconnect: multiplayerService.disconnect.bind(multiplayerService),
    createRoom: multiplayerService.createRoom.bind(multiplayerService),
    joinRoom: multiplayerService.joinRoom.bind(multiplayerService),
    leaveRoom: multiplayerService.leaveRoom.bind(multiplayerService),
    rollDice: multiplayerService.rollDice.bind(multiplayerService),
    sendChatMessage: multiplayerService.sendChatMessage.bind(multiplayerService),
    isConnected: multiplayerService.isConnected.bind(multiplayerService),
    getCurrentRoom: multiplayerService.getCurrentRoom.bind(multiplayerService),
    getCurrentPlayer: multiplayerService.getCurrentPlayer.bind(multiplayerService),
    getIsSpectator: multiplayerService.getIsSpectator.bind(multiplayerService),
    getConnectionStatus: multiplayerService.getConnectionStatus.bind(multiplayerService)
  };
};
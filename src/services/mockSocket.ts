interface MockMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  timestamp: Date;
}

interface MockRoom {
  id: string;
  name: string;
  description: string;
  members: number;
  active: number;
}

interface MockSocketEvent {
  event: string;
  data: any;
  timestamp: number;
}

// Use localStorage to simulate persistent storage across browser windows
const STORAGE_KEYS = {
  MESSAGES: 'mock_chat_messages',
  ONLINE_USERS: 'mock_online_users',
  EVENTS: 'mock_socket_events',
  TYPING_USERS: 'mock_typing_users'
};

class MockSocketService {
  private eventHandlers: Map<string, Function[]> = new Map();
  private isConnected = false;
  private currentUser: { id: string; username: string } | null = null;
  private currentRoom: string | null = null;
  private eventCheckInterval: NodeJS.Timeout | null = null;
  private lastEventCheck = 0;

  constructor() {
    // Listen for storage changes to sync across browser windows
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  connect(userId: string, username: string) {
    console.info('[MockSocket] Connecting user:', username);
    this.currentUser = { id: userId, username };
    this.isConnected = true;
    
    // Start checking for new events from other windows
    this.startEventPolling();
    
    // Emit connect event
    setTimeout(() => this.emit('connect', {}), 100);
  }

  disconnect() {
    console.info('[MockSocket] Disconnecting user:', this.currentUser?.username);
    
    if (this.currentRoom && this.currentUser) {
      this.leaveRoom(this.currentRoom);
    }
    
    this.stopEventPolling();
    this.isConnected = false;
    this.currentUser = null;
    this.currentRoom = null;
    
    this.emit('disconnect', {});
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  off(event: string) {
    this.eventHandlers.delete(event);
  }

  emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('[MockSocket] Error in event handler:', error);
        }
      });
    }
  }

  // Simulate socket.emit calls
  emitToServer(event: string, data: any) {
    if (!this.isConnected || !this.currentUser) {
      console.warn('[MockSocket] Not connected, ignoring emit:', event);
      return;
    }

    switch (event) {
      case 'join-room':
        this.joinRoom(data);
        break;
      case 'leave-room':
        this.leaveRoom(data);
        break;
      case 'send-message':
        this.sendMessage(data);
        break;
      case 'typing':
        this.setTyping(data, true);
        break;
      case 'stop-typing':
        this.setTyping(data, false);
        break;
    }
  }

  private joinRoom(roomId: string) {
    this.currentRoom = roomId;
    
    // Add user to online users
    const onlineUsers = this.getOnlineUsers(roomId);
    if (!onlineUsers.includes(this.currentUser!.username)) {
      onlineUsers.push(this.currentUser!.username);
      this.setOnlineUsers(roomId, onlineUsers);
    }

    // Broadcast room users update
    this.broadcastEvent('room-users', { roomId, users: onlineUsers });
    
    console.info(`[MockSocket] ${this.currentUser!.username} joined room ${roomId}`);
  }

  private leaveRoom(roomId: string) {
    if (!this.currentUser) return;

    // Remove user from online users
    const onlineUsers = this.getOnlineUsers(roomId);
    const updatedUsers = onlineUsers.filter(u => u !== this.currentUser!.username);
    this.setOnlineUsers(roomId, updatedUsers);

    // Remove from typing users
    this.setTyping({ roomId, userId: this.currentUser.id }, false);

    // Broadcast room users update
    this.broadcastEvent('room-users', { roomId, users: updatedUsers });
    
    console.info(`[MockSocket] ${this.currentUser.username} left room ${roomId}`);
    this.currentRoom = null;
  }

  private sendMessage(data: any) {
    const message: MockMessage = {
      id: Date.now().toString() + Math.random(),
      content: data.content,
      userId: data.userId,
      username: data.username,
      timestamp: new Date()
    };

    // Store message
    const messages = this.getRoomMessages(data.roomId);
    messages.push(message);
    this.setRoomMessages(data.roomId, messages);

    // Stop typing for this user
    this.setTyping({ roomId: data.roomId, userId: data.userId }, false);

    // Broadcast message to all users in room
    this.broadcastEvent('message', message);
    
    console.info(`[MockSocket] Message sent by ${data.username}: ${data.content}`);
  }

  private setTyping(data: { roomId: string; userId: string; username?: string }, isTyping: boolean) {
    if (!this.currentUser) return;

    const typingKey = `${STORAGE_KEYS.TYPING_USERS}_${data.roomId}`;
    const typingUsers: { [userId: string]: { username: string; timestamp: number } } = 
      JSON.parse(localStorage.getItem(typingKey) || '{}');

    if (isTyping && data.username) {
      typingUsers[data.userId] = { username: data.username, timestamp: Date.now() };
    } else {
      delete typingUsers[data.userId];
    }

    localStorage.setItem(typingKey, JSON.stringify(typingUsers));

    // Broadcast typing status
    if (isTyping && data.username) {
      this.broadcastEvent('user-typing', { userId: data.userId, username: data.username });
    } else {
      const username = (this.currentUser && this.currentUser.username) || data.username || '';
      this.broadcastEvent('user-stop-typing', { userId: data.userId, username });
    }
  }

  private getRoomMessages(roomId: string): MockMessage[] {
    const key = `${STORAGE_KEYS.MESSAGES}_${roomId}`;
    const messages = localStorage.getItem(key);
    return messages ? JSON.parse(messages) : [];
  }

  private setRoomMessages(roomId: string, messages: MockMessage[]) {
    const key = `${STORAGE_KEYS.MESSAGES}_${roomId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  }

  private getOnlineUsers(roomId: string): string[] {
    const key = `${STORAGE_KEYS.ONLINE_USERS}_${roomId}`;
    const users = localStorage.getItem(key);
    return users ? JSON.parse(users) : [];
  }

  private setOnlineUsers(roomId: string, users: string[]) {
    const key = `${STORAGE_KEYS.ONLINE_USERS}_${roomId}`;
    localStorage.setItem(key, JSON.stringify(users));
  }

  private broadcastEvent(event: string, data: any) {
    const eventData: MockSocketEvent = {
      event,
      data,
      timestamp: Date.now()
    };

    // Store event for other windows to pick up
    const events: MockSocketEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    events.push(eventData);
    
    // Keep only last 100 events to prevent memory issues
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    
    // Emit to current window immediately
    this.emit(event, data);
  }

  private startEventPolling() {
    this.lastEventCheck = Date.now();
    this.eventCheckInterval = setInterval(() => {
      this.checkForNewEvents();
    }, 500); // Check for new events every 500ms
  }

  private stopEventPolling() {
    if (this.eventCheckInterval) {
      clearInterval(this.eventCheckInterval);
      this.eventCheckInterval = null;
    }
  }

  private checkForNewEvents() {
    const events: MockSocketEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const newEvents = events.filter(event => event.timestamp > this.lastEventCheck);
    
    if (newEvents.length > 0) {
      this.lastEventCheck = Date.now();
      
      newEvents.forEach(event => {
        // Don't emit events back to the sender
        if (event.data?.userId !== this.currentUser?.id) {
          this.emit(event.event, event.data);
        }
      });
    }
  }

  private handleStorageChange(e: StorageEvent) {
    // Handle real-time updates from other browser windows
    if (e.key?.startsWith(STORAGE_KEYS.ONLINE_USERS) && this.currentRoom) {
      const roomId = e.key.replace(STORAGE_KEYS.ONLINE_USERS + '_', '');
      if (roomId === this.currentRoom && e.newValue) {
        const users = JSON.parse(e.newValue);
        this.emit('room-users', { roomId, users });
      }
    }
  }

  // Get room data (mock)
  getRoomData(roomId: string): MockRoom {
    const rooms: { [key: string]: MockRoom } = {
      '1': { id: '1', name: "General Support", description: "A safe space for general mental health discussions", members: 234, active: 12 },
      '2': { id: '2', name: "Anxiety & Stress", description: "Share coping strategies and support for anxiety", members: 189, active: 8 },
      '3': { id: '3', name: "Study Pressure", description: "Academic stress and study-life balance", members: 156, active: 15 },
      '4': { id: '4', name: "Daily Motivation", description: "Share positive thoughts and daily inspiration", members: 298, active: 20 }
    };
    
    return rooms[roomId] || { id: roomId, name: `Room ${roomId}`, description: "Chat room", members: 0, active: 0 };
  }

  // Get message history for room
  getMessageHistory(roomId: string): MockMessage[] {
    return this.getRoomMessages(roomId);
  }
}

// Export singleton instance
export const mockSocketService = new MockSocketService();

// Mock Socket class that matches the Socket.IO interface
export class MockSocket {
  private service: MockSocketService;

  constructor(userId: string, username: string) {
    this.service = mockSocketService;
    this.service.connect(userId, username);
  }

  on(event: string, handler: Function) {
    this.service.on(event, handler);
  }

  off(event: string) {
    this.service.off(event);
  }

  emit(event: string, data?: any) {
    this.service.emitToServer(event, data);
  }

  disconnect() {
    this.service.disconnect();
  }
}

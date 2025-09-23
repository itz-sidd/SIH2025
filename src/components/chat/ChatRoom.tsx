import { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { mockSocketService } from '@/services/mockSocket';

interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  timestamp: Date;
}

interface Room {
  id: string;
  name: string;
  description: string;
  members: number;
  active: number;
}

export function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    // Join room
    socket.emit('join-room', roomId);

    // Load room data and message history
    loadRoomData();
    loadMessages();

    // Socket event listeners
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('room-users', (payload: { roomId: string; users: string[] }) => {
      setOnlineUsers(payload.users);
    });

    socket.on('user-typing', (data: { userId: string; username: string }) => {
      if (data.userId !== user.id) {
        setIsTyping(prev => (prev.includes(data.username) ? prev : [...prev, data.username]));
      }
    });

    socket.on('user-stop-typing', (data: { userId: string; username?: string }) => {
      const name = data.username;
      if (name) {
        setIsTyping(prev => prev.filter(n => n !== name));
      } else {
        // If username not provided, clear all typing indicators for safety
        setIsTyping([]);
      }
    });

    return () => {
      socket.off('message');
      socket.off('room-users');
      socket.off('user-typing');
      socket.off('user-stop-typing');
      socket.emit('leave-room', roomId);
    };
  }, [socket, roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Decide whether to use mock data or real API
  const useMockData = () => {
    const mode = localStorage.getItem('socketMode'); // 'mock' | 'real' | null
    if (mode === 'mock') return true;
    if (mode === 'real') return false;
    // Default to mock so local VS Code runs work without backend
    return true;
  };

  const loadRoomData = async () => {
    if (!roomId) return;
    
    if (useMockData()) {
      // Use mock room data
      const roomData = mockSocketService.getRoomData(roomId);
      setRoom(roomData);
    } else {
      // Use real API
      try {
        const response = await fetch(`http://localhost:3001/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (response.ok) {
          const roomData = await response.json();
          setRoom(roomData);
        }
      } catch (error) {
        console.error('Error loading room:', error);
        // Fallback to mock data
        const roomData = mockSocketService.getRoomData(roomId);
        setRoom(roomData);
      }
    }
  };

  const loadMessages = async () => {
    if (!roomId) return;
    
    if (useMockData()) {
      // Use mock message history
      const messagesData = mockSocketService.getMessageHistory(roomId);
      setMessages(messagesData);
    } else {
      // Use real API
      try {
        const response = await fetch(`http://localhost:3001/api/rooms/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (response.ok) {
          const messagesData = await response.json();
          setMessages(messagesData);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to mock data
        const messagesData = mockSocketService.getMessageHistory(roomId);
        setMessages(messagesData);
      }
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    socket.emit('send-message', {
      roomId,
      content: newMessage,
      userId: user.id,
      username: user.username
    });

    setNewMessage('');
    socket.emit('stop-typing', { roomId, userId: user.id });
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (!socket || !user) return;

    if (value.trim()) {
      socket.emit('typing', { roomId, userId: user.id, username: user.username });
    } else {
      socket.emit('stop-typing', { roomId, userId: user.id });
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!room) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {room.name}
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {onlineUsers.length} online
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{room.description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {message.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm break-words">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping.length > 0 && (
                <div className="text-sm text-muted-foreground italic">
                  {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
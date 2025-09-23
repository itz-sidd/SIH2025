import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { MockSocket } from '@/services/mockSocket';

// Decide whether to use mock socket or real socket
const useMockSocket = () => {
  const mode = localStorage.getItem('socketMode'); // 'mock' | 'real' | null
  if (mode === 'mock') return true;
  if (mode === 'real') return false;
  // Default to mock so local VS Code runs work without backend
  return true;
};

export function useSocket() {
  const [socket, setSocket] = useState<Socket | MockSocket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (useMockSocket()) {
      // Use mock socket for demo/preview
      console.info('[Socket] Using mock socket for user:', user.username);
      const mockSocket = new MockSocket(user.id, user.username);
      setSocket(mockSocket as any);
      return () => mockSocket.disconnect();
    } else {
      // Use real socket for local development with backend
      console.info('[Socket] Using real socket for user:', user.username);
      const newSocket = io('http://localhost:3001', {
        auth: {
          token: localStorage.getItem('authToken')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return socket;
}
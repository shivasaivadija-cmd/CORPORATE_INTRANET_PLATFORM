'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/store/notification.store';
import { usePresenceStore } from '@/store/presence.store';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextValue>({ 
  socket: null, 
  isConnected: false,
  error: null 
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const { accessToken, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { updatePresence } = usePresenceStore();

  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    // Don't connect if not mounted or no auth
    if (!mounted || !accessToken || !user) {
      cleanup();
      return;
    }

    // Check if backend is available
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    
    try {
      const socket = io(wsUrl, {
        auth: { token: accessToken },
        transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        autoConnect: true,
        forceNew: true,
      });

      // Connection successful
      socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      });

      // Connection error
      socket.on('connect_error', (err) => {
        console.warn('⚠️ WebSocket connection error:', err.message);
        setIsConnected(false);
        reconnectAttempts.current++;
        
        if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Unable to connect to real-time services. App will work in offline mode.');
          socket.disconnect();
        }
      });

      // Disconnection
      socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        
        // Don't show error for intentional disconnects
        if (reason === 'io client disconnect' || reason === 'io server disconnect') {
          setError(null);
        }
      });

      // Reconnection attempt
      socket.on('reconnect_attempt', (attempt) => {
        console.log(`🔄 Reconnection attempt ${attempt}/${maxReconnectAttempts}`);
      });

      // Reconnection failed
      socket.on('reconnect_failed', () => {
        console.error('❌ WebSocket reconnection failed');
        setError('Real-time features unavailable. Please refresh the page.');
      });

      // Reconnection successful
      socket.on('reconnect', (attempt) => {
        console.log(`✅ WebSocket reconnected after ${attempt} attempts`);
        setError(null);
      });

      // Handle notifications
      socket.on('notification:new', (notification) => {
        try {
          addNotification(notification);
        } catch (err) {
          console.error('Error handling notification:', err);
        }
      });

      // Handle presence updates
      socket.on('presence:update', ({ userId, status, lastSeenAt }) => {
        try {
          updatePresence(userId, status, lastSeenAt);
        } catch (err) {
          console.error('Error handling presence update:', err);
        }
      });

      // Ping every 2 minutes to maintain presence
      const pingInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit('presence:ping');
        }
      }, 120000);

      socketRef.current = socket;

      return () => {
        clearInterval(pingInterval);
        cleanup();
      };
    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
      setError('Failed to initialize real-time connection');
      return cleanup;
    }
  }, [accessToken, user, mounted, cleanup, addNotification, updatePresence]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

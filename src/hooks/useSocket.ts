import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, ChatMessage, Operation } from '../types/types';

export const useSocket = (documentId: string, user: User) => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-document', { documentId, user });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('users-updated', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on('chat-message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('chat-history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId, user]);

  const sendOperation = (operation: Operation) => {
    if (socketRef.current) {
      socketRef.current.emit('operation', operation);
    }
  };

  const sendCursorUpdate = (cursor: { index: number; length: number }) => {
    if (socketRef.current) {
      socketRef.current.emit('cursor-update', cursor);
    }
  };

  const sendChatMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat-message', message);
    }
  };

  const onOperation = (callback: (operation: Operation) => void) => {
    if (socketRef.current) {
      socketRef.current.on('operation', callback);
    }
  };

  const onDocumentUpdate = (callback: (content: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('document-updated', callback);
    }
  };

  return {
    isConnected,
    users,
    messages,
    sendOperation,
    sendCursorUpdate,
    sendChatMessage,
    onOperation,
    onDocumentUpdate,
  };
};
export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: {
    index: number;
    length: number;
  };
  lastActive: number;
}

export interface Document {
  id: string;
  title: string;
  content: any;
  lastModified: number;
  version: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  message: string;
  timestamp: number;
}

export interface Operation {
  type: 'insert' | 'delete' | 'retain';
  index: number;
  length?: number;
  text?: string;
  attributes?: any;
  userId: string;
  timestamp: number;
}

export interface DocumentState {
  document: Document | null;
  users: User[];
  messages: ChatMessage[];
  isConnected: boolean;
  isSaving: boolean;
  lastSaved: number | null;
}
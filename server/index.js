import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import Delta from 'quill-delta';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
const documents = new Map();
const documentUsers = new Map();
const documentMessages = new Map();

// Initialize default document
const defaultDoc = {
  id: 'default-doc',
  title: 'Untitled Document',
  content: { ops: [{ insert: '\n' }] },
  lastModified: Date.now(),
  version: 1,
};
documents.set('default-doc', defaultDoc);
documentUsers.set('default-doc', new Map());
documentMessages.set('default-doc', []);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  let currentDocumentId = null;
  let currentUser = null;

  socket.on('join-document', ({ documentId, user }) => {
    currentDocumentId = documentId;
    currentUser = { ...user, socketId: socket.id };
    
    // Join document room
    socket.join(documentId);
    
    // Add user to document
    if (!documentUsers.has(documentId)) {
      documentUsers.set(documentId, new Map());
    }
    documentUsers.get(documentId).set(socket.id, currentUser);
    
    // Send current document content
    const document = documents.get(documentId) || defaultDoc;
    socket.emit('document-content', document);
    
    // Send chat history
    const messages = documentMessages.get(documentId) || [];
    socket.emit('chat-history', messages);
    
    // Notify all users in document
    const users = Array.from(documentUsers.get(documentId).values());
    io.to(documentId).emit('users-updated', users);
    
    console.log(`User ${user.name} joined document ${documentId}`);
  });

  socket.on('operation', (operation) => {
    if (!currentDocumentId) return;
    
    console.log('Received operation from', operation.userId);
    
    // Apply the operation to the document
    const document = documents.get(currentDocumentId);
    if (document) {
      try {
        if (operation.text && operation.type === 'insert') {
          const delta = new Delta(document.content);
          const opDelta = new Delta(JSON.parse(operation.text));
          const newContent = delta.compose(opDelta);
          document.content = newContent;
          document.lastModified = Date.now();
          documents.set(currentDocumentId, document);
          // Use socket.to() to exclude sender from receiving their own update
          socket.to(currentDocumentId).emit('document-updated', document.content);
        } else if (operation.type === 'retain' && operation.attributes) {
          // Formatting operation - apply it to the document
          const delta = new Delta(document.content);
          const formatDelta = new Delta([
            { retain: operation.index },
            { retain: operation.length, attributes: operation.attributes }
          ]);
          const newContent = delta.compose(formatDelta);
          document.content = newContent;
          document.lastModified = Date.now();
          documents.set(currentDocumentId, document);
          // Use socket.to() to exclude sender from receiving their own update
          socket.to(currentDocumentId).emit('document-updated', document.content);
        }
      } catch (error) {
        console.error('Error processing operation:', error);
        console.error('Operation details:', operation);
      }
    }
  });

  socket.on('cursor-update', (cursor) => {
    if (!currentDocumentId || !currentUser) return;
    
    // Update user cursor position
    const users = documentUsers.get(currentDocumentId);
    if (users && users.has(socket.id)) {
      const user = users.get(socket.id);
      user.cursor = cursor;
      user.lastActive = Date.now();
      users.set(socket.id, user);
      
      // Broadcast updated user list
      const userList = Array.from(users.values());
      io.to(currentDocumentId).emit('users-updated', userList);
    }
  });

  socket.on('chat-message', (message) => {
    if (!currentDocumentId || !currentUser) return;
    
    const chatMessage = {
      id: uuidv4(),
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      message: message,
      timestamp: Date.now(),
    };
    
    // Store message
    if (!documentMessages.has(currentDocumentId)) {
      documentMessages.set(currentDocumentId, []);
    }
    documentMessages.get(currentDocumentId).push(chatMessage);
    
    // Broadcast message to all users in document
    io.to(currentDocumentId).emit('chat-message', chatMessage);
  });

  socket.on('document-title-update', ({ title }) => {
    if (!currentDocumentId) return;
    
    const document = documents.get(currentDocumentId);
    if (document) {
      document.title = title;
      document.lastModified = Date.now();
      documents.set(currentDocumentId, document);
      
      // Broadcast title update
      socket.to(currentDocumentId).emit('document-title-updated', title);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (currentDocumentId && documentUsers.has(currentDocumentId)) {
      const users = documentUsers.get(currentDocumentId);
      users.delete(socket.id);
      
      // Notify remaining users
      const userList = Array.from(users.values());
      io.to(currentDocumentId).emit('users-updated', userList);
      
      if (currentUser) {
        console.log(`User ${currentUser.name} left document ${currentDocumentId}`);
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get document endpoint
app.get('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const document = documents.get(id);
  
  if (document) {
    res.json(document);
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Document editor available at http://localhost:5173`);
  console.log(`💬 WebSocket server ready for connections`);
});
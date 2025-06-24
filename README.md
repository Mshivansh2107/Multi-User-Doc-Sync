# Real-time Collaborative Document Editor

A modern, production-ready collaborative document editor built with React, TypeScript, Node.js, and Socket.io. Features real-time editing, user collaboration, and integrated chat functionality.

## Features

### Core Functionality
- **Rich Text Editor**: Full-featured editor with formatting toolbar (bold, italic, underline, font sizes, colors)
- **Real-time Collaboration**: All changes sync instantly across all connected users
- **Multi-user Cursors**: See where other users are typing with colored indicators
- **User Management**: Live user list with join/leave notifications
- **Document Management**: Auto-save, status indicators, and title editing
- **Integrated Chat**: Real-time messaging between collaborators

### Technical Features
- **Operational Transformation**: Basic conflict resolution for concurrent edits
- **WebSocket Connections**: Real-time bidirectional communication
- **Responsive Design**: Optimized for desktop and tablet devices
- **Error Handling**: Comprehensive error states and user feedback
- **Connection Management**: Handles disconnections and reconnections gracefully

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Quill.js** via react-quill for rich text editing
- **Socket.io Client** for WebSocket communication
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **Socket.io** for WebSocket server
- **UUID** for unique ID generation
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This starts both the frontend (port 5173) and backend (port 3001) concurrently.

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend server
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint

## Usage

### Document Editing
1. Open the editor in your browser
2. Start typing - changes sync in real-time
3. Use the formatting toolbar for rich text features
4. Edit the document title by clicking on it

### Collaboration
1. Share the URL with collaborators
2. See active users in the sidebar
3. User cursors show where others are editing
4. Use the integrated chat for communication

### Features Overview
- **Auto-save**: Documents save automatically as you type
- **Status Indicators**: See connection status and save state
- **Export**: Download documents as text files
- **Responsive**: Works on desktop and tablet devices

## Architecture

### Frontend Structure
```
src/
├── components/
│   ├── Header/          # Document title and status
│   ├── Editor/          # Rich text editor and toolbar
│   ├── Sidebar/         # User list and chat
│   └── Status/          # Connection and save indicators
├── hooks/               # React hooks for socket and state
├── types/               # TypeScript type definitions
└── utils/               # Helper functions and constants
```

### Backend Structure
```
server/
└── index.js            # Express server with Socket.io
```

### WebSocket Events
- `join-document` - User joins a document
- `operation` - Text editing operations
- `cursor-update` - Cursor position changes
- `chat-message` - Chat messages
- `users-updated` - User list updates
- `document-updated` - Document content updates

## Data Storage

Currently uses in-memory storage for simplicity. For production, consider:
- **Database**: PostgreSQL, MongoDB, or similar
- **Redis**: For session management and caching
- **File Storage**: For document persistence

## Performance Considerations

- **Operational Transformation**: Implements basic conflict resolution
- **Debounced Updates**: Reduces server load from rapid typing
- **Connection Pooling**: Efficient WebSocket management
- **Memory Management**: Proper cleanup of disconnected users

## Security Notes

For production deployment, implement:
- User authentication and authorization
- Rate limiting for operations and messages
- Input validation and sanitization
- HTTPS/WSS for encrypted connections
- Document access controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
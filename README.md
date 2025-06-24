# Real-time Collaborative Document Editor

A modern, production-ready collaborative document editor built with React, TypeScript, Node.js, and Socket.io. Features real-time editing, user collaboration, and integrated chat functionality.

## Features

### Core Functionality
- **Rich Text Editor**: Full-featured editor with comprehensive formatting toolbar
  - **Text Formatting**: Bold, italic, underline
  - **Font Sizes**: Multiple font size options (8px, 10px, 12px, 14px, 16px, 18px, 24px, 32px, 48px)
  - **Text Colors**: Color picker with predefined color palette
- **Real-time Collaboration**: All changes sync instantly across all connected users
- **Multi-user Cursors**: See where other users are typing with colored indicators and usernames
- **User Management**: Live user list with join/leave notifications
- **Document Management**: Status indicators and title editing
- **Integrated Chat**: Real-time messaging between collaborators

### Advanced Features
- **Enhanced Export Functionality**: 
  - Export documents as Word-compatible HTML files
  - Preserves all formatting (bold, italic, underline, colors, font sizes)
  - Professional document structure with proper styling
- **Real-time Cursor Tracking**: 
  - Colored cursors for each user with unique colors
  - Username labels on cursors for easy identification
  - Smooth cursor movement and position updates
- **Robust Synchronization**: 
  - Operational transformation for conflict resolution
  - Server-side formatting application to prevent infinite loops
  - Efficient delta-based updates to minimize network traffic
  - Automatic reconnection handling with state preservation

### Technical Features
- **Operational Transformation**: Advanced conflict resolution for concurrent edits
- **WebSocket Connections**: Real-time bidirectional communication
- **Responsive Design**: Optimized for desktop and tablet devices
- **Error Handling**: Comprehensive error states and user feedback
- **Connection Management**: Handles disconnections and reconnections gracefully
- **Performance Optimization**: Efficient content comparison

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Quill.js** via react-quill for rich text editing
- **quill-cursors** for real-time cursor visualization
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
3. Use the comprehensive formatting toolbar for rich text features:
   - **Formatting**: Click bold, italic, or underline buttons
   - **Font Size**: Select from dropdown menu (8px to 48px)
   - **Colors**: Use color picker for text colors
4. Edit the document title by clicking on it

### Collaboration
1. Share the URL with collaborators
2. See active users in the sidebar with unique colors
3. User cursors show where others are editing with username labels
4. Use the integrated chat for communication
5. All formatting changes are synchronized in real-time

### Export Features
1. Click the export button in the toolbar
2. Download a Word-compatible HTML file
3. Open in Microsoft Word or any HTML editor
4. All formatting (bold, italic, colors, font sizes) is preserved

### Features Overview
- **Status Indicators**: See connection status and save state
- **Real-time Cursors**: Track other users' editing positions
- **Enhanced Export**: Download formatted documents as HTML files
- **Responsive**: Works on desktop and tablet devices
- **Robust Sync**: Handles concurrent edits without conflicts

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

- **Operational Transformation**: Implements advanced conflict resolution
- **Connection Pooling**: Efficient WebSocket management
- **Memory Management**: Proper cleanup of disconnected users
- **Content Comparison**: Prevents redundant updates and infinite loops
- **Server-side Formatting**: Ensures consistent formatting across all clients

## Security Notes

For production deployment, implement:
- User authentication and authorization
- Rate limiting for operations and messages
- Input validation and sanitization
- HTTPS/WSS for encrypted connections
- Document access controls

## Recent Updates

### Enhanced Features Added:
- **Comprehensive Formatting Toolbar**: Added font sizes and colors
- **Real-time Cursor Visualization**: Integrated quill-cursors with username labels
- **Word-compatible Export**: Export documents with full formatting preservation
- **Robust Synchronization**: Improved conflict resolution and state management
- **Performance Optimizations**: Better handling of concurrent edits and formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Output:
![image](https://github.com/user-attachments/assets/0189179a-6245-4921-9efb-78a012ce6f79)
![image](https://github.com/user-attachments/assets/45bcebbb-40b1-4267-95c4-32bada678cf5)


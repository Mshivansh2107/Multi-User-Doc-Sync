import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header/Header';
import { Editor } from './components/Editor/Editor';
import { UserList } from './components/Sidebar/UserList';
import { Chat } from './components/Sidebar/Chat';
import { useSocket } from './hooks/useSocket';
import { User, Document, Operation } from './types/types';
import { getRandomColor } from './utils/colors';

function App() {
  const [currentUser] = useState<User>(() => ({
    id: uuidv4(),
    name: `User ${Math.floor(Math.random() * 1000)}`,
    color: getRandomColor(),
    lastActive: Date.now(),
  }));

  const [document, setDocument] = useState<Document>({
    id: 'default-doc',
    title: 'Untitled Document',
    content: { ops: [{ insert: '\n' }] },
    lastModified: Date.now(),
    version: 1,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  const {
    isConnected,
    users,
    messages,
    sendOperation,
    sendCursorUpdate,
    sendChatMessage,
    onOperation,
    onDocumentUpdate,
  } = useSocket(document.id, currentUser);

  useEffect(() => {
    // Handle operations from other users
    onOperation((operation: Operation) => {
      console.log('Received operation from user:', operation.userId);
      // In a production app, you would apply operational transformation here
      // For now, we just log it since the server handles the content updates
    });

    // Handle document content updates
    onDocumentUpdate((content: any) => {
      setDocument(prev => {
        // Only update if content is actually different
        const currentContentString = JSON.stringify(prev.content);
        const newContentString = JSON.stringify(content);
        
        if (currentContentString !== newContentString) {
          return {
            ...prev,
            content,
            lastModified: Date.now(),
          };
        }
        return prev;
      });
      
      setIsSaving(false);
      setLastSaved(Date.now());
    });
  }, [onOperation, onDocumentUpdate]);

  const handleContentChange = (content: any) => {
    // Update local document state immediately for responsive UI
    setDocument(prev => ({
      ...prev,
      content,
      lastModified: Date.now(),
    }));
    
    setIsSaving(true);
    
    // Simulate save completion
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(Date.now());
    }, 500);
  };

  const handleOperation = (operation: Operation) => {
    sendOperation(operation);
  };

  const handleSelectionChange = (range: { index: number; length: number } | null) => {
    if (range) {
      sendCursorUpdate(range);
    }
  };

  const handleTitleChange = (title: string) => {
    setDocument(prev => ({
      ...prev,
      title,
      lastModified: Date.now(),
    }));
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(Date.now());
    }, 500);
  };

  const handleExport = () => {
    // Convert Quill Delta to HTML with formatting preserved
    const convertDeltaToHtml = (delta: any) => {
      let html = '';
      let currentIndex = 0;
      
      delta.ops.forEach((op: any) => {
        if (op.insert) {
          let text = op.insert;
          let attributes = op.attributes || {};
          
          // Apply formatting attributes
          if (attributes.bold) text = `<strong>${text}</strong>`;
          if (attributes.italic) text = `<em>${text}</em>`;
          if (attributes.underline) text = `<u>${text}</u>`;
          if (attributes.color) text = `<span style="color: ${attributes.color}">${text}</span>`;
          if (attributes.size) text = `<span style="font-size: ${attributes.size}">${text}</span>`;
          
          html += text;
        } else if (op.retain) {
          // Handle retain operations (formatting only)
          if (op.attributes) {
            let attributes = op.attributes;
            let text = '';
            
            // Extract text for this range from the delta
            let textIndex = 0;
            for (let i = 0; i < delta.ops.length; i++) {
              if (delta.ops[i].insert) {
                if (textIndex >= currentIndex && textIndex < currentIndex + op.retain) {
                  text += delta.ops[i].insert;
                }
                textIndex += delta.ops[i].insert.length;
              }
            }
            
            // Apply formatting
            if (attributes.bold) text = `<strong>${text}</strong>`;
            if (attributes.italic) text = `<em>${text}</em>`;
            if (attributes.underline) text = `<u>${text}</u>`;
            if (attributes.color) text = `<span style="color: ${attributes.color}">${text}</span>`;
            if (attributes.size) text = `<span style="font-size: ${attributes.size}">${text}</span>`;
            
            html += text;
          }
          currentIndex += op.retain;
        }
      });
      
      return html;
    };
    
    const htmlContent = convertDeltaToHtml(document.content);
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>${document.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        strong { font-weight: bold; }
        em { font-style: italic; }
        u { text-decoration: underline; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.doc`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        documentTitle={document.title}
        onTitleChange={handleTitleChange}
        userCount={users.length}
        isConnected={isConnected}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onExport={handleExport}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex">
          <Editor
            content={document.content}
            onChange={handleContentChange}
            onOperation={handleOperation}
            onSelectionChange={handleSelectionChange}
            isConnected={isConnected}
            userId={currentUser.id}
            users={users}
          />
        </div>
        
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <UserList users={users} currentUserId={currentUser.id} />
          <div className="flex-1">
            <Chat
              messages={messages}
              onSendMessage={sendChatMessage}
              currentUserId={currentUser.id}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
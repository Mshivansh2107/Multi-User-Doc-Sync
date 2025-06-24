import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { Toolbar } from './Toolbar';
import { Operation } from '../../types/types';
import Quill from 'quill';
// @ts-ignore
import QuillCursors from 'quill-cursors';

interface EditorProps {
  content: any;
  onChange: (content: any) => void;
  onOperation: (operation: Operation) => void;
  onSelectionChange: (range: { index: number; length: number } | null) => void;
  isConnected: boolean;
  userId: string;
  users: any[]; // Add users prop for collaborative cursors
}

Quill.register('modules/cursors', QuillCursors);

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  onOperation,
  onSelectionChange,
  isConnected,
  userId,
  users,
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isReceivingUpdate, setIsReceivingUpdate] = useState(false);
  const ignoreNextChange = useRef(false);
  const lastProcessedContent = useRef<string>('');

  const modules = {
    toolbar: false, // We're using custom toolbar
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true
    },
    cursors: true,
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background'
  ];

  // Handle incoming content updates from other users
  useEffect(() => {
    if (content && quillRef.current && !isReceivingUpdate) {
      const quill = quillRef.current.getEditor();
      const currentContent = quill.getContents();
      
      // More robust content comparison
      const currentContentString = JSON.stringify(currentContent);
      const newContentString = JSON.stringify(content);
      const lastProcessedString = lastProcessedContent.current;
      
      // Only update if content is genuinely different and not already processed
      if (currentContentString !== newContentString && newContentString !== lastProcessedString) {
        setIsReceivingUpdate(true);
        ignoreNextChange.current = true;
        lastProcessedContent.current = newContentString;
        
        // Preserve cursor position
        const selection = quill.getSelection();
        
        // Update content
        quill.setContents(content, 'silent');
        
        // Restore cursor position
        if (selection) {
          setTimeout(() => {
            quill.setSelection(selection);
          }, 0);
        }
        
        // Update local state
        onChange(content);
        
        setTimeout(() => {
          setIsReceivingUpdate(false);
        }, 100);
      }
    }
  }, [content, isReceivingUpdate, onChange]);

  // Collaborative cursors effect
  useEffect(() => {
    if (quillRef.current && users) {
      const quill = quillRef.current.getEditor();
      const cursors = quill.getModule('cursors');
      users.forEach(user => {
        if (user.cursor && user.id !== userId) {
          cursors.createCursor(user.id, user.name, user.color);
          cursors.moveCursor(user.id, user.cursor);
        } else if (!user.cursor) {
          cursors.removeCursor(user.id);
        }
      });
    }
  }, [users, userId]);

  const handleChange = (value: string, delta: any, source: string, editor: any) => {
    // Ignore changes that we triggered programmatically
    if (ignoreNextChange.current) {
      ignoreNextChange.current = false;
      return;
    }

    // Only handle user-initiated changes and ignore server updates
    if (source === 'user' && !isReceivingUpdate) {
      // Check if this is a text-changing operation (not just formatting)
      const hasTextChanges = delta.ops.some((op: any) => 
        op.insert || op.delete || (op.retain && op.attributes && Object.keys(op.attributes).length > 0)
      );
      
      if (hasTextChanges && delta.ops && delta.ops.length > 0) {
        // Send the delta to server immediately
        const operation: Operation = {
          type: 'insert',
          index: 0,
          text: JSON.stringify(delta),
          userId,
          timestamp: Date.now()
        };
        onOperation(operation);
      }
    }
  };

  const handleSelectionChange = (range: any, source: string) => {
    // Only handle user selection changes, not programmatic ones
    if (source === 'user' && !isReceivingUpdate) {
      if (range) {
        onSelectionChange({ index: range.index, length: range.length });
      } else {
        onSelectionChange(null);
      }
    }
  };

  const handleFormat = (format: string, value?: any) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      
      if (range && range.length > 0) {
        try {
          // Apply formatting locally first for immediate feedback
          const currentFormat = quill.getFormat(range);
          const newValue = value !== undefined ? value : !currentFormat[format];
          
          // Apply formatting locally
          quill.formatText(range.index, range.length, format, newValue, 'user');
          
          // Send formatting operation to server
          const operation: Operation = {
            type: 'retain',
            index: range.index,
            length: range.length,
            attributes: { [format]: newValue },
            userId,
            timestamp: Date.now()
          };
          onOperation(operation);
        } catch (error) {
          console.error('Error applying formatting:', error);
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Toolbar onFormat={handleFormat} />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={handleChange}
            onChangeSelection={handleSelectionChange}
            readOnly={!isConnected}
            className="min-h-[600px] editor-content"
            placeholder="Start writing your document..."
          />
        </div>
      </div>
    </div>
  );
};
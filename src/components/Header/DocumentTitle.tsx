import React, { useState, useRef, useEffect } from 'react';
import { Edit3 } from 'lucide-react';

interface DocumentTitleProps {
  title: string;
  onChange: (title: string) => void;
  disabled?: boolean;
}

export const DocumentTitle: React.FC<DocumentTitleProps> = ({
  title,
  onChange,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (localTitle.trim() && localTitle !== title) {
      onChange(localTitle.trim());
    } else {
      setLocalTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setLocalTitle(title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className="text-lg font-medium text-gray-900 bg-transparent border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={disabled}
      />
    );
  }

  return (
    <button
      onClick={() => !disabled && setIsEditing(true)}
      className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors group"
      disabled={disabled}
    >
      <span>{title}</span>
      {!disabled && (
        <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
};
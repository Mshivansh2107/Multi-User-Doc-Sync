import React from 'react';
import { DocumentTitle } from './DocumentTitle';
import { StatusIndicator } from '../Status/StatusIndicator';
import { Users, FileText, Download } from 'lucide-react';

interface HeaderProps {
  documentTitle: string;
  onTitleChange: (title: string) => void;
  userCount: number;
  isConnected: boolean;
  isSaving: boolean;
  lastSaved: number | null;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  documentTitle,
  onTitleChange,
  userCount,
  isConnected,
  isSaving,
  lastSaved,
  onExport,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-900">DocEditor</span>
        </div>
        <div className="h-6 w-px bg-gray-300" />
        <DocumentTitle
          title={documentTitle}
          onChange={onTitleChange}
          disabled={!isConnected}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{userCount} active</span>
        </div>
        
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          disabled={!isConnected}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        
        <StatusIndicator
          isConnected={isConnected}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      </div>
    </header>
  );
};
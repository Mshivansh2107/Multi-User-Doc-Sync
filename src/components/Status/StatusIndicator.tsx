import React from 'react';
import { Wifi, WifiOff, Save, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  isConnected: boolean;
  isSaving: boolean;
  lastSaved: number | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isConnected,
  isSaving,
  lastSaved,
}) => {
  const getStatusText = () => {
    if (!isConnected) return 'Offline';
    if (isSaving) return 'Saving...';
    if (lastSaved) {
      const secondsAgo = Math.floor((Date.now() - lastSaved) / 1000);
      if (secondsAgo < 60) return 'Saved';
      if (secondsAgo < 3600) return `Saved ${Math.floor(secondsAgo / 60)}m ago`;
      return `Saved ${Math.floor(secondsAgo / 3600)}h ago`;
    }
    return 'Not saved';
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="w-4 h-4" />;
    if (isSaving) return <Save className="w-4 h-4 animate-pulse" />;
    if (lastSaved) return <Clock className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (!isConnected) return 'text-red-600 bg-red-50';
    if (isSaving) return 'text-blue-600 bg-blue-50';
    if (lastSaved) return 'text-green-600 bg-green-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};
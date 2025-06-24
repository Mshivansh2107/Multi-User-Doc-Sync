import React from 'react';
import { Bold, Italic, Underline, Type, Palette } from 'lucide-react';

interface ToolbarProps {
  onFormat: (format: string, value?: any) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onFormat }) => {
  const fontSizes = [8, 10, 12, 14, 16, 18, 24, 32, 48];
  const colors = [
    '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
    '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
    '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b266', '#66a3e0', '#c285ff',
    '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
    '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center space-x-4">
        {/* Text formatting */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onFormat('bold')}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFormat('italic')}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFormat('underline')}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Font size */}
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4 text-gray-600" />
          <select
            onChange={(e) => onFormat('size', e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="14"
          >
            {fontSizes.map(size => (
              <option key={size} value={`${size}px`}>{size}px</option>
            ))}
          </select>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Text color */}
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-gray-600" />
          <div className="flex flex-wrap gap-1">
            {colors.slice(0, 8).map(color => (
              <button
                key={color}
                onClick={() => onFormat('color', color)}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={`Text color: ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
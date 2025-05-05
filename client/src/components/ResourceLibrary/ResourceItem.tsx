import React from 'react';
import { ResourceItem as ResourceItemType } from '../../types';
import { format } from 'date-fns';

interface ResourceItemProps {
  item: ResourceItemType;
  onUse: (item: ResourceItemType) => void;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  item,
  onUse,
  onTogglePin,
  onRemove
}) => {
  // Format time
  const formatTime = (timestamp: number): string => {
    const now = new Date();
    const itemDate = new Date(timestamp);
    
    // If it's today, show relative time
    if (itemDate.toDateString() === now.toDateString()) {
      const diffMs = now.getTime() - itemDate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      return `${Math.floor(diffMinutes / 60)}h ago`;
    }
    
    // If it's yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (itemDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise show date
    return format(itemDate, 'MMM d');
  };

  // Render item preview based on type
  const renderPreview = () => {
    switch (item.type) {
      case 'image':
      case 'capture':
        return (
          <div className="relative h-24 overflow-hidden">
            <img src={item.content} alt={item.title} className="w-full h-full object-cover" />
            {item.type === 'capture' && (
              <div className="absolute top-1 right-1">
                <div className="bg-tldraw-primary text-white text-xs px-1.5 py-0.5 rounded">
                  Capture
                </div>
              </div>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div className="p-3 h-24 overflow-hidden text-xs text-gray-600">
            {item.content}
          </div>
        );
      
      case 'html':
        return (
          <div className="p-3 h-24 overflow-hidden text-xs text-gray-600">
            <div className="line-clamp-5">{item.content.replace(/<[^>]*>/g, ' ')}</div>
          </div>
        );
      
      case 'code':
        return (
          <div className="p-3 h-24 overflow-hidden text-xs bg-gray-900 text-green-400 font-mono">
            <pre className="line-clamp-6">{item.content}</pre>
          </div>
        );
      
      case 'custom':
        return (
          <div className="p-3 h-24 flex items-center justify-center bg-gray-50">
            <div 
              dangerouslySetInnerHTML={{ __html: item.preview || '' }} 
              className="max-w-full max-h-full overflow-hidden"
            />
          </div>
        );
      
      default:
        return (
          <div className="p-3 h-24 flex items-center justify-center bg-gray-100 text-gray-400">
            <span>No preview available</span>
          </div>
        );
    }
  };

  return (
    <div className="clipboard-item bg-white rounded shadow-tldraw-sm mb-3 overflow-hidden border border-tldraw-border group">
      {/* Item Preview */}
      <div className="relative">
        {renderPreview()}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            onClick={() => onUse(item)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md mr-2 tooltip" 
            data-tooltip="Use resource"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L10 19L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={() => onTogglePin(item.id)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md tooltip" 
            data-tooltip={item.isPinned ? "Remove pin" : "Pin to library"}
          >
            {item.isPinned ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Item Footer */}
      <div className="p-2 flex items-center justify-between border-t border-tldraw-border">
        <span className="text-xs truncate">{item.title}</span>
        <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
      </div>
    </div>
  );
};

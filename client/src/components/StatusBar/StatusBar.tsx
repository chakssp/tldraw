import React from 'react';

interface StatusBarProps {
  zoom: number;
  isGridVisible: boolean;
  lastSaved: Date | null;
  onZoomChange: (zoom: number) => void;
  onToggleGrid: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  zoom,
  isGridVisible,
  lastSaved,
  onZoomChange,
  onToggleGrid
}) => {
  // Format last saved time
  const formatLastSaved = (): string => {
    if (!lastSaved) return 'Not saved';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 5) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    
    return lastSaved.toLocaleTimeString();
  };

  return (
    <footer className="h-8 border-t border-tldraw-border flex items-center px-3 text-sm text-gray-500">
      <div className="flex-1 flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <span>Zoom:</span>
          <button 
            className="px-1 hover:bg-tldraw-hover rounded"
            onClick={() => onZoomChange(zoom - 10)}
            disabled={zoom <= 10}
          >
            -
          </button>
          <span>{zoom}%</span>
          <button 
            className="px-1 hover:bg-tldraw-hover rounded"
            onClick={() => onZoomChange(zoom + 10)}
          >
            +
          </button>
        </div>
        
        <button 
          className={`flex items-center space-x-1 px-2 py-0.5 rounded ${isGridVisible ? 'bg-tldraw-selected' : 'hover:bg-tldraw-hover'}`}
          onClick={onToggleGrid}
        >
          <span>Grid:</span>
          <span>{isGridVisible ? 'On' : 'Off'}</span>
        </button>
      </div>
      
      <div>
        <span>Last saved: {formatLastSaved()}</span>
      </div>
    </footer>
  );
};

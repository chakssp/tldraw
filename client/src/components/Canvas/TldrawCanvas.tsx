import React, { useEffect, useRef, useState } from 'react';
import { ResourceItem } from '../../types';
import { useStylus } from '../../hooks/use-stylus';

interface TldrawCanvasProps {
  onDropResource: (item: ResourceItem, x: number, y: number) => void;
}

export const TldrawCanvas: React.FC<TldrawCanvasProps> = ({
  onDropResource
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stylus = useStylus();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'resource' && parsedData.id) {
          // In a real implementation, we would retrieve the resource by ID
          // For this mockup, we'll assume the resource is passed through props
          
          // Calculate drop position relative to canvas
          const canvasRect = canvasRef.current?.getBoundingClientRect();
          if (canvasRect) {
            const x = e.clientX - canvasRect.left;
            const y = e.clientY - canvasRect.top;
            
            // Call the provided callback with position
            onDropResource({
              id: parsedData.id,
              type: 'image', // Placeholder
              content: '', // Placeholder
              title: 'Dropped Resource', // Placeholder
              timestamp: Date.now(),
              isPinned: false
            }, x, y);
          }
        }
      } catch (error) {
        console.error('Failed to parse drop data:', error);
      }
    }
  };

  return (
    <div 
      ref={canvasRef}
      className={`w-full h-full relative ${isDraggingOver ? 'bg-tldraw-selected' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIEwgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')`
      }}></div>
      
      {/* Canvas Content - This would be rendered by tldraw in a real implementation */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Content would be managed by tldraw */}
      </div>

      {/* Stylus Info (Debug) */}
      {stylus.isAvailable && (
        <div className="absolute bottom-20 right-2 text-xs bg-white p-2 rounded shadow-md opacity-50 pointer-events-none">
          <div>Stylus {stylus.isActive ? 'Active' : 'Inactive'}</div>
          {stylus.isActive && (
            <div>
              <div>Pressure: {stylus.pressure.toFixed(2)}</div>
              <div>Tilt X: {stylus.tiltX.toFixed(2)}</div>
              <div>Tilt Y: {stylus.tiltY.toFixed(2)}</div>
            </div>
          )}
        </div>
      )}

      {/* Watermark */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
        Made with tldraw
      </div>
      
      {/* Drop Indicator */}
      {isDraggingOver && (
        <div className="absolute inset-0 border-2 border-tldraw-primary border-dashed pointer-events-none"></div>
      )}
    </div>
  );
};

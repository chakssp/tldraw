import React from 'react';
import { ResourceLibraryVisibility } from '../../types';
import { useResourceLibrary } from '../../context/ResourceLibraryContext';

interface ToolbarPanelProps {
  activeTool: string;
  onChangeTool: (tool: string) => void;
  onOpenScreenCapture: () => void;
  onOpenCustomInput: () => void;
}

export const ToolbarPanel: React.FC<ToolbarPanelProps> = ({
  activeTool,
  onChangeTool,
  onOpenScreenCapture,
  onOpenCustomInput
}) => {
  const { visibility, setVisibility } = useResourceLibrary();

  const handleResourceLibraryClick = () => {
    setVisibility(
      visibility === ResourceLibraryVisibility.Visible 
        ? ResourceLibraryVisibility.Hidden 
        : ResourceLibraryVisibility.Visible
    );
  };

  return (
    <div className="w-12 border-r border-tldraw-border bg-white flex flex-col items-center py-2 h-full">
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* Tools */}
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center ${activeTool === 'select' ? 'bg-tldraw-selected' : 'hover:bg-tldraw-hover'} group relative`}
          onClick={() => onChangeTool('select')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7279 8.26758L18.7279 11.2676L8.72791 21.2676L3.72791 22.2676L4.72791 17.2676L14.7279 7.26758L15.7279 8.26758Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Select (V)</span>
        </button>
        
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center ${activeTool === 'rectangle' ? 'bg-tldraw-selected' : 'hover:bg-tldraw-hover'} group relative`}
          onClick={() => onChangeTool('rectangle')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Rectangle (R)</span>
        </button>
        
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center ${activeTool === 'ellipse' ? 'bg-tldraw-selected' : 'hover:bg-tldraw-hover'} group relative`}
          onClick={() => onChangeTool('ellipse')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Ellipse (E)</span>
        </button>
        
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center ${activeTool === 'arrow' ? 'bg-tldraw-selected' : 'hover:bg-tldraw-hover'} group relative`}
          onClick={() => onChangeTool('arrow')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20L20 4M20 4H10M20 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Arrow (A)</span>
        </button>
        
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center ${activeTool === 'text' ? 'bg-tldraw-selected' : 'hover:bg-tldraw-hover'} group relative`}
          onClick={() => onChangeTool('text')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Text (T)</span>
        </button>

        <div className="w-8 h-px bg-tldraw-border my-1"></div>
        
        {/* Resource Library Button */}
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center ${visibility === ResourceLibraryVisibility.Visible ? 'bg-tldraw-selected text-tldraw-primary' : 'hover:bg-tldraw-hover text-tldraw-primary'} group relative`}
          onClick={handleResourceLibraryClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Resource Library (L)</span>
        </button>
        
        {/* Screen Capture Button */}
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center hover:bg-tldraw-hover group relative`}
          onClick={onOpenScreenCapture}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Screen Capture (C)</span>
        </button>
        
        {/* Custom Input Button */}
        <button 
          className={`w-9 h-9 rounded flex items-center justify-center hover:bg-tldraw-hover group relative`}
          onClick={onOpenCustomInput}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 9L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-tldraw-secondary text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Custom Element (I)</span>
        </button>
      </div>
    </div>
  );
};

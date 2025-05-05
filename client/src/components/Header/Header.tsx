import React, { useState } from 'react';

interface HeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onShareClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onTitleChange,
  onShareClick
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  
  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(title);
  };
  
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim()) {
      onTitleChange(editedTitle);
    } else {
      setEditedTitle(title);
    }
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      if (editedTitle.trim()) {
        onTitleChange(editedTitle);
      } else {
        setEditedTitle(title);
      }
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setEditedTitle(title);
    }
  };

  return (
    <header className="h-12 border-b border-tldraw-border flex items-center px-3 bg-white">
      <div className="flex-1 flex items-center">
        {/* Logo */}
        <div className="mr-4">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-tldraw-primary">
            <path d="M16 6.72821C10.7761 6.72821 6.72824 10.776 6.72824 15.9999C6.72824 21.2239 10.7761 25.2717 16 25.2717C21.2239 25.2717 25.2717 21.2239 25.2717 15.9999C25.2717 10.776 21.2239 6.72821 16 6.72821ZM16 3.45654C23.0751 3.45654 28.5434 8.92478 28.5434 15.9999C28.5434 23.0751 23.0751 28.5433 16 28.5433C8.92483 28.5433 3.45659 23.0751 3.45659 15.9999C3.45659 8.92478 8.92483 3.45654 16 3.45654Z" fill="currentColor"/>
            <path d="M19.7751 11.5414L17.9764 15.1477L21.5633 16.9372L14.2249 20.4584L16.0236 16.8522L12.4367 15.0627L19.7751 11.5414Z" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Document Title */}
        <div className="mr-4">
          {isEditingTitle ? (
            <input 
              type="text" 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="border border-tldraw-border rounded px-2 py-1 text-sm focus:outline-none focus:border-tldraw-primary"
              autoFocus
            />
          ) : (
            <div 
              onClick={handleTitleClick}
              className="px-2 py-1 text-sm border border-transparent hover:bg-tldraw-hover rounded cursor-text"
            >
              {title || 'Untitled'}
            </div>
          )}
        </div>
        
        {/* Main Menu */}
        <div className="hidden sm:flex space-x-1">
          <button className="px-2 py-1 text-sm rounded hover:bg-tldraw-hover">File</button>
          <button className="px-2 py-1 text-sm rounded hover:bg-tldraw-hover">Edit</button>
          <button className="px-2 py-1 text-sm rounded hover:bg-tldraw-hover">View</button>
          <button className="px-2 py-1 text-sm rounded hover:bg-tldraw-hover">Preferences</button>
          <button className="px-2 py-1 text-sm rounded hover:bg-tldraw-hover">Help</button>
        </div>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button 
          className="flex items-center px-3 py-1 text-sm rounded text-white bg-tldraw-primary hover:bg-opacity-90"
          onClick={onShareClick}
        >
          <span>Share</span>
        </button>
        
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-tldraw-hover">
          <span className="w-6 h-6 bg-tldraw-primary text-white rounded-full flex items-center justify-center text-sm font-medium">U</span>
        </button>
      </div>
    </header>
  );
};

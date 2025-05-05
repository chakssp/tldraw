import React, { useState, useEffect } from 'react';
import { ResourceItem as ResourceItemType, ResourceTab, ResourceLibraryVisibility } from '../../types';
import { ResourceItem } from './ResourceItem';
import { ResourceLibraryTabs } from './ResourceLibraryTabs';
import { ResourceLibraryStatus } from './ResourceLibraryStatus';
import { useResourceLibrary } from '../../context/ResourceLibraryContext';

interface ResourceLibraryPanelProps {
  onDragResource: (item: ResourceItemType) => void;
  onUseResource: (item: ResourceItemType) => void;
}

export const ResourceLibraryPanel: React.FC<ResourceLibraryPanelProps> = ({
  onDragResource,
  onUseResource
}) => {
  const {
    resources,
    clipboardStatus,
    activeTab,
    visibility,
    clipboardResources,
    pinnedResources,
    captureResources,
    setActiveTab,
    setVisibility,
    togglePinResource,
    removeResource,
    requestClipboardPermission,
    clearClipboardItems
  } = useResourceLibrary();

  // Handle permission request
  const handleRequestPermission = async () => {
    await requestClipboardPermission();
  };

  // Get current resources based on active tab
  const getCurrentResources = () => {
    switch (activeTab) {
      case 'clipboard':
        return clipboardResources;
      case 'pinned':
        return pinnedResources;
      case 'captures':
        return captureResources;
      default:
        return [];
    }
  };
  
  // Get current resources section title
  const getCurrentSectionTitle = () => {
    switch (activeTab) {
      case 'clipboard':
        return 'RECENTLY COPIED';
      case 'pinned':
        return 'PINNED RESOURCES';
      case 'captures':
        return 'SCREEN CAPTURES';
      default:
        return '';
    }
  };

  // Handle drag start for resource items
  const handleDragStart = (e: React.DragEvent, item: ResourceItemType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'resource', id: item.id }));
    
    // Create a ghost element for the drag operation
    const ghost = document.createElement('div');
    ghost.className = 'fixed pointer-events-none opacity-70 z-50 rounded shadow-lg overflow-hidden';
    ghost.id = 'dragGhost';
    
    // Add content to ghost based on item type
    if (item.type === 'image' || item.type === 'capture') {
      const img = document.createElement('img');
      img.src = item.content;
      img.className = 'w-32 h-24 object-cover';
      ghost.appendChild(img);
    } else {
      ghost.className += ' bg-white w-32 h-24 p-2 text-xs';
      ghost.textContent = item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '');
    }
    
    document.body.appendChild(ghost);
    
    // Position ghost near cursor
    ghost.style.left = e.clientX + 'px';
    ghost.style.top = e.clientY + 'px';
    
    // Set dragImage to an empty transparent image (we'll handle custom ghost element ourselves)
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    
    // Call the provided onDragResource callback
    onDragResource(item);
    
    // Update ghost position during drag
    const moveGhost = (moveEvent: MouseEvent) => {
      const ghostElement = document.getElementById('dragGhost');
      if (ghostElement) {
        ghostElement.style.left = (moveEvent.clientX + 10) + 'px';
        ghostElement.style.top = (moveEvent.clientY + 10) + 'px';
      }
    };
    
    document.addEventListener('mousemove', moveGhost);
    
    // Remove ghost and event listener on drag end
    const handleDragEnd = () => {
      const ghostElement = document.getElementById('dragGhost');
      if (ghostElement && ghostElement.parentNode) {
        ghostElement.parentNode.removeChild(ghostElement);
      }
      document.removeEventListener('mousemove', moveGhost);
      document.removeEventListener('dragend', handleDragEnd);
    };
    
    document.addEventListener('dragend', handleDragEnd);
  };

  // Don't render if not visible
  if (visibility === ResourceLibraryVisibility.Hidden) {
    return null;
  }

  return (
    <div className="w-64 border-l border-tldraw-border bg-white overflow-y-auto transition-all duration-300 ease-in-out h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-tldraw-border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Resource Library</h2>
          <button 
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-tldraw-hover text-gray-500"
            onClick={() => setVisibility(ResourceLibraryVisibility.Hidden)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <ResourceLibraryTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          clipboardCount={clipboardResources.length}
          pinnedCount={pinnedResources.length}
          capturesCount={captureResources.length}
        />
      </div>
      
      {/* Clipboard Status */}
      <ResourceLibraryStatus 
        status={clipboardStatus}
        onRequestPermission={handleRequestPermission}
      />
      
      {/* Resource Items */}
      <div className="p-3 flex-1 overflow-y-auto">
        {/* Current Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-medium text-gray-500">{getCurrentSectionTitle()}</h3>
            {activeTab === 'clipboard' && clipboardResources.length > 0 && (
              <button 
                onClick={clearClipboardItems}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Resource Items List */}
          {getCurrentResources().length > 0 ? (
            <div>
              {getCurrentResources().map((item) => (
                <div 
                  key={item.id} 
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <ResourceItem 
                    item={item}
                    onUse={onUseResource}
                    onTogglePin={togglePinResource}
                    onRemove={removeResource}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              {activeTab === 'clipboard' && (
                <>
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>Copy something to see it here</p>
                </>
              )}
              
              {activeTab === 'pinned' && (
                <>
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p>Pin items to save them here</p>
                </>
              )}
              
              {activeTab === 'captures' && (
                <>
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Capture screens to see them here</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

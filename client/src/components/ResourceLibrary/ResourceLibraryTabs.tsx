import React from 'react';
import { ResourceTab } from '../../types';

interface ResourceLibraryTabsProps {
  activeTab: ResourceTab;
  onTabChange: (tab: ResourceTab) => void;
  clipboardCount: number;
  pinnedCount: number;
  capturesCount: number;
}

export const ResourceLibraryTabs: React.FC<ResourceLibraryTabsProps> = ({
  activeTab,
  onTabChange,
  clipboardCount,
  pinnedCount,
  capturesCount
}) => {
  return (
    <div className="flex mt-2 text-sm">
      <button 
        className={`px-3 py-1 border-b-2 ${activeTab === 'clipboard' 
          ? 'border-tldraw-primary text-tldraw-primary' 
          : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        onClick={() => onTabChange('clipboard')}
      >
        Clipboard{clipboardCount > 0 ? ` (${clipboardCount})` : ''}
      </button>
      
      <button 
        className={`px-3 py-1 border-b-2 ${activeTab === 'pinned' 
          ? 'border-tldraw-primary text-tldraw-primary' 
          : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        onClick={() => onTabChange('pinned')}
      >
        Pinned{pinnedCount > 0 ? ` (${pinnedCount})` : ''}
      </button>
      
      <button 
        className={`px-3 py-1 border-b-2 ${activeTab === 'captures' 
          ? 'border-tldraw-primary text-tldraw-primary' 
          : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        onClick={() => onTabChange('captures')}
      >
        Captures{capturesCount > 0 ? ` (${capturesCount})` : ''}
      </button>
    </div>
  );
};

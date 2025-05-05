import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { ResourceItem, ResourceTab, ResourceLibraryVisibility, ClipboardMonitorStatus, CustomElementConfig } from '../types';
import { storage } from '../lib/storage';
import { clipboardUtils } from '../lib/clipboard-utils';
import { screenCaptureUtils } from '../lib/screen-capture';

interface ResourceLibraryContextType {
  // State
  resources: ResourceItem[];
  clipboardStatus: ClipboardMonitorStatus;
  activeTab: ResourceTab;
  visibility: ResourceLibraryVisibility;
  
  // Actions
  addResource: (item: ResourceItem) => void;
  removeResource: (id: string) => void;
  togglePinResource: (id: string) => void;
  updateResource: (id: string, updates: Partial<ResourceItem>) => void;
  setActiveTab: (tab: ResourceTab) => void;
  setVisibility: (visibility: ResourceLibraryVisibility) => void;
  requestClipboardPermission: () => Promise<boolean>;
  captureScreen: () => Promise<ResourceItem | null>;
  createCustomElement: (config: CustomElementConfig) => ResourceItem;
  clearClipboardItems: () => void;
  
  // Filtered resources
  clipboardResources: ResourceItem[];
  pinnedResources: ResourceItem[];
  captureResources: ResourceItem[];
}

const ResourceLibraryContext = createContext<ResourceLibraryContextType | undefined>(undefined);

export const ResourceLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [clipboardStatus, setClipboardStatus] = useState<ClipboardMonitorStatus>({
    isMonitoring: false,
    hasPermission: false
  });
  const [activeTab, setActiveTab] = useState<ResourceTab>('clipboard');
  const [visibility, setVisibility] = useState<ResourceLibraryVisibility>(ResourceLibraryVisibility.Hidden);

  // Initialize resources from local storage
  useEffect(() => {
    const storedResources = storage.getResourceLibrary();
    setResources(storedResources);
    
    // Check saved clipboard permission
    const savedPermission = storage.getClipboardPermission();
    setClipboardStatus(prev => ({ ...prev, hasPermission: savedPermission }));
    
    // Start monitoring if permission was previously granted
    if (savedPermission) {
      startClipboardMonitoring();
    }
  }, []);

  // Save resources to local storage whenever they change
  useEffect(() => {
    storage.saveResourceLibrary(resources);
  }, [resources]);

  // Setup clipboard monitoring with fallback paste event listener
  const startClipboardMonitoring = () => {
    setClipboardStatus(prev => ({ ...prev, isMonitoring: true }));
    
    // Setup fallback paste event listener
    const unsubscribePasteListener = clipboardUtils.setupPasteEventListener((item) => {
      if (item) {
        addResource(item);
      }
    });
    
    // Clean up
    return () => {
      unsubscribePasteListener();
      setClipboardStatus(prev => ({ ...prev, isMonitoring: false }));
    };
  };

  useEffect(() => {
    // Start monitoring if permission is granted
    if (clipboardStatus.hasPermission) {
      const cleanup = startClipboardMonitoring();
      return cleanup;
    }
  }, [clipboardStatus.hasPermission]);

  // Request clipboard permission
  const requestClipboardPermission = async () => {
    const hasPermission = await clipboardUtils.requestPermission();
    setClipboardStatus(prev => ({ ...prev, hasPermission }));
    storage.saveClipboardPermission(hasPermission);
    return hasPermission;
  };

  // Capture screen
  const captureScreen = async () => {
    const capturedItem = await screenCaptureUtils.captureWindow();
    if (capturedItem) {
      addResource(capturedItem);
      return capturedItem;
    }
    return null;
  };

  // Create custom element
  const createCustomElement = (config: CustomElementConfig) => {
    // Create a preview representation of the custom element
    const preview = `<div class="custom-element ${config.type} ${config.styleOptions.style} ${config.styleOptions.size}">${config.label}</div>`;
    
    const item: ResourceItem = {
      id: nanoid(),
      type: 'custom',
      content: JSON.stringify(config),
      preview,
      title: `${config.type.charAt(0).toUpperCase() + config.type.slice(1)} - ${config.label}`,
      timestamp: Date.now(),
      isPinned: true,
      metadata: {
        elementType: config.type,
        style: config.styleOptions.style,
        size: config.styleOptions.size,
        source: 'custom'
      }
    };
    
    addResource(item);
    return item;
  };

  // Add a resource
  const addResource = (item: ResourceItem) => {
    setResources(prev => [item, ...prev]);
  };

  // Remove a resource
  const removeResource = (id: string) => {
    setResources(prev => prev.filter(item => item.id !== id));
  };

  // Toggle pin status of a resource
  const togglePinResource = (id: string) => {
    setResources(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isPinned: !item.isPinned } 
          : item
      )
    );
  };

  // Update a resource
  const updateResource = (id: string, updates: Partial<ResourceItem>) => {
    setResources(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates } 
          : item
      )
    );
  };

  // Clear all non-pinned clipboard items
  const clearClipboardItems = () => {
    setResources(prev => prev.filter(item => item.isPinned));
  };

  // Filter resources by type
  const clipboardResources = useMemo(() => {
    return resources
      .filter(item => !item.isPinned && item.metadata?.source === 'clipboard')
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [resources]);

  const pinnedResources = useMemo(() => {
    return resources
      .filter(item => item.isPinned)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [resources]);

  const captureResources = useMemo(() => {
    return resources
      .filter(item => item.type === 'capture')
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [resources]);

  const value = {
    resources,
    clipboardStatus,
    activeTab,
    visibility,
    addResource,
    removeResource,
    togglePinResource,
    updateResource,
    setActiveTab,
    setVisibility,
    requestClipboardPermission,
    captureScreen,
    createCustomElement,
    clearClipboardItems,
    clipboardResources,
    pinnedResources,
    captureResources
  };

  return (
    <ResourceLibraryContext.Provider value={value}>
      {children}
    </ResourceLibraryContext.Provider>
  );
};

export const useResourceLibrary = () => {
  const context = useContext(ResourceLibraryContext);
  if (context === undefined) {
    throw new Error('useResourceLibrary must be used within a ResourceLibraryProvider');
  }
  return context;
};

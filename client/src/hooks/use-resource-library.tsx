import { useState, useCallback, useEffect } from 'react';
import { ResourceItem } from '../types';
import { storage } from '../lib/storage';
import { nanoid } from 'nanoid';

interface UseResourceLibraryResult {
  resources: ResourceItem[];
  pinnedResources: ResourceItem[];
  clipboardResources: ResourceItem[];
  captureResources: ResourceItem[];
  addResource: (item: ResourceItem) => void;
  removeResource: (id: string) => void;
  togglePinResource: (id: string) => void;
  updateResource: (id: string, updates: Partial<ResourceItem>) => void;
  clearResources: () => void;
}

export function useResourceLibrary(): UseResourceLibraryResult {
  const [resources, setResources] = useState<ResourceItem[]>([]);

  // Initialize resources from local storage
  useEffect(() => {
    const storedResources = storage.getResourceLibrary();
    setResources(storedResources);
  }, []);

  // Save resources to local storage whenever they change
  useEffect(() => {
    storage.saveResourceLibrary(resources);
  }, [resources]);

  const addResource = useCallback((item: ResourceItem) => {
    setResources(prev => {
      // Ensure item has an ID
      if (!item.id) {
        item.id = nanoid();
      }
      
      // Ensure timestamp
      if (!item.timestamp) {
        item.timestamp = Date.now();
      }
      
      // Add to the beginning of the array
      return [item, ...prev];
    });
  }, []);

  const removeResource = useCallback((id: string) => {
    setResources(prev => prev.filter(item => item.id !== id));
  }, []);

  const togglePinResource = useCallback((id: string) => {
    setResources(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isPinned: !item.isPinned } 
          : item
      )
    );
  }, []);

  const updateResource = useCallback((id: string, updates: Partial<ResourceItem>) => {
    setResources(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates } 
          : item
      )
    );
  }, []);

  const clearResources = useCallback(() => {
    // Only clear non-pinned resources
    setResources(prev => prev.filter(item => item.isPinned));
  }, []);

  // Filter resources by type and pinned status
  const pinnedResources = resources.filter(item => item.isPinned);
  const clipboardResources = resources.filter(item => !item.isPinned && item.metadata?.source === 'clipboard');
  const captureResources = resources.filter(item => item.type === 'capture');

  return {
    resources,
    pinnedResources,
    clipboardResources,
    captureResources,
    addResource,
    removeResource,
    togglePinResource,
    updateResource,
    clearResources
  };
}

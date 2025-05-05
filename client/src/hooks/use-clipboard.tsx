import { useState, useEffect, useCallback } from 'react';
import { ResourceItem } from '../types';
import { clipboardUtils } from '../lib/clipboard-utils';

interface UseClipboardResult {
  hasPermission: boolean;
  isMonitoring: boolean;
  latestItem: ResourceItem | null;
  requestPermission: () => Promise<boolean>;
  readFromClipboard: () => Promise<ResourceItem | null>;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

export function useClipboard(): UseClipboardResult {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [latestItem, setLatestItem] = useState<ResourceItem | null>(null);
  const [cleanupFunction, setCleanupFunction] = useState<(() => void) | null>(null);

  const requestPermission = useCallback(async () => {
    const permission = await clipboardUtils.requestPermission();
    setHasPermission(permission);
    return permission;
  }, []);

  const readFromClipboard = useCallback(async () => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) return null;
    }
    
    const item = await clipboardUtils.readFromClipboard();
    if (item) {
      setLatestItem(item);
    }
    return item;
  }, [hasPermission, requestPermission]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring || !hasPermission) return;
    
    setIsMonitoring(true);
    
    // Setup paste event listener as a fallback
    const cleanup = clipboardUtils.setupPasteEventListener((item) => {
      if (item) {
        setLatestItem(item);
      }
    });
    
    setCleanupFunction(() => cleanup);
  }, [isMonitoring, hasPermission]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;
    
    if (cleanupFunction) {
      cleanupFunction();
      setCleanupFunction(null);
    }
    
    setIsMonitoring(false);
  }, [isMonitoring, cleanupFunction]);

  // Check permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.clipboard) {
          const permission = await clipboardUtils.requestPermission();
          setHasPermission(permission);
        }
      } catch (error) {
        console.warn('Error checking clipboard permission:', error);
      }
    };
    
    checkPermission();
    
    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, []);

  return {
    hasPermission,
    isMonitoring,
    latestItem,
    requestPermission,
    readFromClipboard,
    startMonitoring,
    stopMonitoring
  };
}

import { useState, useCallback } from 'react';
import { ResourceItem, ScreenCaptureWindow } from '../types';
import { screenCaptureUtils } from '../lib/screen-capture';

interface UseScreenCaptureResult {
  isSupported: boolean;
  isLoading: boolean;
  availableWindows: ScreenCaptureWindow[];
  loadAvailableWindows: () => Promise<ScreenCaptureWindow[]>;
  captureWindow: () => Promise<ResourceItem | null>;
  captureSelectedWindow: (windowId: string, options: { 
    addToLibrary: boolean;
    addToCanvas: boolean;
  }) => Promise<ResourceItem | null>;
}

export function useScreenCapture(): UseScreenCaptureResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableWindows, setAvailableWindows] = useState<ScreenCaptureWindow[]>([]);
  
  const isSupported = screenCaptureUtils.isSupported();

  const loadAvailableWindows = useCallback(async () => {
    if (!isSupported) {
      return [];
    }
    
    setIsLoading(true);
    try {
      const windows = await screenCaptureUtils.getAvailableWindows();
      setAvailableWindows(windows);
      return windows;
    } catch (error) {
      console.error('Failed to load available windows:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const captureWindow = useCallback(async () => {
    if (!isSupported) {
      return null;
    }
    
    setIsLoading(true);
    try {
      return await screenCaptureUtils.captureWindow();
    } catch (error) {
      console.error('Failed to capture window:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const captureSelectedWindow = useCallback(async (
    windowId: string, 
    options: { addToLibrary: boolean; addToCanvas: boolean }
  ) => {
    if (!isSupported) {
      return null;
    }
    
    setIsLoading(true);
    try {
      return await screenCaptureUtils.captureSelectedWindow(windowId, options);
    } catch (error) {
      console.error('Failed to capture selected window:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isLoading,
    availableWindows,
    loadAvailableWindows,
    captureWindow,
    captureSelectedWindow
  };
}

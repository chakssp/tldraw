import { nanoid } from 'nanoid';
import { ResourceItem, ScreenCaptureWindow } from '../types';

export const screenCaptureUtils = {
  isSupported: (): boolean => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  },

  getAvailableWindows: async (): Promise<ScreenCaptureWindow[]> => {
    // Note: Getting a list of available windows is not directly possible with the standard API
    // This is a simplified implementation that will be replaced with actual captured previews
    // when the user initiates capture

    // Return dummy data for the UI to work with
    return [
      {
        id: nanoid(),
        title: 'Browser - Current Tab',
        preview: '', // Will be populated during actual capture
        source: 'tab'
      },
      {
        id: nanoid(),
        title: 'Entire Screen',
        preview: '',
        source: 'screen'
      }
    ];
  },

  captureWindow: async (): Promise<ResourceItem | null> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen capture API not available');
      }

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: false,
      });

      // Get video track
      const videoTrack = mediaStream.getVideoTracks()[0];
      
      // Create screenshot from video track
      const imageCapture = new ImageCapture(videoTrack);
      const bitmap = await imageCapture.grabFrame();
      
      // Convert to canvas and then to data URL
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      // Stop all tracks
      mediaStream.getTracks().forEach(track => track.stop());
      
      // Create resource item
      const resourceItem: ResourceItem = {
        id: nanoid(),
        type: 'capture',
        content: dataUrl,
        preview: dataUrl,
        title: 'Screen Capture',
        timestamp: Date.now(),
        isPinned: true,
        metadata: {
          width: bitmap.width,
          height: bitmap.height,
          mimeType: 'image/png',
          source: 'capture'
        }
      };
      
      return resourceItem;
      
    } catch (error) {
      console.error('Failed to capture screen:', error);
      return null;
    }
  },

  captureSelectedWindow: async (windowId: string, options: { 
    addToLibrary: boolean,
    addToCanvas: boolean 
  }): Promise<ResourceItem | null> => {
    // Since we can't programmatically select a specific window with the standard API,
    // we'll capture whatever the user selects and then use the provided options
    try {
      const capturedItem = await screenCaptureUtils.captureWindow();
      
      if (capturedItem) {
        // Apply options
        capturedItem.isPinned = options.addToLibrary;
        return capturedItem;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to capture selected window:', error);
      return null;
    }
  }
};

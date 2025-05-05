import { ResourceItem } from '../types';

const STORAGE_KEYS = {
  RESOURCE_LIBRARY: 'tldraw-resource-library',
  CLIPBOARD_PERMISSION: 'tldraw-clipboard-permission',
  SCREEN_CAPTURE_PERMISSION: 'tldraw-screen-capture-permission',
};

export const storage = {
  saveResourceLibrary: (items: ResourceItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCE_LIBRARY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save resource library to local storage:', error);
    }
  },

  getResourceLibrary: (): ResourceItem[] => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEYS.RESOURCE_LIBRARY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Failed to get resource library from local storage:', error);
      return [];
    }
  },

  saveClipboardPermission: (hasPermission: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIPBOARD_PERMISSION, JSON.stringify(hasPermission));
    } catch (error) {
      console.error('Failed to save clipboard permission to local storage:', error);
    }
  },

  getClipboardPermission: (): boolean => {
    try {
      const permission = localStorage.getItem(STORAGE_KEYS.CLIPBOARD_PERMISSION);
      return permission ? JSON.parse(permission) : false;
    } catch (error) {
      console.error('Failed to get clipboard permission from local storage:', error);
      return false;
    }
  },

  saveScreenCapturePermission: (hasPermission: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCREEN_CAPTURE_PERMISSION, JSON.stringify(hasPermission));
    } catch (error) {
      console.error('Failed to save screen capture permission to local storage:', error);
    }
  },

  getScreenCapturePermission: (): boolean => {
    try {
      const permission = localStorage.getItem(STORAGE_KEYS.SCREEN_CAPTURE_PERMISSION);
      return permission ? JSON.parse(permission) : false;
    } catch (error) {
      console.error('Failed to get screen capture permission from local storage:', error);
      return false;
    }
  },

  clearResourceLibrary: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.RESOURCE_LIBRARY);
    } catch (error) {
      console.error('Failed to clear resource library from local storage:', error);
    }
  }
};

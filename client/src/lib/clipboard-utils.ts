import { nanoid } from 'nanoid';
import { ResourceItem } from '../types';

export const clipboardUtils = {
  requestPermission: async (): Promise<boolean> => {
    try {
      // Check if the Clipboard API is available
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }

      // Request permission for clipboard read
      if (navigator.clipboard.read) {
        // Try to read from clipboard to trigger permission request
        await navigator.clipboard.read();
        return true;
      } else {
        throw new Error('Clipboard read not supported');
      }
    } catch (error) {
      console.warn('Clipboard permission request failed:', error);
      return false;
    }
  },

  readFromClipboard: async (): Promise<ResourceItem | null> => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('Clipboard API not available');
      }

      const clipboardItems = await navigator.clipboard.read();
      
      // Process the first item from clipboard
      if (clipboardItems.length > 0) {
        const clipboardItem = clipboardItems[0];
        const types = clipboardItem.types;

        // Handle image
        if (types.includes('image/png') || types.includes('image/jpeg') || types.includes('image/gif')) {
          const imageType = types.find(type => type.startsWith('image/')) || 'image/png';
          const blob = await clipboardItem.getType(imageType);
          const dataUrl = await blobToDataUrl(blob);

          return {
            id: nanoid(),
            type: 'image',
            content: dataUrl,
            preview: dataUrl,
            title: 'Clipboard Image',
            timestamp: Date.now(),
            isPinned: false,
            metadata: {
              mimeType: imageType,
              width: await getImageDimensions(dataUrl).then(dim => dim.width),
              height: await getImageDimensions(dataUrl).then(dim => dim.height),
              source: 'clipboard'
            }
          };
        }

        // Handle text
        if (types.includes('text/plain')) {
          const blob = await clipboardItem.getType('text/plain');
          const text = await blob.text();

          return {
            id: nanoid(),
            type: 'text',
            content: text,
            title: 'Text Snippet',
            timestamp: Date.now(),
            isPinned: false,
            metadata: {
              source: 'clipboard'
            }
          };
        }

        // Handle HTML
        if (types.includes('text/html')) {
          const blob = await clipboardItem.getType('text/html');
          const html = await blob.text();

          return {
            id: nanoid(),
            type: 'html',
            content: html,
            title: 'HTML Content',
            timestamp: Date.now(),
            isPinned: false,
            metadata: {
              source: 'clipboard'
            }
          };
        }
      }

      // Fallback to legacy clipboard API for text
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        // Check if the text is code (simple heuristic)
        const isCode = text.includes('{') && text.includes('}') && 
                      (text.includes('function') || text.includes('const') || 
                       text.includes('class') || text.includes('import'));

        return {
          id: nanoid(),
          type: isCode ? 'code' : 'text',
          content: text,
          title: isCode ? 'Code Snippet' : 'Text Snippet',
          timestamp: Date.now(),
          isPinned: false,
          metadata: {
            source: 'clipboard'
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  },

  // Fallback for monitoring clipboard with paste event
  setupPasteEventListener: (callback: (item: ResourceItem | null) => void): () => void => {
    const pasteHandler = async (event: ClipboardEvent) => {
      event.preventDefault();
      
      if (event.clipboardData) {
        // Handle images
        if (event.clipboardData.files && event.clipboardData.files.length > 0) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            const dataUrl = await fileToDataUrl(file);
            const item: ResourceItem = {
              id: nanoid(),
              type: 'image',
              content: dataUrl,
              preview: dataUrl,
              title: 'Pasted Image',
              timestamp: Date.now(),
              isPinned: false,
              metadata: {
                mimeType: file.type,
                width: await getImageDimensions(dataUrl).then(dim => dim.width),
                height: await getImageDimensions(dataUrl).then(dim => dim.height),
                source: 'clipboard'
              }
            };
            callback(item);
            return;
          }
        }
        
        // Handle text
        const text = event.clipboardData.getData('text/plain');
        if (text) {
          // Check if the text is code (simple heuristic)
          const isCode = text.includes('{') && text.includes('}') && 
                        (text.includes('function') || text.includes('const') || 
                         text.includes('class') || text.includes('import'));
          
          const item: ResourceItem = {
            id: nanoid(),
            type: isCode ? 'code' : 'text',
            content: text,
            title: isCode ? 'Code Snippet' : 'Text Snippet',
            timestamp: Date.now(),
            isPinned: false,
            metadata: {
              source: 'clipboard'
            }
          };
          callback(item);
          return;
        }
        
        // Handle HTML
        const html = event.clipboardData.getData('text/html');
        if (html) {
          const item: ResourceItem = {
            id: nanoid(),
            type: 'html',
            content: html,
            title: 'HTML Content',
            timestamp: Date.now(),
            isPinned: false,
            metadata: {
              source: 'clipboard'
            }
          };
          callback(item);
          return;
        }
      }
      
      callback(null);
    };
    
    document.addEventListener('paste', pasteHandler);
    return () => document.removeEventListener('paste', pasteHandler);
  }
};

// Helper functions
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}

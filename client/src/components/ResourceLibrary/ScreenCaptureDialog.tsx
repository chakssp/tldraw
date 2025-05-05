import React, { useState, useEffect } from 'react';
import { ScreenCaptureWindow } from '../../types';
import { useScreenCapture } from '../../hooks/use-screen-capture';
import { useResourceLibrary } from '../../hooks/use-resource-library';

interface ScreenCaptureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (windowId: string, options: { addToLibrary: boolean; addToCanvas: boolean }) => Promise<void>;
}

export const ScreenCaptureDialog: React.FC<ScreenCaptureDialogProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const [addToLibrary, setAddToLibrary] = useState(true);
  const [addToCanvas, setAddToCanvas] = useState(true);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const { isSupported, availableWindows, loadAvailableWindows, isLoading } = useScreenCapture();

  useEffect(() => {
    if (isOpen && isSupported) {
      loadAvailableWindows();
    }
  }, [isOpen, isSupported, loadAvailableWindows]);

  const handleCapture = async () => {
    if (selectedWindowId) {
      await onCapture(selectedWindowId, { addToLibrary, addToCanvas });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-full max-h-[90vh] flex flex-col">
        {/* Dialog Header */}
        <div className="border-b border-tldraw-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Capture Screen</h2>
          <button 
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-tldraw-hover"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Dialog Content */}
        <div className="p-6 overflow-y-auto">
          {!isSupported ? (
            <div className="p-4 bg-yellow-50 rounded-md mb-4">
              <p className="text-yellow-800">
                Screen capture is not supported in your browser. Please use Chrome, Edge, or Firefox.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">Select a window to capture and add to your resource library:</p>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-tldraw-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-2">
                  {availableWindows.map((window) => (
                    <div 
                      key={window.id}
                      className={`border rounded overflow-hidden cursor-pointer transition-all ${
                        selectedWindowId === window.id ? 'border-tldraw-primary' : 'border-tldraw-border hover:border-tldraw-primary'
                      }`}
                      onClick={() => setSelectedWindowId(window.id)}
                    >
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {window.preview ? (
                          <img src={window.preview} alt={window.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center p-4 h-full">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                              <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M12 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-sm truncate">{window.title}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Options */}
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <input 
                    type="checkbox" 
                    id="captureAddToLibrary" 
                    className="mr-2" 
                    checked={addToLibrary}
                    onChange={(e) => setAddToLibrary(e.target.checked)}
                  />
                  <label htmlFor="captureAddToLibrary" className="text-sm">Add to resource library</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="captureAddToCanvas" 
                    className="mr-2" 
                    checked={addToCanvas}
                    onChange={(e) => setAddToCanvas(e.target.checked)}
                  />
                  <label htmlFor="captureAddToCanvas" className="text-sm">Insert to canvas immediately</label>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Dialog Footer */}
        <div className="border-t border-tldraw-border p-4 flex justify-end space-x-2">
          <button 
            className="px-4 py-2 rounded text-sm hover:bg-tldraw-hover"
            onClick={onClose}
          >
            Cancel
          </button>
          
          <button 
            className="px-4 py-2 bg-tldraw-primary text-white rounded text-sm hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCapture}
            disabled={!selectedWindowId || !isSupported || isLoading}
          >
            Capture Selected Window
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ResourceItem, ResourceLibraryVisibility, CustomElementConfig } from '../types';
import { Header } from '../components/Header/Header';
import { ToolbarPanel } from '../components/Toolbar/ToolbarPanel';
import { ResourceLibraryPanel } from '../components/ResourceLibrary/ResourceLibraryPanel';
import { TldrawCanvas } from '../components/Canvas/TldrawCanvas';
import { StatusBar } from '../components/StatusBar/StatusBar';
import { ScreenCaptureDialog } from '../components/ResourceLibrary/ScreenCaptureDialog';
import { CustomInputDialog } from '../components/ResourceLibrary/CustomInputDialog';
import { ResourceLibraryProvider, useResourceLibrary } from '../context/ResourceLibraryContext';
import { useStylus } from '../hooks/use-stylus';

const HomeContent: React.FC = () => {
  const [title, setTitle] = useState('Untitled');
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [isScreenCaptureOpen, setIsScreenCaptureOpen] = useState(false);
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  
  const { captureScreen, createCustomElement } = useResourceLibrary();
  const stylus = useStylus();

  // Handle tool change
  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
  };

  // Handle resource drag
  const handleDragResource = (item: ResourceItem) => {
    // This would track the dragged resource
    console.log('Dragging resource:', item);
  };

  // Handle resource drop on canvas
  const handleDropResource = (item: ResourceItem, x: number, y: number) => {
    console.log('Resource dropped at:', x, y, item);
    // Here you would integrate with tldraw to add the resource to the canvas
    // This mock just simulates a successful drop
    
    // Simulate save
    setLastSaved(new Date());
  };

  // Handle resource use (direct placement on canvas)
  const handleUseResource = (item: ResourceItem) => {
    console.log('Using resource:', item);
    // Here you would integrate with tldraw to add the resource to the canvas
    
    // Simulate save
    setLastSaved(new Date());
  };

  // Handle share
  const handleShare = () => {
    alert('Sharing functionality would be implemented here.');
  };

  // Handle screen capture
  const handleScreenCapture = async (windowId: string, options: { addToLibrary: boolean; addToCanvas: boolean }) => {
    const capturedItem = await captureScreen();
    if (capturedItem && options.addToCanvas) {
      // Add to canvas would be implemented with tldraw integration
      console.log('Adding screen capture to canvas:', capturedItem);
    }
  };

  // Handle custom element creation
  const handleCreateCustomElement = (config: CustomElementConfig) => {
    const element = createCustomElement(config);
    // Add to canvas would be implemented with tldraw integration
    console.log('Adding custom element to canvas:', element);
    
    // Simulate save
    setLastSaved(new Date());
  };

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts while editing text
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'e':
          setActiveTool('ellipse');
          break;
        case 'a':
          setActiveTool('arrow');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'l':
          useResourceLibrary().setVisibility(
            useResourceLibrary().visibility === ResourceLibraryVisibility.Visible
              ? ResourceLibraryVisibility.Hidden
              : ResourceLibraryVisibility.Visible
          );
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            // Don't interfere with copy
            return;
          }
          setIsScreenCaptureOpen(true);
          break;
        case 'i':
          setIsCustomInputOpen(true);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <Header 
        title={title}
        onTitleChange={setTitle}
        onShareClick={handleShare}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <ToolbarPanel 
          activeTool={activeTool}
          onChangeTool={handleToolChange}
          onOpenScreenCapture={() => setIsScreenCaptureOpen(true)}
          onOpenCustomInput={() => setIsCustomInputOpen(true)}
        />
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <TldrawCanvas onDropResource={handleDropResource} />
        </div>
        
        {/* Right Sidebar - Resource Library */}
        <ResourceLibraryPanel
          onDragResource={handleDragResource}
          onUseResource={handleUseResource}
        />
      </div>
      
      {/* Bottom Status Bar */}
      <StatusBar 
        zoom={zoom}
        isGridVisible={isGridVisible}
        lastSaved={lastSaved}
        onZoomChange={setZoom}
        onToggleGrid={() => setIsGridVisible(!isGridVisible)}
      />
      
      {/* Dialogs */}
      <ScreenCaptureDialog 
        isOpen={isScreenCaptureOpen}
        onClose={() => setIsScreenCaptureOpen(false)}
        onCapture={handleScreenCapture}
      />
      
      <CustomInputDialog 
        isOpen={isCustomInputOpen}
        onClose={() => setIsCustomInputOpen(false)}
        onCreateElement={handleCreateCustomElement}
      />
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <ResourceLibraryProvider>
      <HomeContent />
    </ResourceLibraryProvider>
  );
};

export default Home;

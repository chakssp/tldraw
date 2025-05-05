import React, { useState } from 'react';
import { StyleOptions, CustomElementConfig } from '../../types';

interface CustomInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateElement: (config: CustomElementConfig) => void;
}

export const CustomInputDialog: React.FC<CustomInputDialogProps> = ({
  isOpen,
  onClose,
  onCreateElement
}) => {
  const [elementType, setElementType] = useState<'button' | 'input' | 'checkbox' | 'radio' | 'dropdown' | 'toggle'>('button');
  const [labelText, setLabelText] = useState('Button Label');
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    style: 'primary',
    size: 'medium'
  });

  const handleCreateElement = () => {
    onCreateElement({
      type: elementType,
      label: labelText,
      styleOptions
    });
    onClose();
  };

  const renderPreview = () => {
    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-4 py-2 text-sm',
      large: 'px-6 py-3'
    };
    
    const styleClasses = {
      primary: 'bg-tldraw-primary text-white',
      secondary: 'bg-gray-200 text-gray-800',
      danger: 'bg-tldraw-danger text-white',
      success: 'bg-tldraw-success text-white'
    };
    
    switch (elementType) {
      case 'button':
        return (
          <button 
            className={`rounded ${sizeClasses[styleOptions.size || 'medium']} ${styleClasses[styleOptions.style || 'primary']}`}
          >
            {labelText || 'Button'}
          </button>
        );
      
      case 'input':
        return (
          <div className="flex flex-col">
            <label className="text-sm mb-1">{labelText || 'Input'}</label>
            <input 
              type="text" 
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Input field"
            />
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-sm">{labelText || 'Checkbox'}</label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="flex items-center">
            <input type="radio" className="mr-2" />
            <label className="text-sm">{labelText || 'Radio option'}</label>
          </div>
        );
      
      case 'dropdown':
        return (
          <div className="flex flex-col">
            <label className="text-sm mb-1">{labelText || 'Dropdown'}</label>
            <select className="border border-gray-300 rounded px-3 py-2">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
        );
      
      case 'toggle':
        return (
          <div className="flex items-center">
            <div className={`w-10 h-6 flex items-center rounded-full p-1 ${styleOptions.style === 'primary' ? 'bg-tldraw-primary' : 'bg-gray-300'}`}>
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-4"></div>
            </div>
            <label className="text-sm ml-2">{labelText || 'Toggle'}</label>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-full flex flex-col">
        {/* Dialog Header */}
        <div className="border-b border-tldraw-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Custom Element</h2>
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
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Element Type</label>
            <select 
              className="w-full border border-tldraw-border rounded px-3 py-2 focus:outline-none focus:border-tldraw-primary"
              value={elementType}
              onChange={(e) => setElementType(e.target.value as any)}
            >
              <option value="button">Button</option>
              <option value="input">Input Field</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio Button</option>
              <option value="dropdown">Dropdown</option>
              <option value="toggle">Toggle</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Label Text</label>
            <input 
              type="text" 
              placeholder="Enter label text" 
              className="w-full border border-tldraw-border rounded px-3 py-2 focus:outline-none focus:border-tldraw-primary"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Style</label>
            <div className="grid grid-cols-4 gap-2">
              <button 
                className={`border rounded p-2 hover:bg-tldraw-hover flex flex-col items-center ${styleOptions.style === 'primary' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, style: 'primary' }))}
              >
                <div className="w-full h-6 bg-tldraw-primary rounded mb-1"></div>
                <span className="text-xs">Primary</span>
              </button>
              
              <button 
                className={`border rounded p-2 hover:bg-tldraw-hover flex flex-col items-center ${styleOptions.style === 'secondary' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, style: 'secondary' }))}
              >
                <div className="w-full h-6 bg-gray-200 rounded mb-1"></div>
                <span className="text-xs">Secondary</span>
              </button>
              
              <button 
                className={`border rounded p-2 hover:bg-tldraw-hover flex flex-col items-center ${styleOptions.style === 'danger' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, style: 'danger' }))}
              >
                <div className="w-full h-6 bg-tldraw-danger rounded mb-1"></div>
                <span className="text-xs">Danger</span>
              </button>
              
              <button 
                className={`border rounded p-2 hover:bg-tldraw-hover flex flex-col items-center ${styleOptions.style === 'success' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, style: 'success' }))}
              >
                <div className="w-full h-6 bg-tldraw-success rounded mb-1"></div>
                <span className="text-xs">Success</span>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Size</label>
            <div className="flex space-x-2">
              <button 
                className={`flex-1 border rounded py-2 hover:bg-tldraw-hover ${styleOptions.size === 'small' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, size: 'small' }))}
              >
                Small
              </button>
              
              <button 
                className={`flex-1 border rounded py-2 hover:bg-tldraw-hover ${styleOptions.size === 'medium' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, size: 'medium' }))}
              >
                Medium
              </button>
              
              <button 
                className={`flex-1 border rounded py-2 hover:bg-tldraw-hover ${styleOptions.size === 'large' ? 'border-tldraw-primary bg-tldraw-hover' : 'border-tldraw-border'}`}
                onClick={() => setStyleOptions(prev => ({ ...prev, size: 'large' }))}
              >
                Large
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div className="border border-tldraw-border rounded-lg p-6 flex items-center justify-center bg-gray-50">
              {renderPreview()}
            </div>
          </div>
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
            className="px-4 py-2 bg-tldraw-primary text-white rounded text-sm hover:bg-opacity-90"
            onClick={handleCreateElement}
          >
            Add to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

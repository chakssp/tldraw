import React from 'react';
import { ClipboardMonitorStatus } from '../../types';

interface ResourceLibraryStatusProps {
  status: ClipboardMonitorStatus;
  onRequestPermission: () => Promise<void>;
}

export const ResourceLibraryStatus: React.FC<ResourceLibraryStatusProps> = ({
  status,
  onRequestPermission
}) => {
  if (status.hasPermission && status.isMonitoring) {
    return (
      <div className="p-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-tldraw-primary mr-2">
            <path d="M12 4V6M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14M12 6V2M12 14C10.8954 14 10 14.8954 10 16C10 17.1046 10.8954 18 12 18M12 14V18M12 18V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-tldraw-primary">Monitoring clipboard...</span>
        </div>
      </div>
    );
  }
  
  if (!status.hasPermission) {
    return (
      <div className="p-3 bg-yellow-50 border-b border-yellow-100">
        <div className="flex flex-col text-sm">
          <div className="flex items-center mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-600 mr-2">
              <path d="M12 9V13M12 17H12.01M6.99997 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H6.99997C4.79083 21 2.99997 19.2091 2.99997 17V7C2.99997 4.79086 4.79083 3 6.99997 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-yellow-800">Clipboard access needed</span>
          </div>
          <p className="text-yellow-700 mb-2 text-xs">Grant permission to monitor clipboard changes and enable the resource library.</p>
          <button 
            onClick={onRequestPermission}
            className="px-3 py-1 bg-yellow-600 text-white rounded-md text-xs hover:bg-yellow-700 self-start"
          >
            Allow Clipboard Access
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

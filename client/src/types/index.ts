export interface ResourceItem {
  id: string;
  type: 'image' | 'text' | 'html' | 'code' | 'capture' | 'custom';
  content: string;
  preview?: string;
  title: string;
  timestamp: number;
  isPinned: boolean;
  metadata?: {
    width?: number;
    height?: number;
    mimeType?: string;
    source?: 'clipboard' | 'capture' | 'custom';
    [key: string]: any;
  };
}

export type ResourceTab = 'clipboard' | 'pinned' | 'captures';

export interface ScreenCaptureWindow {
  id: string;
  title: string;
  preview: string;
  source: 'window' | 'tab' | 'screen';
}

export interface ClipboardMonitorStatus {
  isMonitoring: boolean;
  hasPermission: boolean;
  lastDetectedType?: string;
}

export enum ResourceLibraryVisibility {
  Visible = 'visible',
  Hidden = 'hidden',
  Minimized = 'minimized'
}

export interface StyleOptions {
  style?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
}

export interface CustomElementConfig {
  type: 'button' | 'input' | 'checkbox' | 'radio' | 'dropdown' | 'toggle';
  label: string;
  styleOptions: StyleOptions;
}

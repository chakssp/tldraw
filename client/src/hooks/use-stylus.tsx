import { useState, useEffect, useCallback } from 'react';

interface StylusState {
  isAvailable: boolean;
  isActive: boolean;
  pressure: number;
  tiltX: number;
  tiltY: number;
}

interface UseStylusResult extends StylusState {
  isTouchEvent: (event: React.PointerEvent) => boolean;
  isStylusEvent: (event: React.PointerEvent) => boolean;
  getStylusEvent: (event: React.PointerEvent) => StylusState;
}

export function useStylus(): UseStylusResult {
  const [stylusState, setStylusState] = useState<StylusState>({
    isAvailable: false,
    isActive: false,
    pressure: 0,
    tiltX: 0,
    tiltY: 0
  });

  // Check for stylus support on mount
  useEffect(() => {
    const checkStylusSupport = () => {
      // Check if pointer events are supported
      if (window.PointerEvent) {
        setStylusState(prev => ({ ...prev, isAvailable: true }));
      }
    };
    
    checkStylusSupport();
    
    // Add global pointer listeners to detect stylus
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'pen') {
        setStylusState({
          isAvailable: true,
          isActive: true,
          pressure: event.pressure,
          tiltX: event.tiltX,
          tiltY: event.tiltY
        });
      }
    };
    
    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType === 'pen') {
        setStylusState(prev => ({ ...prev, isActive: false }));
      }
    };
    
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'pen' && stylusState.isActive) {
        setStylusState(prev => ({
          ...prev,
          pressure: event.pressure,
          tiltX: event.tiltX,
          tiltY: event.tiltY
        }));
      }
    };
    
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);
    
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);
    };
  }, [stylusState.isActive]);

  // Helper to check if an event is from a touch device
  const isTouchEvent = useCallback((event: React.PointerEvent): boolean => {
    return event.pointerType === 'touch';
  }, []);

  // Helper to check if an event is from a stylus
  const isStylusEvent = useCallback((event: React.PointerEvent): boolean => {
    return event.pointerType === 'pen';
  }, []);

  // Get stylus data from an event
  const getStylusEvent = useCallback((event: React.PointerEvent): StylusState => {
    if (event.pointerType === 'pen') {
      return {
        isAvailable: true,
        isActive: true,
        pressure: event.pressure,
        tiltX: event.tiltX,
        tiltY: event.tiltY
      };
    }
    
    return {
      isAvailable: stylusState.isAvailable,
      isActive: false,
      pressure: 0,
      tiltX: 0,
      tiltY: 0
    };
  }, [stylusState.isAvailable]);

  return {
    ...stylusState,
    isTouchEvent,
    isStylusEvent,
    getStylusEvent
  };
}

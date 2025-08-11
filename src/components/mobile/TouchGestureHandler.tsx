import React, { useRef, useEffect, useState, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureState {
  isActive: boolean;
  startPoint: TouchPoint | null;
  currentPoint: TouchPoint | null;
  velocity: { x: number; y: number };
  distance: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  scale: number;
  rotation: number;
}

interface TouchGestureHandlerProps {
  children: React.ReactNode;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onRotate?: (angle: number, center: { x: number; y: number }) => void;
  onTap?: (point: { x: number; y: number }) => void;
  onDoubleTap?: (point: { x: number; y: number }) => void;
  onLongPress?: (point: { x: number; y: number }) => void;
  onPan?: (delta: { x: number; y: number }, velocity: { x: number; y: number }) => void;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  className?: string;
  disabled?: boolean;
}

const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({
  children,
  onSwipe,
  onPinch,
  onRotate,
  onTap,
  onDoubleTap,
  onLongPress,
  onPan,
  swipeThreshold = 50,
  pinchThreshold = 0.1,
  longPressDelay = 500,
  doubleTapDelay = 300,
  className = '',
  disabled = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    startPoint: null,
    currentPoint: null,
    velocity: { x: 0, y: 0 },
    distance: 0,
    direction: null,
    scale: 1,
    rotation: 0
  });
  
  const [touches, setTouches] = useState<TouchList | null>(null);
  const [lastTap, setLastTap] = useState<TouchPoint | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const animationFrame = useRef<number | null>(null);

  // Calculate distance between two points
  const getDistance = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate angle between two points
  const getAngle = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
  }, []);

  // Get touch center point for multi-touch gestures
  const getTouchCenter = useCallback((touchList: TouchList): { x: number; y: number } => {
    let x = 0, y = 0;
    for (let i = 0; i < touchList.length; i++) {
      x += touchList[i].clientX;
      y += touchList[i].clientY;
    }
    return { x: x / touchList.length, y: y / touchList.length };
  }, []);

  // Calculate velocity
  const calculateVelocity = useCallback((start: TouchPoint, end: TouchPoint): { x: number; y: number } => {
    const timeDiff = end.timestamp - start.timestamp;
    if (timeDiff === 0) return { x: 0, y: 0 };
    
    return {
      x: (end.x - start.x) / timeDiff,
      y: (end.y - start.y) / timeDiff
    };
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    setTouches(event.touches);
    setGestureState(prev => ({
      ...prev,
      isActive: true,
      startPoint: touchPoint,
      currentPoint: touchPoint
    }));

    // Start long press timer
    if (onLongPress && event.touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        onLongPress({ x: touchPoint.x, y: touchPoint.y });
      }, longPressDelay);
    }
  }, [disabled, onLongPress, longPressDelay]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (disabled || !gestureState.isActive) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const currentPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    // Clear long press timer on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    setTouches(event.touches);
    
    if (gestureState.startPoint) {
      const distance = getDistance(gestureState.startPoint, currentPoint);
      const velocity = calculateVelocity(gestureState.startPoint, currentPoint);
      
      // Handle pan gesture
      if (onPan && event.touches.length === 1) {
        const delta = {
          x: currentPoint.x - gestureState.startPoint.x,
          y: currentPoint.y - gestureState.startPoint.y
        };
        onPan(delta, velocity);
      }

      // Handle pinch gesture
      if (onPinch && event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        if (gestureState.distance > 0) {
          const scale = currentDistance / gestureState.distance;
          if (Math.abs(scale - 1) > pinchThreshold) {
            const center = getTouchCenter(event.touches);
            onPinch(scale, center);
          }
        }
        
        setGestureState(prev => ({ ...prev, distance: currentDistance }));
      }

      // Handle rotation gesture
      if (onRotate && event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        ) * 180 / Math.PI;
        
        if (gestureState.rotation !== 0) {
          const deltaAngle = angle - gestureState.rotation;
          const center = getTouchCenter(event.touches);
          onRotate(deltaAngle, center);
        }
        
        setGestureState(prev => ({ ...prev, rotation: angle }));
      }

      setGestureState(prev => ({
        ...prev,
        currentPoint,
        velocity,
        distance
      }));
    }
  }, [disabled, gestureState, getDistance, calculateVelocity, onPan, onPinch, onRotate, pinchThreshold, getTouchCenter]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (gestureState.startPoint && gestureState.currentPoint) {
      const distance = getDistance(gestureState.startPoint, gestureState.currentPoint);
      const velocity = calculateVelocity(gestureState.startPoint, gestureState.currentPoint);
      
      // Handle swipe gesture
      if (onSwipe && distance > swipeThreshold && event.changedTouches.length === 1) {
        const dx = gestureState.currentPoint.x - gestureState.startPoint.x;
        const dy = gestureState.currentPoint.y - gestureState.startPoint.y;
        
        let direction: 'left' | 'right' | 'up' | 'down';
        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 'right' : 'left';
        } else {
          direction = dy > 0 ? 'down' : 'up';
        }
        
        const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        onSwipe(direction, velocityMagnitude);
      }
      
      // Handle tap and double tap
      else if (distance < 10 && event.changedTouches.length === 1) {
        const tapPoint = { x: gestureState.currentPoint.x, y: gestureState.currentPoint.y };
        
        if (onDoubleTap && lastTap && 
            Date.now() - lastTap.timestamp < doubleTapDelay &&
            getDistance(lastTap, gestureState.currentPoint) < 30) {
          onDoubleTap(tapPoint);
          setLastTap(null);
        } else {
          if (onTap) {
            onTap(tapPoint);
          }
          setLastTap(gestureState.currentPoint);
        }
      }
    }

    setGestureState({
      isActive: false,
      startPoint: null,
      currentPoint: null,
      velocity: { x: 0, y: 0 },
      distance: 0,
      direction: null,
      scale: 1,
      rotation: 0
    });
    setTouches(null);
  }, [disabled, gestureState, getDistance, calculateVelocity, onSwipe, swipeThreshold, onTap, onDoubleTap, lastTap, doubleTapDelay]);

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={elementRef}
      className={`touch-gesture-handler ${className}`}
      style={{
        touchAction: disabled ? 'auto' : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default TouchGestureHandler;
export type { TouchGestureHandlerProps, GestureState, TouchPoint };
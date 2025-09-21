import React, { useEffect, useRef, useState, useCallback } from 'react';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  opacity: number;
  size: number;
}

const CursorTrail: React.FC = () => {
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const trailRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const pointIdRef = useRef(0);
  const lastMouseTime = useRef(0);

  const updateTrail = useCallback(() => {
    setTrailPoints(prev => {
      const now = Date.now();
      return prev
        .map(point => {
          const age = now - point.timestamp;
          const fadeTime = 600; // Fade over 600ms for snappier trail
          const opacity = Math.max(0, 1 - age / fadeTime);
          const size = Math.max(0.3, 1 - age / fadeTime * 0.7);
          
          return {
            ...point,
            opacity,
            size
          };
        })
        .filter(point => point.opacity > 0.01);
    });
    
    animationFrameRef.current = requestAnimationFrame(updateTrail);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Throttle trail points to avoid too many
      if (now - lastMouseTime.current < 16) { // ~60fps
        setMousePosition({ x: e.clientX, y: e.clientY });
        return;
      }
      
      lastMouseTime.current = now;

      const newPoint: TrailPoint = {
        id: pointIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
        opacity: 1,
        size: 1
      };

      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      setTrailPoints(prev => {
        const newTrail = [newPoint, ...prev].slice(0, 20); // Keep last 20 points for cleaner trail
        return newTrail;
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateTrail);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateTrail]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail Points */}
      <div
        ref={trailRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ overflow: 'hidden' }}
      >
        {trailPoints.map((point, index) => {
          const isRecent = index < 3;
          const gradient = isRecent 
            ? 'from-red-500 via-pink-500 to-blue-500' 
            : 'from-red-400 to-blue-400';
          
          return (
            <div
              key={point.id}
              className={`absolute rounded-full bg-gradient-to-r ${gradient} transform -translate-x-1/2 -translate-y-1/2`}
              style={{
                left: point.x,
                top: point.y,
                width: `${point.size * (isRecent ? 6 : 3)}px`,
                height: `${point.size * (isRecent ? 6 : 3)}px`,
                opacity: point.opacity,
                transform: `translate(-50%, -50%) scale(${point.size})`,
                boxShadow: isRecent 
                  ? `0 0 ${point.opacity * 12}px rgba(239, 68, 68, ${point.opacity * 0.6}), 0 0 ${point.opacity * 20}px rgba(59, 130, 246, ${point.opacity * 0.3})`
                  : `0 0 ${point.opacity * 6}px rgba(239, 68, 68, ${point.opacity * 0.2})`,
                filter: `blur(${(1 - point.opacity) * 1.5}px)`
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default CursorTrail;

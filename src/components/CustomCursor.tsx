import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  isQuietMode?: boolean;
}

export default function CustomCursor({ isQuietMode = false }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Check if device supports fine pointer (desktop mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handlePointerChange);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    if (mediaQuery.matches && !isQuietMode) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isQuietMode]);

  if (!isFinePointer || isQuietMode) return null;

  return (
    <>
      {/* Primary Small Dot */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-purple-400 rounded-full pointer-events-none z-[9998] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${
            isHovered ? 1.5 : 1
          })`,
        }}
      />

      {/* Trailing Outer Glow Ring */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9997] transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2 border border-purple-400/50 bg-purple-500/10 ${
          isHovered
            ? 'scale-150 border-purple-300 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
            : 'scale-100'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}

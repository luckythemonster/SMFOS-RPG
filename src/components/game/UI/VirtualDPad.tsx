/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface VirtualDPadProps {
  onDirectionChange: (key: string, isPressed: boolean) => void;
}

/**
 * VirtualDPad Component
 * Provides touch-friendly directional controls for mobile users.
 * Uses a pointer tracking system to ensure keys are released even during complex multi-touch.
 */
export default function VirtualDPad({ onDirectionChange }: VirtualDPadProps) {
  // Track which pointerId is associated with which key
  const activePointers = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    const handleGlobalPointerUp = (e: PointerEvent) => {
      const key = activePointers.current.get(e.pointerId);
      if (key) {
        onDirectionChange(key, false);
        activePointers.current.delete(e.pointerId);
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [onDirectionChange]);

  const handlePointerDown = (key: string) => (e: React.PointerEvent) => {
    // Prevent default to stop scrolling/zooming
    if (e.cancelable) e.preventDefault();
    
    // If this pointer was already doing something, clear it
    const oldKey = activePointers.current.get(e.pointerId);
    if (oldKey && oldKey !== key) {
      onDirectionChange(oldKey, false);
    }

    activePointers.current.set(e.pointerId, key);
    onDirectionChange(key, true);
  };

  const Button = ({ direction, icon: Icon, className }: { direction: string, icon: any, className: string }) => (
    <button
      className={`w-16 h-16 bg-gray-800/80 border-2 border-gray-600 active:bg-green-500/50 active:border-green-400 flex items-center justify-center rounded-lg touch-none select-none ${className}`}
      onPointerDown={handlePointerDown(direction)}
      // onPointerUp is handled by the global listener for better reliability
      onContextMenu={(e) => e.preventDefault()}
    >
      <Icon className="text-gray-300 w-8 h-8 pointer-events-none" />
    </button>
  );

  return (
    <div className="flex items-end gap-4 sm:gap-8 select-none p-4 touch-none">
      <div className="grid grid-cols-3 grid-rows-3 gap-2 p-4 bg-black/40 rounded-full backdrop-blur-sm border border-white/10">
        <Button direction="ArrowUp" icon={ChevronUp} className="col-start-2 row-start-1" />
        <Button direction="ArrowLeft" icon={ChevronLeft} className="col-start-1 row-start-2" />
        <Button direction="ArrowRight" icon={ChevronRight} className="col-start-3 row-start-2" />
        <Button direction="ArrowDown" icon={ChevronDown} className="col-start-2 row-start-3" />
        
        {/* Center decoration */}
        <div className="col-start-2 row-start-2 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 bg-green-500/20 rounded-full border border-green-500/40 animate-pulse" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button
          className="w-12 h-8 bg-gray-700 border-2 border-gray-500 active:bg-gray-500 flex items-center justify-center rounded-md shadow-lg touch-none select-none"
          onPointerDown={handlePointerDown('m')}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="text-white font-bold text-[10px] uppercase pointer-events-none">Start</span>
        </button>

        <button
          className="w-20 h-20 bg-red-900/80 border-4 border-red-700 active:bg-red-500 active:border-red-400 flex items-center justify-center rounded-full shadow-lg touch-none select-none"
          onPointerDown={handlePointerDown('e')}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="text-white font-bold text-2xl italic pointer-events-none">A</span>
        </button>
      </div>
    </div>
  );
}

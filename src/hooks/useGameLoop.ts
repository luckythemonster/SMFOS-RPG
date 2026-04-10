/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

/**
 * A custom hook that manages the core game loop using requestAnimationFrame.
 * It separates the update logic (physics, input) from the render logic (canvas drawing).
 * 
 * @param onUpdate - Function called every frame to update game state. Receives deltaTime in seconds.
 * @param onRender - Function called every frame to draw to the canvas.
 */
export function useGameLoop(
  onUpdate: (deltaTime: number) => void,
  onRender: () => void
) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const onUpdateRef = useRef(onUpdate);
  const onRenderRef = useRef(onRender);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onRenderRef.current = onRender;
  }, [onUpdate, onRender]);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      const cappedDeltaTime = Math.min(deltaTime, 0.1);

      onUpdateRef.current(cappedDeltaTime);
      onRenderRef.current();
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // The loop itself stays stable, but uses refs for callbacks
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Entity, Direction, Position, Interactable } from '../types/game';
import { MapData, TILE_TYPES } from '../data/maps/fathersShip';
import { GameEntity } from '../data/entities/fathersShipEntities';

/**
 * Custom hook for a grid-based kinematic movement controller.
 * Handles keyboard input and smooth interpolation between grid cells.
 */
export function usePlayerController(
  gridSize: number, 
  canMove: boolean = true, 
  map: MapData,
  entities: GameEntity[]
) {
  // Initial state for Lucky
  const [player, setPlayer] = useState<Entity>({
    id: 'lucky',
    position: { x: 2 * gridSize, y: 2 * gridSize }, // Start at (2,2) in pixels
    targetPosition: { x: 2 * gridSize, y: 2 * gridSize },
    direction: 'down',
    isMoving: false,
    speed: 4, // Tiles per second
  });

  // Keep track of keys pressed (both physical and virtual)
  const keysPressed = useRef<Set<string>>(new Set());

  /**
   * Allows external components (like a Virtual D-Pad) to simulate key presses.
   */
  const setVirtualKey = useCallback((key: string, isPressed: boolean) => {
    if (isPressed) {
      keysPressed.current.add(key);
    } else {
      keysPressed.current.delete(key);
    }
  }, []);

  /**
   * Clears all pressed keys. Useful when focus is lost or state changes.
   */
  const clearKeys = useCallback(() => {
    keysPressed.current.clear();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);
    const handleBlur = () => keysPressed.current.clear();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        keysPressed.current.clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * Updates the player's position based on input and current movement state.
   * This is called inside the game loop.
   */
  const updatePlayer = useCallback((deltaTime: number) => {
    setPlayer((prev) => {
      let { position, targetPosition, isMoving, direction, speed } = prev;

      // If we are currently moving, interpolate towards the target
      if (isMoving) {
        const dx = targetPosition.x - position.x;
        const dy = targetPosition.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const moveStep = speed * gridSize * deltaTime;

        if (distance <= moveStep) {
          // We reached the target
          position = { ...targetPosition };
          isMoving = false;
        } else {
          // Move towards target
          position = {
            x: position.x + (dx / distance) * moveStep,
            y: position.y + (dy / distance) * moveStep,
          };
        }
      }

      // If we are NOT moving, check for new input
      if (!isMoving && canMove) {
        let nextTarget = { ...position };
        let nextDirection = direction;
        let shouldMove = false;

        if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) {
          nextTarget.y -= gridSize;
          nextDirection = 'up';
          shouldMove = true;
        } else if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s')) {
          nextTarget.y += gridSize;
          nextDirection = 'down';
          shouldMove = true;
        } else if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
          nextTarget.x -= gridSize;
          nextDirection = 'left';
          shouldMove = true;
        } else if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
          nextTarget.x += gridSize;
          nextDirection = 'right';
          shouldMove = true;
        }

        if (shouldMove) {
          // Collision Detection
          const gridX = nextTarget.x / gridSize;
          const gridY = nextTarget.y / gridSize;

          // Check bounds and tile type
          const isWithinBounds = 
            gridY >= 0 && gridY < map.tiles.length && 
            gridX >= 0 && gridX < map.tiles[0].length;
          
          const isWalkable = isWithinBounds && map.tiles[gridY][gridX] !== TILE_TYPES.WALL;

          // Entity Collision Detection
          const entityAtTarget = entities.find(
            e => e.isSolid && e.position.x === gridX && e.position.y === gridY
          );

          if (isWalkable && !entityAtTarget) {
            return {
              ...prev,
              targetPosition: nextTarget,
              direction: nextDirection,
              isMoving: true,
            };
          } else {
            // Even if blocked, update direction to face the wall
            return {
              ...prev,
              direction: nextDirection,
            };
          }
        }
      }

      return { ...prev, position, isMoving, direction };
    });
  }, [gridSize, canMove, map, entities]);

  /**
   * Checks if the player is facing an interactable object.
   */
  const getInteractionTarget = useCallback(() => {
    const { position, direction } = player;
    
    // Calculate the grid coordinate directly in front of the player
    const targetGrid = { 
      x: Math.round(position.x / gridSize), 
      y: Math.round(position.y / gridSize) 
    };
    
    if (direction === 'up') targetGrid.y -= 1;
    if (direction === 'down') targetGrid.y += 1;
    if (direction === 'left') targetGrid.x -= 1;
    if (direction === 'right') targetGrid.x += 1;

    // Find an entity at that coordinate
    return entities.find(
      (item) => item.position.x === targetGrid.x && item.position.y === targetGrid.y
    );
  }, [player, gridSize, entities]);

  /**
   * Directly sets the player's position (e.g. for map transitions).
   */
  const setPlayerPosition = useCallback((gridX: number, gridY: number) => {
    const newPos = { x: gridX * gridSize, y: gridY * gridSize };
    setPlayer(prev => ({
      ...prev,
      position: newPos,
      targetPosition: newPos,
      isMoving: false
    }));
  }, [gridSize]);

  return { player, updatePlayer, setVirtualKey, clearKeys, setPlayerPosition, getInteractionTarget, keysPressed };
}

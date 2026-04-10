/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Position;
  targetPosition: Position;
  direction: Direction;
  isMoving: boolean;
  speed: number; // Tiles per second or pixels per frame
}

export interface Interactable {
  id: string;
  position: Position;
  message: string[];
}

export interface GameState {
  player: Entity;
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  isDialogueActive: boolean;
  currentDialogue: string[];
  interactables: Interactable[];
}

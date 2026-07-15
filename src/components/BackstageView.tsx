import React, { useState, useEffect } from 'react';
import { useWastelandState } from '../state/useWastelandState';
import { States } from '../state/WastelandState';

type TileType = 'EMPTY' | 'CRATE' | 'STAGEHAND' | 'DRESSING_ROOM';

interface MapTile {
  type: TileType;
}

const GRID_SIZE = 12;

// The layout:
// E = Empty
// C = Crate (📦)
// S = Stagehand (👥)
// D = Dressing Room (🚪)
const initialLayout: string[] = [
  'E E E C E E E E E E E D',
  'E C E C E C C C C C E E',
  'E C E E E C E E E C E C',
  'E C C C E C E C E C E C',
  'E E E S E E E C E E E C',
  'C C E C C C C C C C E C',
  'E E E E E E E S E E E E',
  'E C C C C C C C C C C E',
  'E C E E E E E E E E C E',
  'E C E C C C S C C E C E',
  'E E E C E E E E E E E E',
  'E E E C E E E C C C C C'
];

const parseLayout = (layout: string[]): MapTile[][] => {
  return layout.map(row =>
    row.split(' ').map(char => {
      switch (char) {
        case 'C': return { type: 'CRATE' };
        case 'S': return { type: 'STAGEHAND' };
        case 'D': return { type: 'DRESSING_ROOM' };
        default: return { type: 'EMPTY' };
      }
    })
  );
};

export const BackstageView: React.FC = () => {
  const { transitionTo } = useWastelandState();
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 11 }); // Phoenix starts bottom-left
  const [map] = useState<MapTile[][]>(parseLayout(initialLayout));
  const [dialog, setDialog] = useState<string | null>(null);

  const movePlayer = React.useCallback((dx: number, dy: number) => {
    setDialog(null); // clear dialog on any move attempt

    const nextX = playerPos.x + dx;
    const nextY = playerPos.y + dy;

    // Check bounds
    if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
      return;
    }

    const nextTile = map[nextY][nextX];

    if (nextTile.type === 'CRATE') {
      return; // blocked
    }

    if (nextTile.type === 'STAGEHAND') {
      setDialog("Hey! Watch the slime! We've got a show to put on in five minutes!");
      return; // blocked
    }

    // Move player
    setPlayerPos({ x: nextX, y: nextY });

    if (nextTile.type === 'DRESSING_ROOM') {
      transitionTo(States.YMCA_GALA);
    }
  }, [playerPos, map, transitionTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#121214] flex items-center justify-center overflow-hidden">

      {/* Game Board */}
      <div className="relative border-4 border-[#39FF14] max-w-full aspect-square w-[576px] shadow-[0_0_20px_rgba(57,255,20,0.5)]">

        {/* Grid Container */}
        <div
          className="grid w-full h-full"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {map.map((row, y) => (
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className="w-full h-full flex items-center justify-center text-2xl relative"
              >
                {/* Floor rendering (empty by default) */}
                {tile.type === 'CRATE' && <span>📦</span>}
                {tile.type === 'STAGEHAND' && <span>👥</span>}
                {tile.type === 'DRESSING_ROOM' && (
                  <div className="absolute inset-0 border-[3px] border-[#FF007F] animate-pulse pointer-events-none" />
                )}
                {tile.type === 'DRESSING_ROOM' && <span>🚪</span>}
              </div>
            ))
          ))}
        </div>

        {/* Player Sprite */}
        <div
          className="absolute text-2xl flex items-center justify-center transition-all duration-100 ease-linear pointer-events-none"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(playerPos.x / GRID_SIZE) * 100}%`,
            top: `${(playerPos.y / GRID_SIZE) * 100}%`
          }}
        >
          🟢
        </div>

        {/* Dialog Box overlay */}
        {dialog && (
          <div className="absolute bottom-4 left-4 right-4 bg-black border-4 border-white p-4 z-10 font-bold text-white shadow-lg">
            {dialog}
          </div>
        )}
      </div>

      {/* Arcade D-Pad */}
      <div className="absolute bottom-6 right-6 grid grid-cols-3 gap-2 p-2">
        <div />
        <button
          className="btn-arcade-yellow flex items-center justify-center p-0"
          onClick={() => movePlayer(0, -1)}
          aria-label="Move Up"
        >
          ▲
        </button>
        <div />
        <button
          className="btn-arcade-yellow flex items-center justify-center p-0"
          onClick={() => movePlayer(-1, 0)}
          aria-label="Move Left"
        >
          ◀
        </button>
        <button
          className="btn-arcade-yellow flex items-center justify-center p-0"
          onClick={() => movePlayer(0, 1)}
          aria-label="Move Down"
        >
          ▼
        </button>
        <button
          className="btn-arcade-yellow flex items-center justify-center p-0"
          onClick={() => movePlayer(1, 0)}
          aria-label="Move Right"
        >
          ▶
        </button>
      </div>

    </div>
  );
};

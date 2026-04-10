/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import GameCanvas from './components/game/GameCanvas';
import { GameStateProvider } from './context/GameStateContext';

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <GameStateProvider>
        <GameCanvas />
      </GameStateProvider>
    </div>
  );
}

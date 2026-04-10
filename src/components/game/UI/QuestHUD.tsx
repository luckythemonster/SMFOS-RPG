/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameState } from '../../../context/GameStateContext';
import { motion } from 'motion/react';

/**
 * QuestHUD Component
 * Displays the current objective in the top-right corner.
 */
export default function QuestHUD() {
  const { state } = useGameState();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-2 right-2 sm:top-4 sm:right-4 z-40 pointer-events-none"
    >
      <div className="bg-black/80 border-2 border-green-500 p-2 sm:p-3 font-mono text-green-500 text-[9px] sm:text-xs uppercase tracking-widest max-w-[150px] sm:max-w-[200px] shadow-[0_0_10px_rgba(34,197,94,0.2)]">
        <div className="text-[8px] sm:text-[10px] opacity-60 mb-1 border-b border-green-500/30 pb-1">
          CURRENT OBJECTIVE
        </div>
        <div className="leading-tight">
          {state.currentQuest}
        </div>
      </div>
    </motion.div>
  );
}

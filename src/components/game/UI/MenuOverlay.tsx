/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useGameState } from '../../../context/GameStateContext';
import { useState } from 'react';

/**
 * MenuOverlay Component
 */
export default function MenuOverlay() {
  const { state, setFlag, equipItem, saveCurrentGame, resetGame } = useGameState();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const closeMenu = () => setFlag('isMenuOpen', false);

  const handleSave = () => {
    const success = saveCurrentGame();
    if (success) {
      setSaveMessage("GAME SAVED!");
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-[200] bg-black flex flex-col font-mono text-green-400 p-4 sm:p-6 uppercase tracking-widest border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-green-500/50 pb-2 sm:pb-4 mb-4 sm:mb-6 shrink-0">
        <h2 className="text-lg sm:text-2xl font-bold">SLUDGE-MOD</h2>
        <button 
          onClick={closeMenu}
          className="px-3 py-1 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors font-bold"
        >
          CLOSE [X]
        </button>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-8 min-h-0 overflow-hidden">
        {/* Status Section */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 overflow-y-auto pr-2">
          <h3 className="text-sm sm:text-lg border-b border-green-500/30 pb-1 sm:pb-2">PARTY STATUS</h3>
          
          <div className="space-y-4 sm:space-y-6">
            {state.activeParty.map(memberId => {
              const stats = state.partyStats[memberId as keyof typeof state.partyStats];
              const equipped = state.equippedItems[memberId as keyof typeof state.equippedItems];
              
              let borderColor = 'border-green-500';
              let textColor = 'text-green-500';
              let subTextColor = 'text-green-300';
              
              if (memberId === 'phoenix') {
                borderColor = 'border-orange-500';
                textColor = 'text-orange-500';
                subTextColor = 'text-orange-300';
              } else if (memberId === 'warner') {
                borderColor = 'border-blue-500';
                textColor = 'text-blue-500';
                subTextColor = 'text-blue-300';
              } else if (memberId === 'diego') {
                borderColor = 'border-red-500';
                textColor = 'text-red-500';
                subTextColor = 'text-red-300';
              } else if (memberId === 'sticky') {
                borderColor = 'border-cyan-500';
                textColor = 'text-cyan-500';
                subTextColor = 'text-cyan-300';
              } else if (memberId === 'ryan') {
                borderColor = 'border-green-500';
                textColor = 'text-green-500';
                subTextColor = 'text-green-300';
              }

              return (
                <div key={memberId} className={`border-l-4 ${borderColor} pl-3 sm:pl-4`}>
                  <div className={`text-lg sm:text-xl ${textColor}`}>{memberId.toUpperCase()}</div>
                  <div className={`text-[10px] sm:text-xs space-y-1 mt-1 sm:mt-2 ${textColor}`}>
                    <div>MAX VOL: {stats?.maxVolume ?? 0}</div>
                    <div>NOISE PWR: {stats?.noisePower ?? 0}</div>
                    <div className={`${subTextColor} mt-1`}>
                      MOD: {equipped || 'NONE'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory / Equipment Section */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-4 min-h-0">
          <h3 className="text-sm sm:text-lg border-b border-green-500/30 pb-1 sm:pb-2">INVENTORY</h3>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {!state.inventory || state.inventory.length === 0 ? (
              <div className="text-[10px] sm:text-xs opacity-50 italic">No mods found...</div>
            ) : (
              state.inventory.map((item, idx) => (
                <div 
                  key={`${item}-${idx}`} 
                  className="bg-green-900/20 border border-green-500/30 p-2 sm:p-3 flex flex-col gap-2"
                >
                  <div className="text-xs sm:text-sm font-bold">{item}</div>
                  <div className="flex gap-2 flex-wrap">
                    {state.activeParty.map(memberId => {
                      let borderColor = 'border-green-500';
                      let textColor = 'text-green-500';
                      
                      if (memberId === 'phoenix') {
                        borderColor = 'border-orange-500';
                        textColor = 'text-orange-500';
                      } else if (memberId === 'warner') {
                        borderColor = 'border-blue-500';
                        textColor = 'text-blue-500';
                      } else if (memberId === 'diego') {
                        borderColor = 'border-red-500';
                        textColor = 'text-red-500';
                      } else if (memberId === 'sticky') {
                        borderColor = 'border-cyan-500';
                        textColor = 'text-cyan-500';
                      }

                      return (
                        <button
                          key={memberId}
                          onClick={() => equipItem(memberId as any, item)}
                          disabled={state.equippedItems[memberId as keyof typeof state.equippedItems] === item}
                          className={`text-[9px] sm:text-[10px] px-2 py-1 border ${borderColor} ${textColor} hover:bg-opacity-80 hover:bg-current hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-colors`}
                        >
                          MOD {memberId.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-4 pt-2 border-t-2 border-green-500/30 flex flex-col items-center gap-4 shrink-0">
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-xs sm:text-sm font-bold"
          >
            {saveMessage || "SAVE GAME"}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors text-xs sm:text-sm font-bold"
          >
            CLEAR SAVE
          </button>
        </div>
        <div className="text-[9px] sm:text-[10px] opacity-70 text-center uppercase">
          SYSTEM READY // PRESS [M] TO EXIT
        </div>
      </div>
    </motion.div>
  );
}

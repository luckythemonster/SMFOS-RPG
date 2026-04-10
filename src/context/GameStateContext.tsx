/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { loadGame, saveGame, clearSave } from '../utils/saveManager';

interface Skill {
  name: string;
  multiplier: number;
  type: 'damage' | 'debuff' | 'heal' | 'special';
  recoil?: number;
}

interface PartyMemberStats {
  level: number;
  maxVolume: number;
  currentVolume: number;
  noisePower: number;
  skills: Skill[];
}

interface GameState {
  hasSpokenToDad: boolean;
  hasSpokenToPromoter: boolean;
  raidCompleted: boolean;
  currentMap: 'fathersShip' | 'minneapolisAlley' | 'phoenixApartment' | 'ryanGarage' | 'citySound' | 'minneapolisOverworld' | 'palmersBar' | 'palmersBarRubble' | 'spaceOverworld' | 'sector4Trench' | 'undergroundBarn' | 'undergroundBarnRaid' | 'vanCamp' | 'libraryInterior' | 'libraryStacks' | 'orbitalMansionExterior' | 'orbitalMansionGala' | 'orbitalGreenRoom' | 'orbitalDiningHall';
  inBattle: boolean;
  isMenuOpen: boolean;
  currentEnemy: any | null;
  defeatedEnemies: string[];
  inventory: string[];
  collectedItems: string[];
  stressLevel: number;
  merchFlipped: boolean;
  alibiRejection: boolean;
  isDisguised: boolean;
  partyStats: {
    lucky: PartyMemberStats;
    phoenix: PartyMemberStats;
    warner: PartyMemberStats;
    diego: PartyMemberStats;
    ryan: PartyMemberStats;
    sticky: PartyMemberStats;
  };
  equippedItems: {
    lucky: string | null;
    phoenix: string | null;
    warner: string | null;
    diego: string | null;
    ryan: string | null;
    sticky: string | null;
  };
  activeParty: string[];
  storyChapter: number;
  playerPosition: { x: number; y: number } | null;
  rehearsalStage: number;
  currentQuest: string;
}

interface GameStateContextType {
  state: GameState;
  setFlag: (flag: keyof GameState, value: any) => void;
  markEnemyDefeated: (id: string) => void;
  addToInventory: (item: string) => void;
  markItemCollected: (id: string) => void;
  equipItem: (member: 'lucky' | 'phoenix' | 'warner' | 'diego' | 'ryan' | 'sticky', item: string | null) => void;
  restorePartyVolume: () => void;
  levelUpParty: () => void;
  increaseStress: (amount: number) => void;
  removeFromInventory: (item: string) => void;
  updateActiveParty: (newParty: string[]) => void;
  advanceChapter: (newChapter: number) => void;
  saveCurrentGame: () => boolean;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    hasSpokenToDad: false,
    hasSpokenToPromoter: false,
    raidCompleted: false,
    currentMap: 'fathersShip',
    inBattle: false,
    isMenuOpen: false,
    currentEnemy: null,
    defeatedEnemies: [],
    inventory: [],
    collectedItems: [],
    stressLevel: 0,
    merchFlipped: false,
    alibiRejection: false,
    isDisguised: false,
    partyStats: {
      lucky: { 
        level: 1, maxVolume: 80, currentVolume: 80, noisePower: 20,
        skills: [
          { name: 'Power Chord', multiplier: 1.0, type: 'damage' },
          { name: 'Alien Shriek', multiplier: 1.8, type: 'damage', recoil: 0.1 }
        ]
      },
      phoenix: { 
        level: 1, maxVolume: 120, currentVolume: 120, noisePower: 15,
        skills: [
          { name: 'Sub-Bass Blast', multiplier: 1.0, type: 'damage' },
          { name: 'Sludge Anchor', multiplier: 0.5, type: 'debuff' }
        ]
      },
      warner: { 
        level: 2, maxVolume: 170, currentVolume: 170, noisePower: 15,
        skills: [
          { name: 'Steady Groove', multiplier: 1.0, type: 'damage' },
          { name: 'Crash Smash', multiplier: 1.6, type: 'damage' }
        ]
      },
      diego: { 
        level: 1, maxVolume: 100, currentVolume: 100, noisePower: 25,
        skills: [
          { name: 'Wall of Fuzz', multiplier: 1.0, type: 'damage' },
          { name: 'Positive Vibrations', multiplier: 0.5, type: 'heal' }
        ]
      },
      ryan: { 
        level: 1, maxVolume: 100, currentVolume: 100, noisePower: 10,
        skills: [
          { name: 'Blast Beat', multiplier: 1.0, type: 'damage' },
          { name: 'Cosmic Fill', multiplier: 1.7, type: 'damage' }
        ]
      },
      sticky: { 
        level: 2, maxVolume: 200, currentVolume: 200, noisePower: 0,
        skills: [
          { name: '13/8 Clank', multiplier: 1.0, type: 'special' }
        ]
      },
    },
    equippedItems: {
      lucky: null,
      phoenix: null,
      warner: null,
      diego: null,
      ryan: null,
      sticky: null,
    },
    activeParty: ['lucky'],
    storyChapter: 0,
    playerPosition: null,
    rehearsalStage: 0,
    currentQuest: "Rehearse with the new drummer.",
  });

  // Load game on mount
  useEffect(() => {
    const savedState = loadGame();
    if (savedState) {
      setState((prev) => ({
        ...prev,
        ...savedState,
        // Deep merge partyStats to avoid partial data issues
        partyStats: {
          lucky: { ...prev.partyStats.lucky, ...(savedState.partyStats?.lucky || {}) },
          phoenix: { ...prev.partyStats.phoenix, ...(savedState.partyStats?.phoenix || {}) },
          warner: { ...prev.partyStats.warner, ...(savedState.partyStats?.warner || {}) },
          diego: { ...prev.partyStats.diego, ...(savedState.partyStats?.diego || {}) },
          ryan: { ...prev.partyStats.ryan, ...(savedState.partyStats?.ryan || {}) },
          sticky: { ...prev.partyStats.sticky, ...(savedState.partyStats?.sticky || {}) },
        },
        storyChapter: savedState.storyChapter ?? 0,
        isMenuOpen: false, // Ensure menu is closed on load
        inBattle: false,   // Ensure not in battle on load
      }));
    }
  }, []);

  const setFlag = useCallback((flag: keyof GameState, value: any) => {
    setState((prev) => {
      const newValue = typeof value === 'function' ? value(prev[flag]) : value;
      if (prev[flag] === newValue) return prev;
      return { ...prev, [flag]: newValue };
    });
  }, []);

  const markEnemyDefeated = useCallback((id: string) => {
    setState((prev) => {
      if (prev.defeatedEnemies.includes(id)) return prev;
      return { ...prev, defeatedEnemies: [...prev.defeatedEnemies, id] };
    });
  }, []);

  const addToInventory = useCallback((item: string) => {
    setState((prev) => ({ ...prev, inventory: [...prev.inventory, item] }));
  }, []);

  const removeFromInventory = useCallback((item: string) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter(i => i !== item)
    }));
  }, []);

  const markItemCollected = useCallback((id: string) => {
    setState((prev) => {
      if (prev.collectedItems.includes(id)) return prev;
      return { ...prev, collectedItems: [...prev.collectedItems, id] };
    });
  }, []);

  const equipItem = useCallback((member: 'lucky' | 'phoenix' | 'warner' | 'diego' | 'ryan' | 'sticky', item: string | null) => {
    setState((prev) => {
      const oldItem = prev.equippedItems[member];
      const newStats = {
        lucky: { ...prev.partyStats.lucky },
        phoenix: { ...prev.partyStats.phoenix },
        warner: { ...prev.partyStats.warner },
        diego: { ...prev.partyStats.diego },
        ryan: { ...prev.partyStats.ryan },
        sticky: { ...prev.partyStats.sticky },
      };
      
      // Remove old item bonus
      if (oldItem === 'DIY PCB') {
        newStats[member].noisePower -= 10;
      }
      
      // Add new item bonus
      if (item === 'DIY PCB') {
        newStats[member].noisePower += 10;
      }

      return {
        ...prev,
        partyStats: newStats,
        equippedItems: {
          ...prev.equippedItems,
          [member]: item,
        },
      };
    });
  }, []);

  const restorePartyVolume = useCallback(() => {
    setState((prev) => ({
      ...prev,
      partyStats: {
        lucky: { ...prev.partyStats.lucky, currentVolume: prev.partyStats.lucky.maxVolume },
        phoenix: { ...prev.partyStats.phoenix, currentVolume: prev.partyStats.phoenix.maxVolume },
        warner: { ...prev.partyStats.warner, currentVolume: prev.partyStats.warner.maxVolume },
        diego: { ...prev.partyStats.diego, currentVolume: prev.partyStats.diego.maxVolume },
        ryan: { ...prev.partyStats.ryan, currentVolume: prev.partyStats.ryan.maxVolume },
        sticky: { ...prev.partyStats.sticky, currentVolume: prev.partyStats.sticky.maxVolume },
      }
    }));
  }, []);

  const levelUpParty = useCallback(() => {
    setState((prev) => {
      const levelUpMember = (stats: PartyMemberStats) => ({
        ...stats,
        level: stats.level + 1,
        maxVolume: stats.maxVolume + 20,
        noisePower: stats.noisePower + 5,
        currentVolume: stats.maxVolume + 20, // Heal to new max
      });

      return {
        ...prev,
        partyStats: {
          lucky: levelUpMember(prev.partyStats.lucky),
          phoenix: levelUpMember(prev.partyStats.phoenix),
          warner: levelUpMember(prev.partyStats.warner),
          diego: levelUpMember(prev.partyStats.diego),
          ryan: levelUpMember(prev.partyStats.ryan),
          sticky: levelUpMember(prev.partyStats.sticky),
        }
      };
    });
  }, []);

  const increaseStress = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      stressLevel: prev.stressLevel + amount
    }));
  }, []);

  const updateActiveParty = useCallback((newParty: string[]) => {
    setState((prev) => ({
      ...prev,
      activeParty: newParty
    }));
  }, []);

  const advanceChapter = useCallback((newChapter: number) => {
    setState((prev) => {
      let newParty = prev.activeParty;
      
      switch (newChapter) {
        case 0:
          newParty = ['lucky'];
          break;
        case 1:
        case 2:
          newParty = ['lucky', 'phoenix', 'warner', 'diego'];
          break;
        case 3:
          newParty = ['lucky', 'phoenix', 'diego', 'sticky'];
          break;
      }

      return {
        ...prev,
        storyChapter: newChapter,
        activeParty: newParty
      };
    });
  }, []);

  const saveCurrentGame = useCallback(() => {
    return saveGame(state);
  }, [state]);

  const resetGame = useCallback(() => {
    clearSave();
    window.location.reload();
  }, []);

  const value = useMemo(() => ({ 
    state, 
    setFlag, 
    markEnemyDefeated, 
    addToInventory, 
    markItemCollected,
    equipItem,
    restorePartyVolume,
    levelUpParty,
    increaseStress,
    removeFromInventory,
    updateActiveParty,
    advanceChapter,
    saveCurrentGame,
    resetGame
  }), [state, setFlag, markEnemyDefeated, addToInventory, markItemCollected, equipItem, saveCurrentGame, resetGame, updateActiveParty, advanceChapter]);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}

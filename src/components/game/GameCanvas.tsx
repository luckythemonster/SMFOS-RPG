/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useGameLoop } from '../../hooks/useGameLoop';
import { usePlayerController } from '../../hooks/usePlayerController';
import VirtualDPad from './UI/VirtualDPad';
import DialogueBox, { DialogueBoxHandle } from './UI/DialogueBox';
import BattleScreen from './UI/BattleScreen';
import MenuOverlay from './UI/MenuOverlay';
import QuestHUD from './UI/QuestHUD';
import { AnimatePresence } from 'motion/react';
import { fathersShip, TILE_TYPES } from '../../data/maps/fathersShip';
import { fathersShipEntities } from '../../data/entities/fathersShipEntities';
import { minneapolisAlley } from '../../data/maps/minneapolisAlley';
import { minneapolisAlleyEntities } from '../../data/entities/minneapolisAlleyEntities';
import { phoenixApartment } from '../../data/maps/phoenixApartment';
import { phoenixApartmentEntities } from '../../data/entities/phoenixApartmentEntities';
import { ryanGarage } from '../../data/maps/ryanGarage';
import { ryanGarageEntities } from '../../data/entities/ryanGarageEntities';
import { citySound } from '../../data/maps/citySound';
import { getCitySoundEntities } from '../../data/entities/citySoundEntities';
import { minneapolisOverworld } from '../../data/maps/minneapolisOverworld';
import { minneapolisOverworldEntities } from '../../data/entities/minneapolisOverworldEntities';
import { palmersBar } from '../../data/maps/palmersBar';
import { palmersBarEntities } from '../../data/entities/palmersBarEntities';
import { palmersBarRubble } from '../../data/maps/palmersBarRubble';
import { palmersBarRubbleEntities } from '../../data/entities/palmersBarRubbleEntities';
import { spaceOverworld } from '../../data/maps/spaceOverworld';
import { getSpaceEntities } from '../../data/entities/spaceEntities';
import { sector4Trench } from '../../data/maps/sector4Trench';
import { sector4TrenchEntities } from '../../data/entities/sector4TrenchEntities';
import { undergroundBarn } from '../../data/maps/undergroundBarn';
import { undergroundBarnEntities } from '../../data/entities/undergroundBarnEntities';
import { undergroundBarnRaid } from '../../data/maps/undergroundBarnRaid';
import { undergroundBarnRaidEntities } from '../../data/entities/undergroundBarnRaidEntities';
import { vanCamp } from '../../data/maps/vanCamp';
import { getVanCampEntities } from '../../data/entities/vanCampEntities';
import { libraryInterior } from '../../data/maps/libraryInterior';
import { getLibraryInteriorEntities } from '../../data/entities/libraryInteriorEntities';
import { libraryStacks } from '../../data/maps/libraryStacks';
import { getLibraryStacksEntities } from '../../data/entities/libraryStacksEntities';
import { orbitalMansionExterior } from '../../data/maps/orbitalMansionExterior';
import { orbitalMansionExteriorEntities } from '../../data/entities/orbitalMansionExteriorEntities';
import { orbitalMansionGala } from '../../data/maps/orbitalMansionGala';
import { orbitalMansionGalaEntities } from '../../data/entities/orbitalMansionGalaEntities';
import { orbitalGreenRoom } from '../../data/maps/orbitalGreenRoom';
import { orbitalGreenRoomEntities } from '../../data/entities/orbitalGreenRoomEntities';
import { orbitalDiningHall } from '../../data/maps/orbitalDiningHall';
import { orbitalDiningHallEntities } from '../../data/entities/orbitalDiningHallEntities';
import { orbitalVacuumEscapeEntities } from '../../data/entities/orbitalVacuumEscapeEntities';
import { orbitalVacuumEscape } from '../../data/maps/orbitalVacuumEscape';
import { useGameState } from '../../context/GameStateContext';

/**
 * GameCanvas Component
 * Initializes the HTML5 Canvas and orchestrates the game loop and player control.
 * 
 * Directory Structure Recommendation:
 * src/
 *   components/
 *     game/
 *       GameCanvas.tsx      <- This file (The orchestrator)
 *       UI/                 <- Future React UI overlays (Dialogue, HUD)
 *   hooks/
 *     useGameLoop.ts        <- Core timing logic
 *     usePlayerController.ts <- Input & Movement logic
 *   types/
 *     game.ts               <- Shared interfaces
 */
export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridSize = 32; // 32x32 pixel tiles for that 8-bit feel

  const { 
    state, 
    setFlag, 
    addToInventory, 
    removeFromInventory, 
    markItemCollected, 
    restorePartyVolume, 
    levelUpParty, 
    increaseStress, 
    advanceChapter,
    updateActiveParty
  } = useGameState();

  // Determine active map and entities based on state
  const activeMap = useMemo(() => {
    switch (state.currentMap) {
      case 'fathersShip': return fathersShip;
      case 'minneapolisAlley': return minneapolisAlley;
      case 'phoenixApartment': return phoenixApartment;
      case 'ryanGarage': return ryanGarage;
      case 'citySound': return citySound;
      case 'minneapolisOverworld': return minneapolisOverworld;
      case 'palmersBar': return palmersBar;
      case 'palmersBarRubble': return palmersBarRubble;
      case 'spaceOverworld': return spaceOverworld;
      case 'sector4Trench': return sector4Trench;
      case 'undergroundBarn': return undergroundBarn;
      case 'undergroundBarnRaid': return undergroundBarnRaid;
      case 'vanCamp': return vanCamp;
      case 'libraryInterior': return libraryInterior;
      case 'libraryStacks': return libraryStacks;
      case 'orbitalMansionExterior': return orbitalMansionExterior;
      case 'orbitalMansionGala': return orbitalMansionGala;
      case 'orbitalGreenRoom': return orbitalGreenRoom;
      case 'orbitalDiningHall': return orbitalDiningHall;
      case 'orbitalVacuumEscape': return orbitalVacuumEscape;
      default: return fathersShip;
    }
  }, [state.currentMap]);

  const rawEntities = useMemo(() => {
    switch (state.currentMap) {
      case 'fathersShip': return fathersShipEntities;
      case 'minneapolisAlley': return minneapolisAlleyEntities;
      case 'phoenixApartment': return phoenixApartmentEntities;
      case 'ryanGarage': return ryanGarageEntities;
      case 'citySound': return getCitySoundEntities(state.rehearsalStage);
      case 'minneapolisOverworld': return minneapolisOverworldEntities;
      case 'palmersBar': return palmersBarEntities;
      case 'palmersBarRubble': return palmersBarRubbleEntities;
      case 'spaceOverworld': return getSpaceEntities(state.storyChapter);
      case 'sector4Trench': return sector4TrenchEntities;
      case 'undergroundBarn': return undergroundBarnEntities;
      case 'undergroundBarnRaid': return undergroundBarnRaidEntities;
      case 'vanCamp': return getVanCampEntities(state.storyChapter);
      case 'libraryInterior': return getLibraryInteriorEntities(state.alibiRejection);
      case 'libraryStacks': return getLibraryStacksEntities(state.merchFlipped);
      case 'orbitalMansionExterior': return orbitalMansionExteriorEntities;
      case 'orbitalMansionGala': return orbitalMansionGalaEntities;
      case 'orbitalGreenRoom': return orbitalGreenRoomEntities;
      case 'orbitalDiningHall': return orbitalDiningHallEntities;
      case 'orbitalVacuumEscape': return orbitalVacuumEscapeEntities;
      default: return fathersShipEntities;
    }
  }, [state.currentMap, state.rehearsalStage]);

  const activeEntities = useMemo(() => 
    rawEntities.filter(entity => {
      // Filter out defeated enemies
      if (state.defeatedEnemies.includes(entity.id)) return false;
      
      // Filter out collected items
      if (state.collectedItems.includes(entity.id)) return false;

      // Specific logic for the Potato Sack heist
      if (entity.id === 'potato_sack') {
        return state.hasSpokenToPromoter && state.raidCompleted;
      }

      // Hide the promoter until the raid is done
      if (entity.id === 'sketchy_promoter') {
        return state.raidCompleted;
      }

      // Filter out barn entrance if raid is completed
      if (entity.id === 'barn_entrance' && state.raidCompleted) return false;

      // Special logic for loot: only show if the corresponding enemy is defeated
      if (entity.id === 'loot_vanguard_1') {
        return state.defeatedEnemies.includes('vanguard_alley_1');
      }

      // Only show Orbital Mansion if the quest is active
      if (entity.id === 'orbital_mansion_entry') {
        return state.currentQuest === "Infiltrate the Orbital Mansion.";
      }

      return true;
    }),
    [rawEntities, state.defeatedEnemies, state.collectedItems, state.hasSpokenToPromoter, state.raidCompleted]
  );

  // Dialogue State
  const [activeDialogue, setActiveDialogue] = useState<string[] | null>(null);
  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
  const dialogueRef = useRef<DialogueBoxHandle>(null);

  // Initialize player controller
  const { player, updatePlayer, setVirtualKey, clearKeys, setPlayerPosition, getInteractionTarget, keysPressed } = usePlayerController(
    gridSize, 
    !activeDialogue && !state.inBattle && !state.isMenuOpen, 
    activeMap,
    activeEntities
  );

  // Sync player position from state to controller (Teleportation)
  useEffect(() => {
    if (state.playerPosition) {
      const currentGridX = Math.round(player.position.x / gridSize);
      const currentGridY = Math.round(player.position.y / gridSize);
      
      if (state.playerPosition.x !== currentGridX || state.playerPosition.y !== currentGridY) {
        setPlayerPosition(state.playerPosition.x, state.playerPosition.y);
      }
    }
  }, [state.playerPosition?.x, state.playerPosition?.y, setPlayerPosition, gridSize]);

  // Sync player position to global state for saving
  useEffect(() => {
    if (!player.isMoving) {
      const gridX = Math.round(player.position.x / gridSize);
      const gridY = Math.round(player.position.y / gridSize);
      
      const stateX = state.playerPosition?.x;
      const stateY = state.playerPosition?.y;

      if (stateX !== gridX || stateY !== gridY) {
        setFlag('playerPosition', { x: gridX, y: gridY });
      }
    }
  }, [player.isMoving, player.position.x, player.position.y, gridSize, setFlag, state.playerPosition?.x, state.playerPosition?.y]);

  // Vacuum Step-Drain Mechanic
  const lastGridPos = useRef({ x: -1, y: -1 });
  useEffect(() => {
    if (state.currentMap === 'orbitalVacuumEscape' && !player.isMoving) {
      const gridX = Math.round(player.position.x / gridSize);
      const gridY = Math.round(player.position.y / gridSize);
      
      if (lastGridPos.current.x !== gridX || lastGridPos.current.y !== gridY) {
        // We took a step
        if (lastGridPos.current.x !== -1) { // Don't drain on first load
          const newPartyStats = { ...state.partyStats };
          let allDefeated = true;
          
          state.activeParty.forEach(id => {
            const stats = newPartyStats[id as keyof typeof newPartyStats];
            if (stats && stats.currentVolume > 0) {
              stats.currentVolume = Math.max(0, stats.currentVolume - 5);
              if (stats.currentVolume > 0) allDefeated = false;
            }
          });
          
          if (allDefeated) {
            // Failsafe: bump back to start with 1 Volume
            state.activeParty.forEach(id => {
              const stats = newPartyStats[id as keyof typeof newPartyStats];
              if (stats) stats.currentVolume = 1;
            });
            setFlag('playerPosition', { x: 10, y: 13 }); // Reset state position
            setPlayerPosition(10, 13); // Start of map
          }
          
          setFlag('partyStats', newPartyStats);
        }
        lastGridPos.current = { x: gridX, y: gridY };
      }
    } else if (state.currentMap !== 'orbitalVacuumEscape') {
      lastGridPos.current = { x: -1, y: -1 };
    }
  }, [player.isMoving, player.position.x, player.position.y, state.currentMap, state.activeParty.join(','), setFlag, setPlayerPosition, gridSize]);

  // Wrap setVirtualKey to handle menu toggle for the virtual 'Start' button
  const handleVirtualKey = useCallback((key: string, isPressed: boolean) => {
    if (key === 'm' && isPressed) {
      if (!activeDialogue && !state.inBattle) {
        setFlag('isMenuOpen', (prev: boolean) => !prev);
      }
    }
    setVirtualKey(key, isPressed);
  }, [activeDialogue, state.inBattle, setFlag, setVirtualKey]);

  // Handle Menu Toggle (Keyboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' || e.key === 'Escape') {
        if (!activeDialogue && !state.inBattle) {
          setFlag('isMenuOpen', (prev: boolean) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialogue, state.inBattle, setFlag]);

  // Clear keys when dialogue starts or ends to prevent "stuck" movement
  useEffect(() => {
    clearKeys();
  }, [activeDialogue, clearKeys]);

  // Core Update Logic
  const onUpdate = (deltaTime: number) => {
    updatePlayer(deltaTime);

    // Check for interaction input
    if (keysPressed.current.has('e')) {
      if (!activeDialogue) {
        const target = getInteractionTarget();
        if (target) {
          let dialogue = target.dialogue;

          // Handle conditional dialogue for Escape Pod Console
          if (target.id === 'console') {
            dialogue = state.hasSpokenToDad 
              ? ["Pod ready. Destination: Earth.", "Initiating launch sequence..."]
              : ["Access denied. Corporate clearance required to launch pod."];
          }

          // Handle conditional dialogue for Space Stove
          if (target.id === 'space_stove') {
            dialogue = state.inventory.includes("Sack of Cosmic Potatoes")
              ? [
                  "The potatoes boil with a soft, radioactive hum.", 
                  "The band eats in silence, reflecting on the raid.", 
                  "LEVEL UP: MOLECULAR STABILITY IMPROVED!"
                ]
              : ["A portable space-stove. It's cold.", "We need something to cook."];
          }

          setActiveDialogue(dialogue);
          setActiveEntityId(target.id);
          // Clear the key so it doesn't trigger repeatedly
          keysPressed.current.delete('e');
        }
      } else {
        // Advance dialogue if it's already active
        dialogueRef.current?.advance();
        // Clear the key so it doesn't trigger repeatedly
        keysPressed.current.delete('e');
      }
    }
  };

  const handleDialogueComplete = () => {
    // If we just finished talking to Dad, flip the flag
    if (activeEntityId === 'intercom') {
      setFlag('hasSpokenToDad', true);
    }

    // Handle map transition for Escape Pod Console
    if (activeEntityId === 'console' && state.hasSpokenToDad) {
      setFlag('currentMap', 'minneapolisAlley');
      // Reset Lucky's position to the crater in the alleyway
      setPlayerPosition(5, 8);
    }

    // Handle combat transition for Vanguard Agent
    // Safety check: ensure the enemy isn't already defeated
    if (activeEntityId === 'vanguard_alley_1' && !state.defeatedEnemies.includes('vanguard_alley_1')) {
      const enemy = activeEntities.find(e => e.id === 'vanguard_alley_1');
      setFlag('currentEnemy', enemy);
      setFlag('inBattle', true);
    }

    // Handle loot collection
    if (activeEntityId === 'loot_vanguard_1') {
      addToInventory("DIY PCB");
      markItemCollected('loot_vanguard_1');
    }

    // Handle map transition to Phoenix's Apartment
    if (activeEntityId === 'phoenix' && state.currentMap === 'minneapolisAlley') {
      if (!state.activeParty.includes('phoenix')) {
        updateActiveParty([...state.activeParty, 'phoenix']);
      }
    }

    if (activeEntityId === 'apartment_door') {
      setFlag('currentMap', 'phoenixApartment');
      setPlayerPosition(1, 4);
    }

    // Handle map transition to Ryan's Garage (The Cosmic Ad)
    if (activeEntityId === 'bass_amp') {
      setFlag('currentMap', 'ryanGarage');
      setPlayerPosition(1, 5);
    }

    // Handle map transition to City Sound from Ryan's Garage
    if (activeEntityId === 'ryan' && state.currentMap === 'ryanGarage') {
      // Ryan is NOT added to the party yet
      setFlag('currentMap', 'citySound');
      setFlag('rehearsalStage', 1);
      setPlayerPosition(1, 2);
    }

    // Handle City Sound Rehearsal Stages
    if (activeEntityId === 'bajonka_hallway' && state.rehearsalStage === 1) {
      setFlag('rehearsalStage', 2);
      // Teleport into the practice room
      setPlayerPosition(9, 6);
    }

    if (activeEntityId === 'roland_amp' && state.rehearsalStage === 2) {
      setFlag('currentEnemy', { id: 'ryan_possession', name: 'Ryan (Slime-Synced)', volume: 999 });
      setFlag('inBattle', true);
    }

    if (activeEntityId === 'bajonka_contract' && state.rehearsalStage === 3) {
      setFlag('rehearsalStage', 4);
      setFlag('currentQuest', "Survive Brian's audition (1 Month Later).");
      updateActiveParty(['lucky', 'phoenix', 'ryan']);
    }

    if (activeEntityId === 'roland_amp' && state.rehearsalStage === 4) {
      setFlag('rehearsalStage', 5);
      setFlag('currentQuest', "Deal with the fallout.");
    }

    if (activeEntityId === 'brian' && state.rehearsalStage === 5) {
      setFlag('rehearsalStage', 6);
    }

    if (activeEntityId === 'roland_amp' && state.rehearsalStage === 6) {
      restorePartyVolume();
      setFlag('currentEnemy', { id: 'brian_suburbanite', name: 'Brian (HOA Defender)', volume: 120 });
      setFlag('inBattle', true);
    }

    if (activeEntityId === 'brian' && state.rehearsalStage === 7) {
      setFlag('rehearsalStage', 8);
    }

    if (activeEntityId === 'bajonka_final' && state.rehearsalStage === 8) {
      setFlag('rehearsalStage', 9);
    }

    if (activeEntityId === 'palmers_flyer' && state.rehearsalStage === 9) {
      addToInventory("Palmer's Flyer");
      markItemCollected('palmers_flyer');
      setFlag('currentQuest', "Play the gig at Palmer's Bar.");
    }

    // Handle leaving City Sound
    if (activeEntityId === 'city_sound_exit' && state.rehearsalStage >= 9) {
      setFlag('currentMap', 'minneapolisOverworld');
      setPlayerPosition(5, 4); // On top of City Sound node
    }

    // Handle Overworld transitions
    if (activeEntityId === 'palmers_bar_node' && state.currentMap === 'minneapolisOverworld') {
      setFlag('currentMap', 'palmersBar');
      setPlayerPosition(10, 7); // Center of the bar
    }

    if (activeEntityId === 'stage_mic' && state.currentMap === 'palmersBar') {
      setFlag('currentEnemy', { id: 'palmers_bar_structure', name: 'Palmer\'s Bar (Structural Integrity)', volume: 5000 });
      setFlag('inBattle', true);
    }

    if (activeEntityId === 'van_keys') {
      addToInventory("Van Keys");
      addToInventory("Tour Itinerary");
      markItemCollected('van_keys');
      advanceChapter(1);
      setFlag('currentQuest', "Start the Potato Belt Tour.");
      setFlag('currentMap', 'spaceOverworld');
      setPlayerPosition(5, 7);
    }

    if (activeEntityId === 'potato_belt_entry') {
      setFlag('currentMap', 'sector4Trench');
      setPlayerPosition(10, 13);
    }

    if (activeEntityId === 'barn_entrance') {
      setFlag('currentMap', 'undergroundBarn');
      setPlayerPosition(10, 13);
      setFlag('currentQuest', "Play the Sector 4 Stress Test.");
    }

    if (activeEntityId === 'barn_mic') {
      setFlag('currentQuest', "Survive the Sector 4 Breach!");
      setFlag('currentEnemy', { id: 'vanguard_riot_drone', name: 'Vanguard Riot Drone', volume: 200 });
      setFlag('inBattle', true);
    }

    if (activeEntityId === 'back_exit_door') {
      setFlag('raidCompleted', true);
      setFlag('currentMap', 'sector4Trench');
      setPlayerPosition(10, 4); // Near barn entrance
    }

    if (activeEntityId === 'sketchy_promoter') {
      setFlag('hasSpokenToPromoter', true);
      setActiveDialogue([
        "Are you kidding me? I literally just quit my life to escape middle management!",
        "I'm not joining your bureaucratic book club!"
      ]);
      setActiveEntityId('lucky_response');
      return;
    }

    if (activeEntityId === 'potato_sack') {
      addToInventory("Sack of Cosmic Potatoes");
      markItemCollected('potato_sack');
      setFlag('currentQuest', "Triumphant & Broke. Leave Sector 4.");
    }

    if (activeEntityId === 'space_van' && state.currentMap === 'sector4Trench') {
      setFlag('currentMap', 'spaceOverworld');
      setPlayerPosition(5, 7);
    }

    if (activeEntityId === 'space_van' && state.inventory.includes("Sack of Cosmic Potatoes")) {
      setFlag('currentMap', 'vanCamp');
      setPlayerPosition(10, 11); // Outside the van
      setFlag('rehearsalStage', 10); // End of chapter flag
    }

    if (activeEntityId === 'space_stove' && state.inventory.includes("Sack of Cosmic Potatoes")) {
      if (state.storyChapter === 1) {
        levelUpParty();
        removeFromInventory("Sack of Cosmic Potatoes");
        advanceChapter(2);
      } else {
        setActiveDialogue(["The stove is cold. We don't have anything to cook right now."]);
      }
    }

    if (activeEntityId === 'pilot_seat') {
      setFlag('currentMap', 'spaceOverworld');
      setPlayerPosition(5, 5); // Near the van camp entry in space
    }

    if (activeEntityId === 'library_entry') {
      setFlag('currentMap', 'libraryInterior');
      setPlayerPosition(10, 13); // Near the entrance
    }

    if (activeEntityId === 'van_camp_entry') {
      setFlag('currentMap', 'vanCamp');
      setPlayerPosition(10, 8);
    }

    if (activeEntityId === 'orbital_mansion_entry') {
      setFlag('currentMap', 'orbitalMansionExterior');
      setPlayerPosition(10, 13);
    }

    if (activeEntityId === 'to_stacks') {
      setFlag('currentMap', 'libraryStacks');
      setPlayerPosition(3, 7);
    }

    if (activeEntityId === 'back_to_library_interior') {
      setFlag('currentMap', 'libraryInterior');
      setPlayerPosition(16, 7);
    }

    if (activeEntityId === 'exit_library') {
      setFlag('currentMap', 'vanCamp');
      setPlayerPosition(10, 12); // Outside the van at camp
    }

    if (activeEntityId === 'space_van_mansion') {
      setFlag('isDisguised', true);
      setFlag('currentQuest', "Infiltrate the Gala");
      setFlag('currentMap', 'orbitalMansionGala');
      setPlayerPosition(10, 13);
    }

    if (activeEntityId === 'vanguard_tech_bro') {
      setFlag('currentQuest', "Find the Synergy Triad in the Green Room.");
    }

    if (activeEntityId === 'green_room_door') {
      if (state.currentQuest === "Find the Synergy Triad in the Green Room.") {
        setFlag('currentMap', 'orbitalGreenRoom');
        setPlayerPosition(2, 5);
      } else {
        setActiveDialogue(["The door is locked. You need a reason to be back here."]);
        return;
      }
    }

    if (activeEntityId === 'space_van_getaway') {
      restorePartyVolume();
      setFlag('currentMap', 'vanCamp');
      setFlag('currentQuest', "Rest and recover.");
      setPlayerPosition(10, 11);
    }

    if (activeEntityId === 'stage_access_door') {
      setFlag('currentMap', 'orbitalDiningHall');
      setFlag('currentQuest', "Witness the Main Course.");
      setPlayerPosition(10, 13);
    }

    if (activeEntityId === 'steven_alibi') {
      increaseStress(5);
    }

    if (activeEntityId === 'potato_table' && !state.merchFlipped) {
      setFlag('merchFlipped', true);
    }

    if (activeEntityId === 'steven_alibi_stacks') {
      setFlag('alibiRejection', true);
    }

    if (activeEntityId === 'sketchy_promoter_library') {
      setFlag('currentQuest', "Infiltrate the Orbital Mansion.");
      addToInventory("Eclipse Contractor Waiver");
      advanceChapter(3);
    }

    if (activeEntityId === 'stage_mic_library') {
      setFlag('currentEnemy', { id: 'library_crowd', name: 'The Library Crowd', volume: 1000 });
      setFlag('inBattle', true);
    }

    if (activeEntityId === 'heavy_curtains') {
      setFlag('currentEnemy', { id: 'laserstein_dome', name: 'Jeffrey Laserstein & The Glass Dome', volume: 4000 });
      setFlag('inBattle', true);
    }

    setActiveDialogue(null);
    setActiveEntityId(null);
  };

  // Core Rendering Logic
  const onRender = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Tilemap
    activeMap.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === TILE_TYPES.WALL) {
          if (state.currentMap === 'fathersShip') ctx.fillStyle = '#e0e0e0';
          else if (state.currentMap === 'minneapolisAlley') ctx.fillStyle = '#333';
          else if (state.currentMap === 'phoenixApartment') ctx.fillStyle = '#4a3a2a'; // Wood/Poster walls
          else if (state.currentMap === 'ryanGarage') ctx.fillStyle = '#222'; // Dark concrete
          else if (state.currentMap === 'citySound') ctx.fillStyle = '#1a1a1a'; // Dingy hallway/room walls
          else if (state.currentMap === 'minneapolisOverworld') ctx.fillStyle = '#111'; // Building blocks
          else if (state.currentMap === 'palmersBar') ctx.fillStyle = '#3d1a1a'; // Brick walls
          else if (state.currentMap === 'palmersBarRubble') ctx.fillStyle = '#111'; // Rubble walls (if any)
          else if (state.currentMap === 'spaceOverworld') ctx.fillStyle = '#000'; // Deep space
          else if (state.currentMap === 'sector4Trench') ctx.fillStyle = '#004400'; // Glowing crop edges
          else if (state.currentMap === 'undergroundBarn') {
            if (tile === TILE_TYPES.PALLET) ctx.fillStyle = '#8b4513'; // Shipping pallet (brown)
            else ctx.fillStyle = '#3d1a1a'; // Barn walls
          }
          else if (state.currentMap === 'undergroundBarnRaid') {
            if (tile === 4) ctx.fillStyle = '#004400'; // Ceiling hole (Green/Yellow sky)
            else ctx.fillStyle = '#3d1a1a'; // Barn walls
          }
          else if (state.currentMap === 'vanCamp') {
            ctx.fillStyle = '#000'; // Black van walls
          }
          else if (state.currentMap === 'libraryInterior' || state.currentMap === 'libraryStacks') {
            ctx.fillStyle = '#4a3a2a'; // Bookshelf walls
          }
          else if (state.currentMap === 'orbitalMansionExterior') {
            ctx.fillStyle = '#c0c0c0'; // Silver/Marble walls
          }
          else if (state.currentMap === 'orbitalMansionGala') {
            ctx.fillStyle = '#add8e6'; // Light Blue glass walls
          }
          else if (state.currentMap === 'orbitalGreenRoom' || state.currentMap === 'orbitalDiningHall' || state.currentMap === 'orbitalVacuumEscape') {
            ctx.fillStyle = '#add8e6'; // Light Blue glass walls
          }
        } else {
          if (state.currentMap === 'fathersShip') ctx.fillStyle = '#2c3e50';
          else if (state.currentMap === 'minneapolisAlley') ctx.fillStyle = '#a0a0a0';
          else if (state.currentMap === 'phoenixApartment') ctx.fillStyle = '#8b4513'; // Wooden floor
          else if (state.currentMap === 'ryanGarage') ctx.fillStyle = '#444'; // Concrete floor
          else if (state.currentMap === 'citySound') ctx.fillStyle = '#2a2a2a'; // Dingy floor
          else if (state.currentMap === 'minneapolisOverworld') ctx.fillStyle = '#333'; // Asphalt roads
          else if (state.currentMap === 'palmersBar') ctx.fillStyle = '#4a2a1a'; // Wood floor
          else if (state.currentMap === 'palmersBarRubble') ctx.fillStyle = '#000033'; // Night sky floor
          else if (state.currentMap === 'spaceOverworld') {
            if (tile === 2) ctx.fillStyle = '#4b0082'; // Nebula Purple
            else ctx.fillStyle = '#000'; // Deep space
          }
          else if (state.currentMap === 'sector4Trench') ctx.fillStyle = '#3d2b1f'; // Muddy floor
          else if (state.currentMap === 'undergroundBarn' || state.currentMap === 'undergroundBarnRaid') ctx.fillStyle = '#555'; // Metallic floor
          else if (state.currentMap === 'vanCamp') {
            if (tile === 3) ctx.fillStyle = '#222'; // Van interior floor
            else ctx.fillStyle = '#444'; // Moon surface
          }
          else if (state.currentMap === 'libraryInterior') {
            if (tile === 3) ctx.fillStyle = '#5d4037'; // Reading Area stage
            else ctx.fillStyle = '#8b4513'; // Dusty wood floor
          }
          else if (state.currentMap === 'libraryStacks') {
            ctx.fillStyle = '#8b4513'; // Dusty wood floor
          }
          else if (state.currentMap === 'orbitalMansionExterior') {
            ctx.fillStyle = '#000033'; // Deep space floor
          }
          else if (state.currentMap === 'orbitalMansionGala') {
            ctx.fillStyle = '#ffffff'; // Pure White floor
          }
          else if (state.currentMap === 'orbitalGreenRoom' || state.currentMap === 'orbitalDiningHall') {
            ctx.fillStyle = '#ffffff'; // Pure White floor
          }
          else if (state.currentMap === 'orbitalVacuumEscape') {
            ctx.fillStyle = '#222222'; // Dark Gray floor
          }
        }
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        
        // Add subtle floor texture/lines
        if (tile === TILE_TYPES.FLOOR) {
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      });
    });

    // 3. Draw Entities
    activeEntities.forEach(entity => {
      let entityColor = entity.color;
      
      // Turtleneck Disguise Override
      if (state.isDisguised) {
        const partyNames = ['Lucky', 'Phoenix', 'Diego', 'Bajonka', 'Sticky'];
        if (partyNames.includes(entity.name)) {
          entityColor = '#1a1a1a'; // Dark Gray/Black turtleneck
        }
      }

      ctx.fillStyle = entityColor;
      ctx.fillRect(
        entity.position.x * gridSize + 2, 
        entity.position.y * gridSize + 2, 
        gridSize - 4, 
        gridSize - 4
      );
      
      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '8px monospace';
      ctx.fillText(entity.name.toUpperCase(), entity.position.x * gridSize, entity.position.y * gridSize - 4);
    });

    // 4. Draw Player (Lucky / Van)
    if (state.currentMap === 'minneapolisOverworld' || state.currentMap === 'spaceOverworld') {
      // Draw the Van
      ctx.fillStyle = '#00008b'; // Dark Blue for the van
      ctx.fillRect(
        player.position.x + 2, 
        player.position.y + 6, 
        gridSize - 4, 
        gridSize - 12
      );
      // Van Windows
      ctx.fillStyle = '#add8e6';
      ctx.fillRect(player.position.x + gridSize - 10, player.position.y + 8, 4, 8);
    } else {
      // Draw Lucky's Glow
      const glowColor = state.stressLevel > 0 ? '#8b008b' : '#ff69b4'; // Magenta vs Hot Pink
      ctx.shadowBlur = state.stressLevel > 0 ? 10 + Math.sin(Date.now() / 100) * 5 : 8;
      ctx.shadowColor = glowColor;
      
      // Draw Lucky
      ctx.fillStyle = state.isDisguised ? '#1a1a1a' : '#00ff00'; // Turtleneck override
      ctx.fillRect(
        player.position.x + 4, 
        player.position.y + 4, 
        gridSize - 8, 
        gridSize - 8
      );
      
      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw a small "eye" or indicator for direction
      ctx.fillStyle = '#000';
      let eyeX = player.position.x + gridSize / 2 - 2;
      let eyeY = player.position.y + gridSize / 2 - 2;

      if (player.direction === 'up') eyeY -= 8;
      if (player.direction === 'down') eyeY += 8;
      if (player.direction === 'left') eyeX -= 8;
      if (player.direction === 'right') eyeX += 8;

      ctx.fillRect(eyeX, eyeY, 4, 4);
    }
  };

  // Register the game loop
  useGameLoop(onUpdate, onRender);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-2 sm:p-4">
      <div className="relative border-4 border-gray-800 shadow-2xl overflow-hidden bg-gray-900 w-full max-w-[640px] aspect-[4/3]">
        {/* The Game Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full image-pixelated"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlay UI (React-based) */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 pointer-events-none">
          <div className="bg-black/70 border-2 border-green-500 p-1 sm:p-2 font-mono text-green-500 text-[10px] sm:text-xs uppercase tracking-widest">
            Lucky [Prophet]
            <div className="mt-1 h-1 w-16 sm:w-24 bg-gray-800">
              <div className="h-full bg-green-500 w-full" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 pointer-events-none hidden sm:block">
          <div className="bg-black/70 border-2 border-gray-500 p-2 font-mono text-gray-400 text-[10px] uppercase">
            WASD to Move | E to Interact | Grid: {gridSize}px
          </div>
        </div>

        {/* Dialogue Overlay */}
        <AnimatePresence>
          {activeDialogue && (
            <DialogueBox 
              key={activeEntityId || 'dialogue'}
              ref={dialogueRef}
              messages={activeDialogue} 
              onComplete={handleDialogueComplete} 
            />
          )}
        </AnimatePresence>

        {/* Battle Screen Overlay */}
        <AnimatePresence>
          {state.inBattle && <BattleScreen />}
        </AnimatePresence>

        {/* Menu Overlay */}
        <AnimatePresence>
          {state.isMenuOpen && <MenuOverlay />}
        </AnimatePresence>

        {/* Quest HUD */}
        <QuestHUD />
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 sm:hidden">
        <VirtualDPad onDirectionChange={handleVirtualKey} />
      </div>
      
      <h1 className="mt-4 sm:mt-8 font-mono text-lg sm:text-xl text-green-500 tracking-tighter uppercase animate-pulse text-center">
        Slime Monsters From Outer Space
      </h1>
    </div>
  );
}

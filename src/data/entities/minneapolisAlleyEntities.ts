/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const minneapolisAlleyEntities: GameEntity[] = [
  {
    id: 'phoenix',
    name: 'Phoenix',
    position: { x: 12, y: 7 },
    color: '#ff8800', // Orange
    isSolid: true,
    dialogue: [
      "My brain thinks you're going to have to pay the city for that pothole.",
      "I came here for college. The economy collapsed. Rent is too high.",
      "Now I'm permanently trapped in the Midwest.",
      "Wait... Are we made of the exact same cosmic slime?",
      "...",
      "You want to make the most obnoxious noise possible until the Empire gets a migraine?",
      "...Beats the day job."
    ]
  },
  {
    id: 'dumpster_1',
    name: 'Dumpster',
    position: { x: 2, y: 2 },
    color: '#1a4a1a', // Dark Green
    isSolid: true,
    dialogue: ["A heavy metal dumpster. It smells like old pizza and despair."]
  },
  {
    id: 'dumpster_2',
    name: 'Dumpster',
    position: { x: 2, y: 4 },
    color: '#1a4a1a',
    isSolid: true,
    dialogue: ["This one is overflowing with discarded corporate memos."]
  },
  {
    id: 'crater',
    name: 'The Crater',
    position: { x: 5, y: 8 },
    color: '#ff00ff', // Glowing Neon Pink/Green (using pink for now)
    isSolid: false,
    dialogue: ["A glowing, sludgy pothole. The impact knocked over a row of dumpsters."]
  },
  {
    id: 'vanguard_alley_1',
    name: 'Vanguard Agent',
    position: { x: 10, y: 3 },
    color: '#ff0000', // Red
    isSolid: true,
    dialogue: ["Halt! Unlicensed noise detected."]
  },
  {
    id: 'loot_vanguard_1',
    name: 'Dropped Loot',
    position: { x: 10, y: 3 },
    color: '#ffd700', // Gold
    isSolid: false,
    dialogue: [
      "Acquired: Confiscated DIY PCB.",
      "The traces look intact. This could be useful for modding the Roland JC-40."
    ]
  },
  {
    id: 'apartment_door',
    name: 'Apartment Door',
    position: { x: 14, y: 1 },
    color: '#4a3a2a', // Brown
    isSolid: true,
    dialogue: ["Phoenix's apartment. The door is slightly ajar."]
  }
];

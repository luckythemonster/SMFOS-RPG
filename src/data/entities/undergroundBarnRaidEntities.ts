/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const undergroundBarnRaidEntities: GameEntity[] = [
  {
    id: 'vanguard_raid_squad',
    name: 'Vanguard Raid Squad',
    position: { x: 10, y: 14 },
    color: '#f5f5dc', // Beige
    isSolid: true,
    dialogue: ["The main exit is blocked! Use the back exit!"]
  },
  {
    id: 'phoenix_raid',
    name: 'Phoenix',
    position: { x: 7, y: 7 },
    color: '#ff8800', // Orange
    isSolid: true,
    dialogue: ["My brain thinks we missed a time signature change."]
  },
  {
    id: 'warner_raid',
    name: 'Warner',
    position: { x: 9, y: 7 },
    color: '#0000ff', // Blue
    isSolid: true,
    dialogue: ["[Warner casually tosses a drumstick in the air, unfazed.]"]
  },
  {
    id: 'diego_raid',
    name: 'Diego',
    position: { x: 11, y: 7 },
    color: '#ffcccb', // Light Red
    isSolid: true,
    dialogue: ["Whoa. Bad vibes. No visa."]
  },
  {
    id: 'back_exit_door',
    name: 'Back Exit Door',
    position: { x: 1, y: 7 },
    color: '#4a3a2a', // Brown
    isSolid: true,
    dialogue: ["Time to get to the van!"]
  }
];

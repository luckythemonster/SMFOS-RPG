/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const minneapolisOverworldEntities: GameEntity[] = [
  {
    id: 'city_sound_node',
    name: 'City Sound Studio',
    position: { x: 5, y: 4 },
    color: '#4b0082', // Dark Purple
    isSolid: true,
    dialogue: ["The dingy rehearsal space."]
  },
  {
    id: 'palmers_bar_node',
    name: 'Palmer\'s Bar',
    position: { x: 13, y: 10 },
    color: '#ff0000', // Neon Red
    isSolid: true,
    dialogue: [
      "The legendary West Bank dive bar.",
      "Load-in is at the back alley."
    ]
  }
];

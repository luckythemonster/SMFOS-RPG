/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const palmersBarRubbleEntities: GameEntity[] = [
  {
    id: 'phoenix_rubble',
    name: 'Phoenix',
    position: { x: 7, y: 7 },
    color: '#ff8800', // Orange
    isSolid: true,
    dialogue: ["My brain thinks we are officially domestic terrorists."]
  },
  {
    id: 'ryan_rubble',
    name: 'Ryan',
    position: { x: 10, y: 7 },
    color: '#00ff00', // Green
    isSolid: true,
    dialogue: ["I think I broke the space-time continuum on that snare fill."]
  },
  {
    id: 'bajonka_rubble',
    name: 'Bajonka',
    position: { x: 12, y: 7 },
    color: '#d4af37', // Brown
    isSolid: true,
    dialogue: [
      "Bajonka trots out from under the drywall, completely unfazed.",
      "She drops the van keys and a tour itinerary on the ground."
    ]
  },
  {
    id: 'van_keys',
    name: 'Van Keys & Itinerary',
    position: { x: 12, y: 8 },
    color: '#ffd700', // Gold
    isSolid: false,
    dialogue: ["Acquired: Van Keys. POTATO BELT: TOMORROW is circled in red."]
  }
];

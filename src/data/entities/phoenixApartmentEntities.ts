/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const phoenixApartmentEntities: GameEntity[] = [
  {
    id: 'phoenix',
    name: 'Phoenix',
    position: { x: 3, y: 3 },
    color: '#ff8c00', // Dark Orange
    isSolid: true,
    dialogue: ["We need a drummer. I could put a flyer up at the coffee shop..."]
  },
  {
    id: 'bass_amp',
    name: 'Beat-up Bass Amp',
    position: { x: 7, y: 2 },
    color: '#333333', // Dark Gray
    isSolid: true,
    dialogue: [
      "Lucky channels pure, raw slime energy into the input jack.",
      "A neon soundwave erupts from the speaker!"
    ]
  }
];

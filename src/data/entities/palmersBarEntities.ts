/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const palmersBarEntities: GameEntity[] = [
  {
    id: 'undercover_cop',
    name: 'Undercover Cop',
    position: { x: 5, y: 10 },
    color: '#add8e6', // Light Blue
    isSolid: true,
    dialogue: [
      "Dispatch, I have located the unauthorized slime gathering. Stand by.",
      "Wait, is my mohawk peeling?"
    ]
  },
  {
    id: 'phoenix_palmers',
    name: 'Phoenix',
    position: { x: 9, y: 3 },
    color: '#ff8800', // Orange
    isSolid: true,
    dialogue: ["My brain is vibrating at a frequency that suggests we are about to commit a felony."]
  },
  {
    id: 'ryan_palmers',
    name: 'Ryan',
    position: { x: 11, y: 3 },
    color: '#00ff00', // Green (bubbling)
    isSolid: true,
    dialogue: ["[No obnoxious guitar solos. Just pure rhythm. I can work with this.]"]
  },
  {
    id: 'stage_mic',
    name: 'Stage Mic',
    position: { x: 10, y: 4 },
    color: '#808080', // Gray
    isSolid: true,
    dialogue: [
      "Lucky looks back at Ryan, then over to Phoenix. They nod.",
      "Lucky and Phoenix hit the first massive power chord!"
    ]
  }
];

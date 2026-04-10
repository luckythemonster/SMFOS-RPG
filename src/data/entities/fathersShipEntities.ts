/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Position } from '../../types/game';

export interface GameEntity {
  id: string;
  name: string;
  position: Position;
  color: string;
  isSolid: boolean;
  dialogue: string[];
}

export const fathersShipEntities: GameEntity[] = [
  {
    id: 'intercom',
    name: 'Intercom Speaker (Dad)',
    position: { x: 10, y: 1 },
    color: '#aa0000', // Dark Red
    isSolid: true,
    dialogue: [
      "FATHER (Intercom): I just don't understand the whole non-binary thing.",
      "Why can't you pick a tangible demographic to market yourself to?",
      "If you'd just join The Vanguard, you could be financially successful and oppress people with a dental plan!"
    ]
  },
  {
    id: 'console',
    name: 'Escape Pod Console',
    position: { x: 5, y: 5 },
    color: '#00ffff', // Cyan
    isSolid: true,
    dialogue: [] // Handled dynamically in GameCanvas
  },
  {
    id: 'window',
    name: 'Viewing Window',
    position: { x: 10, y: 14 },
    color: '#88ccff', // Light Blue
    isSolid: true,
    dialogue: [
      "Planet California looms below. A hyper-commercialized nightmare world.",
      "Lucky: I'm getting out of here. For good."
    ]
  },
  {
    id: 'bajonka',
    name: 'Bajonka (Dog)',
    position: { x: 15, y: 10 },
    color: '#d4af37', // Gold/Brown
    isSolid: true,
    dialogue: [
      "...",
      "Bajonka just stares quietly at the sterile metal wall.",
      "She lets out a soft cry.",
      "She looks more than ready to leave this corporate tin can."
    ]
  }
];

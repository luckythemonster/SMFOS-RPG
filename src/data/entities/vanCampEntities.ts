/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export function getVanCampEntities(storyChapter: number): GameEntity[] {
  const entities: GameEntity[] = [
    {
      id: 'phoenix_camp',
      name: 'Phoenix',
      position: { x: 8, y: 12 },
      color: '#ff8800', // Orange
      isSolid: true,
      dialogue: [
        "My brain thinks this radioactive starch is the only thing keeping my molecular structure from collapsing.",
        "We're really doing this, aren't we? The 'terrorist' thing?"
      ]
    },
    {
      id: 'diego_camp',
      name: 'Diego',
      position: { x: 12, y: 12 },
      color: '#ffcccb', // Light Red
      isSolid: true,
      dialogue: [
        "The stars are even heavier out here. But these taters... they're glowing with hope, man."
      ]
    },
    {
      id: 'bajonka_camp',
      name: 'Bajonka',
      position: { x: 5, y: 11 },
      color: '#d4af37', // Gold/Brown
      isSolid: true,
      dialogue: ["Bajonka is watching the horizon. She seems remarkably calm for someone on a Vanguard most-wanted list."]
    },
    {
      id: 'space_stove',
      name: 'Portable Space-Stove',
      position: { x: 10, y: 12 },
      color: '#ff0000', // Red
      isSolid: true,
      dialogue: [] // Handled in GameCanvas
    },
    {
      id: 'pilot_seat',
      name: 'Van Pilot Seat',
      position: { x: 10, y: 6 },
      color: '#4444ff', // Brighter Blue
      isSolid: true,
      dialogue: ["Time to hit the road again."]
    }
  ];

  if (storyChapter === 1 || storyChapter === 2) {
    entities.push({
      id: 'warner_camp',
      name: 'Warner',
      position: { x: 6, y: 13 },
      color: '#0000ff', // Blue
      isSolid: true,
      dialogue: ["I'm just here for the ride. And the potatoes."]
    });
  }

  if (storyChapter >= 3) {
    entities.push({
      id: 'sticky_camp',
      name: 'Sticky',
      position: { x: 10, y: 13 },
      color: '#00ffff', // Cyan
      isSolid: true,
      dialogue: [
        "01001000 01001001. I mean, HELLO.",
        "My internal metronome is currently set to 13/8. I hope you like polyrhythms."
      ]
    });
  }

  return entities;
}

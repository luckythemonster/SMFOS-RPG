/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export function getSpaceEntities(storyChapter: number): GameEntity[] {
  const entities: GameEntity[] = [
    {
      id: 'potato_belt_entry',
      name: 'Potato Belt Entry Point',
      position: { x: 10, y: 7 },
      color: '#ffff00', // Sickly Yellow
      isSolid: true,
      dialogue: ["Entering Sector 4..."]
    },
    {
      id: 'van_camp_entry',
      name: 'The Van Camp',
      position: { x: 5, y: 5 },
      color: '#00008b', // Dark Blue
      isSolid: true,
      dialogue: ["Heading back to the camp to regroup."]
    }
  ];

  if (storyChapter >= 2) {
    entities.push({
      id: 'library_entry',
      name: 'Earth-Remnant Library',
      position: { x: 15, y: 10 },
      color: '#8b4513', // Brown
      isSolid: true,
      dialogue: ["The Earth-Remnant Library. A massive, floating archive of dusty paper and silence."]
    });
  }

  if (storyChapter >= 3) {
    entities.push({
      id: 'orbital_mansion_entry',
      name: 'Orbital Mansion (Gala)',
      position: { x: 18, y: 3 },
      color: '#c0c0c0', // Silver
      isSolid: true,
      dialogue: ["The billionaire's orbital estate. It looks like a diamond floating in a void of indifference."]
    });
  }

  return entities;
}

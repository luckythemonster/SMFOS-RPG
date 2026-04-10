/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const undergroundBarnEntities: GameEntity[] = [
  {
    id: 'phoenix_barn',
    name: 'Phoenix',
    position: { x: 7, y: 3 },
    color: '#ff8800', // Orange
    isSolid: true,
    dialogue: [
      "My brain thinks I'm 40% water at this point.",
      "Let's play fast so we can get back to the van."
    ]
  },
  {
    id: 'diego_barn',
    name: 'Diego',
    position: { x: 9, y: 3 },
    color: '#ffcccb', // Light Red
    isSolid: true,
    dialogue: [
      "Man, I don't have a visa! If they scan me, I'm heading to a labor moon.",
      "Just stay calm. Send them positive vibrations... no, Lucky, don't look at me like that."
    ]
  },
  {
    id: 'warner_barn',
    name: 'Warner',
    position: { x: 12, y: 3 },
    color: '#0000ff', // Blue
    isSolid: true,
    dialogue: ["Crowd looks mean. I like it."]
  },
  {
    id: 'vanguard_narc_1',
    name: 'Vanguard Agent',
    position: { x: 5, y: 8 },
    color: '#f5f5dc', // Beige/Tan
    isSolid: true,
    dialogue: ["(Into collar) Dispatch, target identified. Standing by for the breach."]
  },
  {
    id: 'vanguard_narc_2',
    name: 'Vanguard Agent',
    position: { x: 14, y: 8 },
    color: '#f5f5dc', // Beige/Tan
    isSolid: true,
    dialogue: ["I think someone just stepped on my clipboard."]
  },
  {
    id: 'terrified_worker',
    name: 'Terrified Worker',
    position: { x: 10, y: 10 },
    color: '#808080', // Gray/Dark Green (using gray as per prompt)
    isSolid: true,
    dialogue: ["I've been threshing cosmic potatoes for 18 hours. I am going to bite someone."]
  },
  {
    id: 'barn_mic',
    name: 'Stage Mic',
    position: { x: 10, y: 4 },
    color: '#808080', // Gray
    isSolid: true,
    dialogue: [
      "We are the Slime Monsters From Outer Space!",
      "This one's called MONSTERS!"
    ]
  }
];

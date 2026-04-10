/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

export const sector4TrenchEntities: GameEntity[] = [
  {
    id: 'diego',
    name: 'Diego',
    position: { x: 5, y: 7 },
    color: '#ffcccb', // Light Red
    isSolid: true,
    dialogue: [
      "Man, the stars out here are heavy. Really makes you feel small.",
      "Wait... is that a Vanguard drone? I don't have a visa, man!"
    ]
  },
  {
    id: 'warner',
    name: 'Warner',
    position: { x: 7, y: 7 },
    color: '#0000ff', // Blue
    isSolid: true,
    dialogue: [
      "Wow. Real dystopian vibe.",
      "I'm ready to play. Let's load in."
    ]
  },
  {
    id: 'phoenix_sector4',
    name: 'Phoenix',
    position: { x: 9, y: 7 },
    color: '#ff8800', // Orange
    isSolid: true,
    dialogue: [
      "My brain thinks I am going to become a puddle. Put me in a Tupperware container.",
      "The humidity is hitting me like a physical wall."
    ]
  },
  {
    id: 'barn_entrance',
    name: 'Barn Entrance',
    position: { x: 10, y: 4 },
    color: '#ff0000', // Glowing Red
    isSolid: true,
    dialogue: ["The Stress Test awaits."]
  },
  {
    id: 'sketchy_promoter',
    name: 'Sketchy Promoter',
    position: { x: 14, y: 12 },
    color: '#4b0082', // Dark Purple
    isSolid: true,
    dialogue: [
      "There is no door money. The gig was a stress test. And you passed.",
      "I represent the Eclipse of Liberation. The Vanguard fears you.",
      "Sign section 4A to join the Vanguard Resistance Committee, and we can schedule your orientation."
    ]
  },
  {
    id: 'potato_sack',
    name: 'Burlap Sack of Potatoes',
    position: { x: 15, y: 12 },
    color: '#daa520', // Gold/Brown
    isSolid: true,
    dialogue: [
      "VANGUARD PROPERTY: RAW COSMIC POTATOES.",
      "Lucky: 'I'm taking these as payment!'"
    ]
  },
  {
    id: 'space_van',
    name: 'Space-Van',
    position: { x: 14, y: 13 },
    color: '#00008b', // Dark Blue
    isSolid: true,
    dialogue: ["The van's thrusters are still warm.", "Return to space?"]
  }
];

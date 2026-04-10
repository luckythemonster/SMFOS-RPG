import { GameEntity } from './fathersShipEntities';

export const orbitalGreenRoomEntities: GameEntity[] = [
  {
    id: 'denim_boys',
    name: 'The Denim Boys',
    position: { x: 2, y: 2 },
    color: '#0000ff', // Blue
    isSolid: true,
    dialogue: [
      "The three members of the corporate ambient trio are stacked neatly like cordwood.",
      "They have been expertly bound and gagged using nothing but their own Canadian tuxedo denim jackets."
    ]
  },
  {
    id: 'diego_green_room',
    name: 'Diego',
    position: { x: 4, y: 5 },
    color: '#1a1a1a', // Dark Gray (Turtleneck)
    isSolid: true,
    dialogue: ["Bajonka... how did you tie those knots without thumbs?"]
  },
  {
    id: 'bajonka_green_room',
    name: 'Bajonka',
    position: { x: 5, y: 5 },
    color: '#1a1a1a', // Dark Gray (Turtleneck)
    isSolid: true,
    dialogue: ["Bajonka gives a single, professional bark."]
  },
  {
    id: 'lucky_green_room',
    name: 'Lucky',
    position: { x: 6, y: 5 },
    color: '#1a1a1a', // Dark Gray (Turtleneck)
    isSolid: true,
    dialogue: ["Don't ask questions. Let's get the gear inside before the billionaires get hungry."]
  },
  {
    id: 'stage_access_door',
    name: 'Stage Access Door',
    position: { x: 7, y: 1 },
    color: '#808080', // Gray
    isSolid: true,
    dialogue: ["The door to the main stage. It's time for the load-in."]
  }
];

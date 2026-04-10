import { GameEntity } from './fathersShipEntities';

export const orbitalDiningHallEntities: GameEntity[] = [
  {
    id: 'jeffrey_laserstein',
    name: 'Jeffrey Laserstein',
    position: { x: 10, y: 5 },
    color: '#ffffff', // White square
    dialogue: ["I present to you... the ultimate disruptive protein. A high-ranking officer of the Eclipse of Liberation, marinated in her own defiance."],
    isSolid: true
  },
  {
    id: 'shannon_crackers',
    name: 'Shannon Crackers',
    position: { x: 10, y: 4 },
    color: '#ff0000', // Red square
    dialogue: ["You talk like a guy who pays a million credits a year to have someone else chew his food. Just turn the lasers on, Jeff."],
    isSolid: true
  },
  {
    id: 'cosmic_truffle',
    name: 'Cosmic Truffle',
    position: { x: 12, y: 5 },
    color: '#800080', // Purple square
    dialogue: ["I demand to contact the ambassador! I am an organism of culture! You cannot shave me over this colonial ruffian!"],
    isSolid: true
  },
  {
    id: 'heavy_curtains',
    name: 'The Heavy Curtains',
    position: { x: 10, y: 10 },
    color: '#d3d3d3', // Light Gray
    dialogue: [
      "Lucky: 'Hey, Professor Crackers. We're here for the rescue. How did you like our tech-bro infiltration?'",
      "Shannon: 'It was terrible! Your projection was incredibly weak, your posture screamed imposter, and your underlying motivation was entirely unconvincing!'",
      "Lucky: 'I was wearing the glasses! I said synergy!'",
      "Shannon: 'Wardrobe doesn't replace the inner truth of the character, Lucky. Now please shoot something, I am getting warm.'",
      "Lucky: 'Fine. Let's do some inner truth. 1, 2, 3, 4!'"
    ],
    isSolid: true
  }
];

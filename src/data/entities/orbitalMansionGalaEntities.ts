import { GameEntity } from './fathersShipEntities';

export const orbitalMansionGalaEntities: GameEntity[] = [
  {
    id: 'jeffrey_laserstein',
    name: 'Jeffrey Laserstein',
    position: { x: 10, y: 3 },
    color: '#ffffff', // White
    isSolid: true,
    dialogue: [
      "For centuries, the culinary world has been limited by traditional biology. But tonight, we transcend.",
      "What if our protein was... disruptive?"
    ]
  },
  {
    id: 'vanguard_tech_bro',
    name: 'Vanguard Tech-Bro',
    position: { x: 5, y: 8 },
    color: '#333333', // Dark Gray
    isSolid: true,
    dialogue: [
      "Great networking synergy tonight. What's your primary vertical?",
      "Diego: 'It's all about cosmic potato empathy, man. They internalize the propaganda that rice is the superior side dish.'",
      "Tech-Bro: 'Emotional starch? That is incredible ROI! How do I buy in?!'",
      "Lucky drags Diego away by the collar."
    ]
  },
  {
    id: 'green_room_door',
    name: 'Green Room Door',
    position: { x: 18, y: 8 },
    color: '#c0c0c0', // Silver
    isSolid: true,
    dialogue: [
      "Lucky presses their head against the door. You hear awful, perfectly harmonized vocal warmups.",
      "'Mi-mi-mi, synergy and growth...'",
      "Lucky: 'It's them. The Denim Boys from Wisconsin. I hate these guys.'",
      "Bajonka pushes the door open with her nose and slips inside.",
      "SFX: R-R-R-RIP! 'Ope! Just gonna squeeze right past ya--augh!'"
    ]
  }
];

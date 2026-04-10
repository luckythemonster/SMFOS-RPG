import { GameEntity } from './fathersShipEntities';

export const getLibraryInteriorEntities = (alibiRejection: boolean): GameEntity[] => {
  const entities: GameEntity[] = [
    {
      id: 'stage_mic_library',
      name: 'Stage Mic',
      position: { x: 10, y: 3 },
      color: '#ffff00', // Yellow
      isSolid: true,
      dialogue: [
      "A dusty microphone on a wooden stage.", 
      "The crowd is waiting... or at least, they're staring.",
      "The Merch Table is set up in the Stacks to the right."
    ]
    },
    {
      id: 'to_stacks',
      name: 'To The Stacks (Merch)',
      position: { x: 17, y: 7 },
      color: '#d4af37', // Gold - Much more visible
      isSolid: true,
      dialogue: ["The 'Young Adult' section is this way. The Merch Table (and the potatoes) are set up in the stacks."]
    },
    {
      id: 'exit_library',
      name: 'Exit to Space',
      position: { x: 10, y: 14 },
      color: '#00008b', // Dark Blue (Van color)
      isSolid: true,
      dialogue: ["Time to get back to the van."]
    }
  ];

  if (!alibiRejection) {
    entities.push({
      id: 'steven_alibi',
      name: 'Steven Alibi',
      position: { x: 5, y: 8 },
      color: '#808080', // Dull Gray
      isSolid: true,
      dialogue: [
        "Your guitarist relies entirely too much on fuzz to cover his sloppy phrasing.",
        "Music is math and pressure. Everything else is just a tantrum."
      ]
    });
  } else {
    entities.push(
      {
        id: 'sketchy_promoter_library',
        name: 'Sketchy Promoter',
        position: { x: 9, y: 8 },
        color: '#4b0082', // Dark Purple
        isSolid: true,
        dialogue: [
          "Creative labor is vastly undervalued.",
          "A syndicate of billionaires is hosting an orbital gala. The main course is a high-ranking human Eclipse officer.",
          "They are going to cook him.",
          "Lucky: 'I'm a musician, not a mercenary—'",
          "Phoenix stares at the 800 credits for rent.",
          "Lucky: 'Fine. Where's the mansion?'"
        ]
      },
      {
        id: 'briefcase',
        name: 'Briefcase',
        position: { x: 10, y: 8 },
        color: '#d4af37', // Gold
        isSolid: true,
        dialogue: ["A heavy gold briefcase. It smells like fresh credits and corporate desperation."]
      }
    );
  }

  return entities;
};

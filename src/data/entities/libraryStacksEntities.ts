import { GameEntity } from './fathersShipEntities';

export const getLibraryStacksEntities = (merchFlipped: boolean): GameEntity[] => {
  const entities: GameEntity[] = [
    {
      id: 'potato_table',
      name: 'Potato Table',
      position: { x: 10, y: 7 },
      color: '#cd853f', // Peru (Lighter brown than the floor)
      isSolid: true,
      dialogue: merchFlipped 
        ? ["The table is overturned. Sharpie-inked potatoes are everywhere."]
        : [
            "Diego: 'You have potassium! You have value!'", 
            "Diego throws his hands up in exasperation—WHACK!"
          ]
    },
    {
      id: 'back_to_library_interior',
      name: 'Back to Reading Area',
      position: { x: 2, y: 7 },
      color: '#d4af37', // Gold - Visible
      isSolid: true,
      dialogue: ["Heading back to the main reading area."]
    }
  ];

  if (merchFlipped) {
    entities.push(
      {
        id: 'scattered_potatoes',
        name: 'Scattered Potatoes',
        position: { x: 11, y: 9 },
        color: '#d4af37', // Gold/Brown
        isSolid: false,
        dialogue: [
          "Dozens of Sharpie-drawn cosmic potatoes are scattered across the floor.",
          "One rolls gently into a heavy black boot."
        ]
      },
      {
        id: 'steven_alibi_stacks',
        name: 'Steven Alibi',
        position: { x: 12, y: 9 },
        color: '#808080', // Dull Gray
        isSolid: true,
        dialogue: [
          "You bring stolen waste into a venue. You draw on it with markers.",
          "This is a joke. Get this garbage out of my way before I start my set."
        ]
      }
    );
  }

  return entities;
};

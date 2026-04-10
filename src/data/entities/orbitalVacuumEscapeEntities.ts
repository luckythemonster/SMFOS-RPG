import { GameEntity } from './fathersShipEntities';

export const orbitalVacuumEscapeEntities: GameEntity[] = [
  {
    id: 'space_van_getaway',
    name: 'Space-Van',
    position: { x: 10, y: 1 }, // Far end of the map
    color: '#00008b', // Blue square
    isSolid: true,
    dialogue: [
      "The band dives into the rusted van as the airlock slams shut behind them.",
      "Phoenix slams the thrusters!",
      "We survived!"
    ]
  }
];

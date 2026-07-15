import { createContext } from 'react';

export type States = 'BACKSTAGE' | 'YMCA_GALA' | 'RAFTER_DASH' | 'COMBAT_SCREEN' | 'AIRSHIP_HEIST_OUTRO';

export const GameStates: Record<States, States> = {
  BACKSTAGE: 'BACKSTAGE',
  YMCA_GALA: 'YMCA_GALA',
  RAFTER_DASH: 'RAFTER_DASH',
  COMBAT_SCREEN: 'COMBAT_SCREEN',
  AIRSHIP_HEIST_OUTRO: 'AIRSHIP_HEIST_OUTRO'
} as const;

interface WastelandContextType {
  currentState: States;
  transitionTo: (newState: States) => void;
}

export const WastelandContext = createContext<WastelandContextType | undefined>(undefined);

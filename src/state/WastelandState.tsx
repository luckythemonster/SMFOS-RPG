import { createContext } from 'react';

export const States = {
  BACKSTAGE: 'BACKSTAGE',
  YMCA_GALA: 'YMCA_GALA',
  RAFTER_DASH: 'RAFTER_DASH',
  COMBAT_SCREEN: 'COMBAT_SCREEN',
  AIRSHIP_HEIST_OUTRO: 'AIRSHIP_HEIST_OUTRO'
} as const;

export type State = typeof States[keyof typeof States];

interface WastelandContextType {
  currentState: State;
  transitionTo: (newState: State) => void;
}

export const WastelandContext = createContext<WastelandContextType | undefined>(undefined);

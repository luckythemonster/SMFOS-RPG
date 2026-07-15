import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { GameStates, WastelandContext, type States } from './WastelandState';

export const WastelandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentState, setCurrentState] = useState<States>(GameStates.BACKSTAGE);

  const transitionTo = (newState: States) => {
    setCurrentState(newState);
  };

  return (
    <WastelandContext.Provider value={{ currentState, transitionTo }}>
      {children}
    </WastelandContext.Provider>
  );
};

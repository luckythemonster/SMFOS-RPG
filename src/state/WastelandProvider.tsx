import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { States, WastelandContext, type State } from './WastelandState';

export const WastelandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentState, setCurrentState] = useState<State>(States.BACKSTAGE);

  const transitionTo = (newState: State) => {
    setCurrentState(newState);
  };

  return (
    <WastelandContext.Provider value={{ currentState, transitionTo }}>
      {children}
    </WastelandContext.Provider>
  );
};

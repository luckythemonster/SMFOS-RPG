import React from 'react';
import { States } from '../state/WastelandState';
import { useWastelandState } from '../state/useWastelandState';

export const CombatScreen: React.FC = () => {
  const { transitionTo } = useWastelandState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-wasteland-charcoal border-8 border-radioactive-purple p-8">
      <h1 className="text-4xl font-bold text-radioactive-purple mb-8">COMBAT SCREEN</h1>
      <p className="text-white mb-8 text-center max-w-md">
        The stage boss (Corporate Riot Mechs) is defeated.
      </p>
      <button
        className="btn-arcade-cyan"
        onClick={() => transitionTo(States.AIRSHIP_HEIST_OUTRO)}
      >
        Next Stage
      </button>
    </div>
  );
};

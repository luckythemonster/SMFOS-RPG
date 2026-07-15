import React from 'react';
import { States } from '../state/WastelandState';
import { useWastelandState } from '../state/useWastelandState';

export const RafterDash: React.FC = () => {
  const { transitionTo } = useWastelandState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-wasteland-charcoal border-8 border-warning-yellow p-8">
      <h1 className="text-4xl font-bold text-warning-yellow mb-8">RAFTER DASH</h1>
      <p className="text-white mb-8 text-center max-w-md">
        Timer hits zero or characters successfully reach the end of the rafters lane.
      </p>
      <button
        className="btn-arcade-yellow"
        onClick={() => transitionTo(States.COMBAT_SCREEN)}
      >
        Next Stage
      </button>
    </div>
  );
};

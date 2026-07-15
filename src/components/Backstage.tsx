import React from 'react';
import { States } from '../state/WastelandState';
import { useWastelandState } from '../state/useWastelandState';

export const Backstage: React.FC = () => {
  const { transitionTo } = useWastelandState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-wasteland-charcoal border-8 border-slime-green p-8">
      <h1 className="text-4xl font-bold text-slime-green mb-8">BACKSTAGE</h1>
      <p className="text-white mb-8 text-center max-w-md">
        Player interacts with the Dressing Room tile after grabbing Kwik Trip loot.
      </p>
      <button
        className="btn-arcade-green"
        onClick={() => transitionTo(States.YMCA_GALA)}
      >
        Next Stage
      </button>
    </div>
  );
};

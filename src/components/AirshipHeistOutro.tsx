import React from 'react';
import { States } from '../state/WastelandState';
import { useWastelandState } from '../state/useWastelandState';

export const AirshipHeistOutro: React.FC = () => {
  const { transitionTo } = useWastelandState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-wasteland-charcoal border-8 border-cyan-400 p-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">AIRSHIP HEIST OUTRO</h1>
      <p className="text-white mb-8 text-center max-w-md">
        Interactive panels conclude.
      </p>
      <button
        className="btn-arcade-green"
        onClick={() => transitionTo(States.BACKSTAGE)}
      >
        Restart (Backstage)
      </button>
    </div>
  );
};

import React from 'react';
import { States } from '../state/WastelandState';
import { useWastelandState } from '../state/useWastelandState';

export const YmcaGala: React.FC = () => {
  const { transitionTo } = useWastelandState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-wasteland-charcoal border-8 border-toxic-magenta p-8">
      <h1 className="text-4xl font-bold text-toxic-magenta mb-8">YMCA GALA</h1>
      <p className="text-white mb-8 text-center max-w-md">
        Player completes the rhythm meter to 100% (or triggers the "fail/fight" state).
      </p>
      <button
        className="btn-arcade-magenta"
        onClick={() => transitionTo(States.RAFTER_DASH)}
      >
        Next Stage
      </button>
    </div>
  );
};

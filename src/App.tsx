import React from 'react';
import { GameStates } from './state/WastelandState';
import { useWastelandState } from './state/useWastelandState';
import { WastelandProvider } from './state/WastelandProvider';
import { Backstage } from './components/Backstage';
import { YmcaGala } from './components/YmcaGala';
import { RafterDash } from './components/RafterDash';
import { CombatScreen } from './components/CombatScreen';
import { AirshipHeistOutro } from './components/AirshipHeistOutro';

const GameContainer: React.FC = () => {
  const { currentState } = useWastelandState();

  switch (currentState) {
    case GameStates.BACKSTAGE:
      return <Backstage />;
    case GameStates.YMCA_GALA:
      return <YmcaGala />;
    case GameStates.RAFTER_DASH:
      return <RafterDash />;
    case GameStates.COMBAT_SCREEN:
      return <CombatScreen />;
    case GameStates.AIRSHIP_HEIST_OUTRO:
      return <AirshipHeistOutro />;
    default:
      return <Backstage />;
  }
};

function App() {
  return (
    <WastelandProvider>
      <GameContainer />
    </WastelandProvider>
  );
}

export default App;

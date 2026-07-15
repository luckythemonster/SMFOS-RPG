import React from 'react';
import { States } from './state/WastelandState';
import { useWastelandState } from './state/useWastelandState';
import { WastelandProvider } from './state/WastelandProvider';
import { BackstageView } from './components/BackstageView';
import { YmcaGala } from './components/YmcaGala';
import { RafterDash } from './components/RafterDash';
import { CombatScreen } from './components/CombatScreen';
import { AirshipHeistOutro } from './components/AirshipHeistOutro';

const GameContainer: React.FC = () => {
  const { currentState } = useWastelandState();

  switch (currentState) {
    case States.BACKSTAGE:
      return <BackstageView />;
    case States.YMCA_GALA:
      return <YmcaGala />;
    case States.RAFTER_DASH:
      return <RafterDash />;
    case States.COMBAT_SCREEN:
      return <CombatScreen />;
    case States.AIRSHIP_HEIST_OUTRO:
      return <AirshipHeistOutro />;
    default:
      return <BackstageView />;
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

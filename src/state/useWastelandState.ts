import { useContext } from 'react';
import { WastelandContext } from './WastelandState';

export const useWastelandState = () => {
  const context = useContext(WastelandContext);
  if (!context) {
    throw new Error('useWastelandState must be used within a WastelandProvider');
  }
  return context;
};

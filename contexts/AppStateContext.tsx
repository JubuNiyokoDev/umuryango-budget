import React, { createContext, useContext, useState, useCallback } from 'react';

interface AppStateContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  budgetUpdated: () => void;
  dayUpdated: () => void;
  themeUpdated: () => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  const budgetUpdated = useCallback(() => {
    triggerRefresh();
    console.log('🔄 Budget mis à jour - Actualisation globale');
  }, [triggerRefresh]);
  
  const dayUpdated = useCallback(() => {
    triggerRefresh();
    console.log('🔄 Jour mis à jour - Actualisation globale');
  }, [triggerRefresh]);
  
  const themeUpdated = useCallback(() => {
    triggerRefresh();
    console.log('🔄 Thème mis à jour - Actualisation globale');
  }, [triggerRefresh]);
  
  return (
    <AppStateContext.Provider value={{
      refreshTrigger,
      triggerRefresh,
      budgetUpdated,
      dayUpdated,
      themeUpdated
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
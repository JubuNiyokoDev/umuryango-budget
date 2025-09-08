import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Meal } from '../types/budget';

interface ClipboardData {
  type: 'day' | 'meal';
  date: string;
  data: Meal[] | Meal;
  timestamp: number;
}

interface PlanningClipboardContextType {
  clipboardData: ClipboardData | null;
  copyDay: (date: string, meals: Meal[]) => void;
  copyMeal: (date: string, meal: Meal) => void;
  pasteData: () => ClipboardData | null;
  clearClipboard: () => void;
  hasCopiedData: () => boolean;
  getCopiedInfo: () => string | null;
}

const PlanningClipboardContext = createContext<PlanningClipboardContextType | undefined>(undefined);

export function PlanningClipboardProvider({ children }: { children: ReactNode }) {
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null);

  const copyDay = (date: string, meals: Meal[]) => {
    setClipboardData({
      type: 'day',
      date,
      data: meals,
      timestamp: Date.now()
    });
  };

  const copyMeal = (date: string, meal: Meal) => {
    setClipboardData({
      type: 'meal',
      date,
      data: meal,
      timestamp: Date.now()
    });
  };

  const pasteData = () => {
    return clipboardData;
  };

  const clearClipboard = () => {
    setClipboardData(null);
  };

  const hasCopiedData = () => {
    return clipboardData !== null;
  };

  const getCopiedInfo = () => {
    if (!clipboardData) return null;
    
    const date = new Date(clipboardData.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
    
    if (clipboardData.type === 'day') {
      const meals = clipboardData.data as Meal[];
      const totalItems = meals.reduce((sum, meal) => sum + meal.items.length, 0);
      return `${date} (${totalItems})`;
    } else {
      const meal = clipboardData.data as Meal;
      return `${date} (${meal.items.length})`;
    }
  };

  return (
    <PlanningClipboardContext.Provider value={{
      clipboardData,
      copyDay,
      copyMeal,
      pasteData,
      clearClipboard,
      hasCopiedData,
      getCopiedInfo
    }}>
      {children}
    </PlanningClipboardContext.Provider>
  );
}

export function usePlanningClipboard() {
  const context = useContext(PlanningClipboardContext);
  if (context === undefined) {
    throw new Error('usePlanningClipboard must be used within a PlanningClipboardProvider');
  }
  return context;
}
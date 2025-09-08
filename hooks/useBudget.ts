
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayBudget, MonthlyBudget, Meal, MealItem, BudgetHistory, Contributor, MonthSelection } from '../types/budget';

const STORAGE_KEY = '@budget_data';
const HISTORY_KEY = '@budget_history';

export const useBudget = () => {
  const [currentMonthBudget, setCurrentMonthBudget] = useState<MonthlyBudget | null>(null);
  const [budgetHistory, setBudgetHistory] = useState<BudgetHistory>({ monthlyBudgets: [] });
  const [selectedMonth, setSelectedMonth] = useState<MonthSelection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, []);

  // Charger le mois courant seulement si aucun mois n'est sélectionné et qu'on n'est pas en train de naviguer
  useEffect(() => {
    if (!loading && !selectedMonth) {
      // Attendre un peu pour voir si un composant va définir un mois spécifique
      const timer = setTimeout(() => {
        if (!selectedMonth) {
          const currentMonth = getCurrentMonth();
          console.log('No month selected after delay, setting to current:', currentMonth);
          setSelectedMonth(currentMonth);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, selectedMonth]);

  useEffect(() => {
    if (selectedMonth) {
      console.log('Selected month changed to:', selectedMonth);
      // Toujours charger le mois sélectionné
      loadMonthBudget(selectedMonth.month, selectedMonth.year);
    }
  }, [selectedMonth]);

  const getCurrentMonth = (): MonthSelection => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
      displayName: now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    };
  };

  const loadBudgetData = async () => {
    try {
      // Load history first
      const historyData = await AsyncStorage.getItem(HISTORY_KEY);
      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        setBudgetHistory(parsedHistory);
      }
      
      // Ne pas charger automatiquement le mois courant
      // Laisser les composants décider quel mois charger
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthBudget = async (month: number, year: number) => {
    try {
      const monthId = `${year}-${month + 1}`;
      const data = await AsyncStorage.getItem(`${STORAGE_KEY}_${monthId}`);
      
      if (data) {
        const parsedData = JSON.parse(data);
        setCurrentMonthBudget(parsedData);
        console.log(`Loaded month budget for ${monthId}:`, parsedData.days.length, 'days');
      } else {
        // Create new month budget
        const newBudget: MonthlyBudget = {
          id: monthId,
          month: new Date(year, month).toLocaleString('fr-FR', { month: 'long' }),
          year,
          monthNumber: month,
          totalBudget: 0,
          consumedBudget: 0,
          remainingBudget: 0,
          days: [],
          contributors: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentMonthBudget(newBudget);
        await saveMonthBudget(newBudget);
        console.log(`Created new month budget for ${monthId}`);
      }
    } catch (error) {
      console.error('Error loading month budget:', error);
    }
  };

  const saveMonthBudget = async (budget: MonthlyBudget) => {
    try {
      const updatedBudget = {
        ...budget,
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(`${STORAGE_KEY}_${budget.id}`, JSON.stringify(updatedBudget));
      setCurrentMonthBudget(updatedBudget);
      
      // Update history
      const updatedHistory = { ...budgetHistory };
      const existingIndex = updatedHistory.monthlyBudgets.findIndex(b => b.id === budget.id);
      
      if (existingIndex >= 0) {
        updatedHistory.monthlyBudgets[existingIndex] = updatedBudget;
      } else {
        updatedHistory.monthlyBudgets.push(updatedBudget);
      }
      
      setBudgetHistory(updatedHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  };

  const calculateAutomaticBudget = (days: DayBudget[]): number => {
    return days.reduce((sum, day) => sum + day.total, 0);
  };

  const calculateSpendingLevel = (dayTotal: number, averageSpending: number): 'low' | 'medium' | 'high' => {
    if (dayTotal === 0) return 'low';
    if (dayTotal < averageSpending * 0.7) return 'low';
    if (dayTotal > averageSpending * 1.3) return 'high';
    return 'medium';
  };

  const updateBudgetCalculations = (budget: MonthlyBudget): MonthlyBudget => {
    const totalBudget = calculateAutomaticBudget(budget.days);
    const consumedBudget = budget.days
      .filter(day => day.validated)
      .reduce((sum, day) => sum + day.total, 0);
    
    const averageSpending = budget.days.length > 0 
      ? totalBudget / budget.days.length 
      : 0;

    const updatedDays = budget.days.map(day => ({
      ...day,
      spendingLevel: calculateSpendingLevel(day.total, averageSpending)
    }));

    return {
      ...budget,
      days: updatedDays,
      totalBudget,
      consumedBudget,
      remainingBudget: totalBudget - consumedBudget,
    };
  };

  const getDayBudget = (date: string): DayBudget | null => {
    if (!currentMonthBudget) {
      console.log('No currentMonthBudget available');
      // Essayer de charger le mois correspondant à la date
      const dateObj = new Date(date);
      const month = dateObj.getMonth();
      const year = dateObj.getFullYear();
      
      // Si ce n'est pas le mois sélectionné, on ne peut pas accéder aux données
      if (!selectedMonth || selectedMonth.month !== month || selectedMonth.year !== year) {
        console.log(`Date ${date} is not in selected month`);
        return null;
      }
      return null;
    }
    const dayBudget = currentMonthBudget.days.find(day => day.date === date) || null;
    console.log(`getDayBudget for ${date}:`, dayBudget ? 'found' : 'not found');
    return dayBudget;
  };

  const updateDayBudget = async (dayBudget: DayBudget) => {
    if (!currentMonthBudget) return;

    const existingDayIndex = currentMonthBudget.days.findIndex(day => day.date === dayBudget.date);
    let updatedDays = [...currentMonthBudget.days];

    if (existingDayIndex >= 0) {
      updatedDays[existingDayIndex] = dayBudget;
    } else {
      updatedDays.push(dayBudget);
    }

    const updatedBudget = updateBudgetCalculations({
      ...currentMonthBudget,
      days: updatedDays,
    });

    await saveMonthBudget(updatedBudget);
    
    // Update current state immediately
    setCurrentMonthBudget(updatedBudget);
  };

  const validateDay = async (date: string) => {
    const dayBudget = getDayBudget(date);
    if (!dayBudget || dayBudget.validated) return;

    const updatedDay = {
      ...dayBudget,
      validated: true,
      status: 'validated' as const,
      validatedAt: new Date().toISOString(),
    };

    await updateDayBudget(updatedDay);
    
    // Force refresh of current month budget
    if (selectedMonth) {
      await loadMonthBudget(selectedMonth.month, selectedMonth.year);
    }
  };

  const canEditDay = (date: string): boolean => {
    const dayBudget = getDayBudget(date);
    
    // Can't edit validated days
    if (dayBudget?.validated) return false;
    
    // Can't edit past days (read-only mode)
    const dayDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dayDate.setHours(0, 0, 0, 0);
    
    return dayDate >= today;
  };

  const createEmptyMeal = (type: 'morning' | 'noon' | 'evening'): Meal => ({
    id: `${Date.now()}-${type}`,
    type,
    items: [],
    total: 0,
  });

  const addMealItem = async (date: string, mealType: 'morning' | 'noon' | 'evening', item: Omit<MealItem, 'id'>) => {
    if (!canEditDay(date)) {
      console.log('Cannot edit this day');
      return;
    }

    let dayBudget = getDayBudget(date);
    
    if (!dayBudget) {
      dayBudget = {
        id: date,
        date,
        meals: [
          createEmptyMeal('morning'),
          createEmptyMeal('noon'),
          createEmptyMeal('evening'),
        ],
        total: 0,
        status: 'pending',
        validated: false,
      };
    }

    const mealIndex = dayBudget.meals.findIndex(meal => meal.type === mealType);
    if (mealIndex === -1) return;

    const newItem: MealItem = {
      ...item,
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    };

    const updatedMeal = {
      ...dayBudget.meals[mealIndex],
      items: [...dayBudget.meals[mealIndex].items, newItem],
    };
    updatedMeal.total = updatedMeal.items.reduce((sum, item) => sum + item.price, 0);

    const updatedMeals = [...dayBudget.meals];
    updatedMeals[mealIndex] = updatedMeal;

    const updatedDayBudget = {
      ...dayBudget,
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, meal) => sum + meal.total, 0),
      status: updatedMeals.some(meal => meal.items.length > 0) ? 'planned' as const : 'pending' as const,
    };

    await updateDayBudget(updatedDayBudget);
  };

  const removeMealItem = async (date: string, mealType: 'morning' | 'noon' | 'evening', itemId: string) => {
    if (!canEditDay(date)) {
      console.log('Cannot edit this day');
      return;
    }

    const dayBudget = getDayBudget(date);
    if (!dayBudget) return;

    const mealIndex = dayBudget.meals.findIndex(meal => meal.type === mealType);
    if (mealIndex === -1) return;

    const updatedMeal = {
      ...dayBudget.meals[mealIndex],
      items: dayBudget.meals[mealIndex].items.filter(item => item.id !== itemId),
    };
    updatedMeal.total = updatedMeal.items.reduce((sum, item) => sum + item.price, 0);

    const updatedMeals = [...dayBudget.meals];
    updatedMeals[mealIndex] = updatedMeal;

    const updatedDayBudget = {
      ...dayBudget,
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, meal) => sum + meal.total, 0),
    };

    await updateDayBudget(updatedDayBudget);
  };

  const addContributor = async (name: string, contribution: number) => {
    if (!currentMonthBudget) return;

    const newContributor: Contributor = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name,
      totalContribution: contribution,
      paidAmount: contribution, // Le montant saisi est ce qui a été payé
      remainingAmount: 0, // Pas de reste puisque c'est ce qui a été payé
    };

    const updatedBudget = {
      ...currentMonthBudget,
      contributors: [...currentMonthBudget.contributors, newContributor],
    };

    await saveMonthBudget(updatedBudget);
  };

  const updateContributor = async (contributorId: string, updates: Partial<Contributor>) => {
    if (!currentMonthBudget) return;

    const updatedContributors = currentMonthBudget.contributors.map(contributor =>
      contributor.id === contributorId
        ? { ...contributor, ...updates, remainingAmount: (updates.totalContribution || contributor.totalContribution) - (updates.paidAmount || contributor.paidAmount) }
        : contributor
    );

    const updatedBudget = {
      ...currentMonthBudget,
      contributors: updatedContributors,
    };

    await saveMonthBudget(updatedBudget);
  };

  const selectMonth = (month: number, year: number) => {
    const monthSelection: MonthSelection = {
      month,
      year,
      displayName: new Date(year, month).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    };
    setSelectedMonth(monthSelection);
  };

  const getAvailableMonths = (): MonthSelection[] => {
    const months: MonthSelection[] = [];
    const currentDate = new Date();
    
    // Add current month and next 11 months for planning
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        displayName: date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      });
    }
    
    // Add previous months from history
    budgetHistory.monthlyBudgets.forEach(budget => {
      const exists = months.some(m => m.month === budget.monthNumber && m.year === budget.year);
      if (!exists) {
        months.unshift({
          month: budget.monthNumber,
          year: budget.year,
          displayName: budget.month + ' ' + budget.year
        });
      }
    });
    
    return months.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  };

  const refreshData = async () => {
    setLoading(true);
    await loadBudgetData();
    // Forcer le rechargement du mois sélectionné
    if (selectedMonth) {
      await loadMonthBudget(selectedMonth.month, selectedMonth.year);
    }
  };

  const forceRefreshCurrentMonth = async () => {
    if (selectedMonth) {
      await loadMonthBudget(selectedMonth.month, selectedMonth.year);
    }
  };

  const replaceMealItems = async (date: string, mealType: 'morning' | 'noon' | 'evening', items: MealItem[]) => {
    // Pour la duplication, on vérifie seulement si la date cible est éditable
    const targetDateCheck = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDateCheck.setHours(0, 0, 0, 0);
    
    if (targetDateCheck < today) {
      console.log('Cannot edit past day:', date);
      return;
    }

    // Attendre que currentMonthBudget soit disponible
    let retries = 0;
    while (!currentMonthBudget && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    let dayBudget = getDayBudget(date);
    
    if (!dayBudget) {
      dayBudget = {
        id: date,
        date,
        meals: [
          createEmptyMeal('morning'),
          createEmptyMeal('noon'),
          createEmptyMeal('evening'),
        ],
        total: 0,
        status: 'pending',
        validated: false,
      };
    }

    // S'assurer que tous les types de repas existent
    const allMealTypes: ('morning' | 'noon' | 'evening')[] = ['morning', 'noon', 'evening'];
    const updatedMeals = allMealTypes.map(type => {
      const existingMeal = dayBudget!.meals.find(m => m.type === type);
      if (type === mealType) {
        // Remplacer seulement le repas ciblé
        const newItems = items.map(item => ({
          ...item,
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        }));
        return {
          id: `${Date.now()}-${type}`,
          type,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price, 0),
        };
      } else {
        // Garder les autres repas intacts
        return existingMeal || createEmptyMeal(type);
      }
    });

    const updatedDayBudget = {
      ...dayBudget,
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, meal) => sum + meal.total, 0),
      status: updatedMeals.some(meal => meal.items.length > 0) ? 'planned' as const : 'pending' as const,
    };

    await updateDayBudget(updatedDayBudget);
  };

  const getMonthDates = (): string[] => {
    if (!selectedMonth) return [];
    
    const dates: string[] = [];
    const year = selectedMonth.year;
    const month = selectedMonth.month;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getEditableDates = (): string[] => {
    const allDates = getMonthDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return allDates.filter(dateString => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    });
  };

  const duplicateFullDay = async (targetDate: string, meals: Meal[]) => {
    // Vérifier si on doit changer de mois
    const targetDateObj = new Date(targetDate);
    const targetMonth = targetDateObj.getMonth();
    const targetYear = targetDateObj.getFullYear();
    
    if (!selectedMonth || selectedMonth.month !== targetMonth || selectedMonth.year !== targetYear) {
      console.log(`Switching to month ${targetMonth}/${targetYear} for date ${targetDate}`);
      selectMonth(targetMonth, targetYear);
      // Attendre que le nouveau mois soit chargé
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Attendre que currentMonthBudget soit disponible
    let retries = 0;
    while (!currentMonthBudget && retries < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    const targetDateCheck2 = new Date(targetDate);
    const today2 = new Date();
    today2.setHours(0, 0, 0, 0);
    targetDateCheck2.setHours(0, 0, 0, 0);
    
    if (targetDateCheck2 < today2) {
      console.log('Cannot edit past day:', targetDate);
      return;
    }

    let dayBudget = getDayBudget(targetDate);
    
    if (!dayBudget) {
      dayBudget = {
        id: targetDate,
        date: targetDate,
        meals: [
          createEmptyMeal('morning'),
          createEmptyMeal('noon'),
          createEmptyMeal('evening'),
        ],
        total: 0,
        status: 'pending',
        validated: false,
      };
    }

    // Dupliquer tous les repas en une seule fois
    const allMealTypes: ('morning' | 'noon' | 'evening')[] = ['morning', 'noon', 'evening'];
    const updatedMeals = allMealTypes.map(type => {
      const sourceMeal = meals.find(m => m.type === type);
      if (sourceMeal && sourceMeal.items.length > 0) {
        const newItems = sourceMeal.items.map(item => ({
          ...item,
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        }));
        return {
          id: `${Date.now()}-${type}`,
          type,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price, 0),
        };
      } else {
        return createEmptyMeal(type);
      }
    });

    const updatedDayBudget = {
      ...dayBudget,
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, meal) => sum + meal.total, 0),
      status: updatedMeals.some(meal => meal.items.length > 0) ? 'planned' as const : 'pending' as const,
    };

    await updateDayBudget(updatedDayBudget);
  };

  return {
    currentMonthBudget,
    budgetHistory,
    selectedMonth,
    loading,
    getDayBudget,
    updateDayBudget,
    validateDay,
    canEditDay,
    addMealItem,
    removeMealItem,
    replaceMealItems,
    getMonthDates,
    getEditableDates,
    duplicateFullDay,
    forceRefreshCurrentMonth,
    addContributor,
    updateContributor,
    selectMonth,
    getAvailableMonths,
    refreshData,
  };
};

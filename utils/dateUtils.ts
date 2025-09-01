import { TranslationKey } from '../data/translations';

export const getMonthName = (monthIndex: number, t: (key: TranslationKey) => string): string => {
  const months: TranslationKey[] = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  return t(months[monthIndex]);
};

export const getDayName = (dayIndex: number, t: (key: TranslationKey) => string): string => {
  const days: TranslationKey[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];
  
  return t(days[dayIndex]);
};

export const formatMonthYear = (month: string, year: number, t: (key: TranslationKey) => string): string => {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const monthIndex = monthNames.indexOf(month);
  if (monthIndex !== -1) {
    return `${getMonthName(monthIndex, t)} ${year}`;
  }
  
  return `${month} ${year}`;
};

export const translateMonth = (monthInput: string | number, t: (key: TranslationKey) => string): string => {
  const monthKeys: TranslationKey[] = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  // Si c'est un numéro de mois (0-11 ou 1-12)
  if (typeof monthInput === 'number' || !isNaN(Number(monthInput))) {
    const monthIndex = Number(monthInput);
    // Si c'est 0-11 (JavaScript getMonth)
    if (monthIndex >= 0 && monthIndex <= 11) {
      return t(monthKeys[monthIndex]);
    }
    // Si c'est 1-12
    if (monthIndex >= 1 && monthIndex <= 12) {
      return t(monthKeys[monthIndex - 1]);
    }
    return monthInput.toString();
  }
  
  // Si c'est un nom de mois en français
  const monthMap: { [key: string]: TranslationKey } = {
    'Janvier': 'january', 'Février': 'february', 'Mars': 'march',
    'Avril': 'april', 'Mai': 'may', 'Juin': 'june',
    'Juillet': 'july', 'Août': 'august', 'Septembre': 'september',
    'Octobre': 'october', 'Novembre': 'november', 'Décembre': 'december',
    // Ajouter les variantes minuscules
    'janvier': 'january', 'février': 'february', 'mars': 'march',
    'avril': 'april', 'mai': 'may', 'juin': 'june',
    'juillet': 'july', 'août': 'august', 'septembre': 'september',
    'octobre': 'october', 'novembre': 'november', 'décembre': 'december'
  };
  
  const translationKey = monthMap[monthInput];
  return translationKey ? t(translationKey) : monthInput;
};
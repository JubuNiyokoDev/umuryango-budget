
export interface Meal {
  id: string;
  type: 'morning' | 'noon' | 'evening';
  items: MealItem[];
  total: number;
}

export interface MealItem {
  id: string;
  name: string;
  price: number;
  contributor?: string; // Who paid for this item
}

export interface DayBudget {
  id: string;
  date: string;
  meals: Meal[];
  total: number;
  status: 'planned' | 'validated' | 'pending';
  validated: boolean;
  validatedAt?: string; // When the day was validated
  spendingLevel?: 'low' | 'medium' | 'high'; // Visual indicator for spending amount
}

export interface MonthlyBudget {
  id: string;
  month: string;
  year: number;
  monthNumber: number; // 0-11 for easier comparison
  totalBudget: number; // Automatically calculated from planned days
  consumedBudget: number; // Sum of validated days
  remainingBudget: number; // totalBudget - consumedBudget
  days: DayBudget[];
  contributors: Contributor[];
  createdAt: string;
  updatedAt: string;
}

export interface Contributor {
  id: string;
  name: string;
  totalContribution: number;
  paidAmount: number;
  remainingAmount: number;
}

export interface BudgetHistory {
  monthlyBudgets: MonthlyBudget[];
}

export interface Language {
  code: 'fr' | 'rn';
  name: string;
}

export interface MonthSelection {
  month: number; // 0-11
  year: number;
  displayName: string;
}

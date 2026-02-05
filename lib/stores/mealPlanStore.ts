/**
 * MealPlan Store using Zustand
 * 
 * Global state management for meal plans
 */

import { create } from 'zustand';
import { MealPlan, MealAssignment } from '@/types/MealPlan';

interface MealPlanState {
  mealPlans: MealPlan[];
  currentPlanId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Purchased dates tracking: Record<mealPlanId, string[]>
  purchasedDates: Record<string, string[]>;
  
  // Actions
  setMealPlans: (plans: MealPlan[]) => void;
  setCurrentPlan: (planId: string | null) => void;
  addMealPlan: (plan: MealPlan) => void;
  updateMealPlan: (id: string, plan: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  addMealAssignment: (planId: string, assignment: MealAssignment) => void;
  removeMealAssignment: (planId: string, date: string, mealType: string) => void;
  updateMealAssignment: (planId: string, date: string, mealType: string, recipeIds: string[]) => void;
  addPurchasedDates: (planId: string, dates: string[]) => void;
  getPurchasedDates: (planId: string) => string[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
  mealPlans: [],
  currentPlanId: null,
  isLoading: false,
  error: null,
  purchasedDates: {},
  
  setMealPlans: (plans) => set({ mealPlans: plans }),
  
  setCurrentPlan: (planId) => set({ currentPlanId: planId }),
  
  addMealPlan: (plan) => set((state) => ({
    mealPlans: [...state.mealPlans, plan],
  })),
  
  updateMealPlan: (id, updates) => set((state) => ({
    mealPlans: state.mealPlans.map((plan) =>
      plan.id === id ? { ...plan, ...updates } : plan
    ),
  })),
  
  deleteMealPlan: (id) => set((state) => {
    const { [id]: removed, ...restDates } = state.purchasedDates;
    return {
      mealPlans: state.mealPlans.filter((plan) => plan.id !== id),
      currentPlanId: state.currentPlanId === id ? null : state.currentPlanId,
      purchasedDates: restDates,
    };
  }),
  
  addMealAssignment: (planId, assignment) => set((state) => ({
    mealPlans: state.mealPlans.map((plan) =>
      plan.id === planId
        ? { ...plan, meals: [...plan.meals, assignment] }
        : plan
    ),
  })),
  
  removeMealAssignment: (planId, date, mealType) => set((state) => ({
    mealPlans: state.mealPlans.map((plan) =>
      plan.id === planId
        ? {
            ...plan,
            meals: plan.meals.filter(
              (m) => !(m.date === date && m.mealType === mealType)
            ),
          }
        : plan
    ),
  })),
  
  updateMealAssignment: (planId, date, mealType, recipeIds) => set((state) => ({
    mealPlans: state.mealPlans.map((plan) =>
      plan.id === planId
        ? {
            ...plan,
            meals: plan.meals.map((m) =>
              m.date === date && m.mealType === mealType
                ? { ...m, recipeIds }
                : m
            ),
          }
        : plan
    ),
  })),
  
  addPurchasedDates: (planId, dates) => set((state) => {
    const existingDates = state.purchasedDates[planId] || [];
    const uniqueDates = [...new Set([...existingDates, ...dates])];
    return {
      purchasedDates: {
        ...state.purchasedDates,
        [planId]: uniqueDates,
      },
    };
  }),
  
  getPurchasedDates: (planId) => {
    return get().purchasedDates[planId] || [];
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

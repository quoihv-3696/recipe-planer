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
  
  // Actions
  setMealPlans: (plans: MealPlan[]) => void;
  setCurrentPlan: (planId: string | null) => void;
  addMealPlan: (plan: MealPlan) => void;
  updateMealPlan: (id: string, plan: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  addMealAssignment: (planId: string, assignment: MealAssignment) => void;
  removeMealAssignment: (planId: string, date: string, mealType: string) => void;
  updateMealAssignment: (planId: string, date: string, mealType: string, recipeId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMealPlanStore = create<MealPlanState>((set) => ({
  mealPlans: [],
  currentPlanId: null,
  isLoading: false,
  error: null,
  
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
  
  deleteMealPlan: (id) => set((state) => ({
    mealPlans: state.mealPlans.filter((plan) => plan.id !== id),
    currentPlanId: state.currentPlanId === id ? null : state.currentPlanId,
  })),
  
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
  
  updateMealAssignment: (planId, date, mealType, recipeId) => set((state) => ({
    mealPlans: state.mealPlans.map((plan) =>
      plan.id === planId
        ? {
            ...plan,
            meals: plan.meals.map((m) =>
              m.date === date && m.mealType === mealType
                ? { ...m, recipeId }
                : m
            ),
          }
        : plan
    ),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

/**
 * MealPlan Service
 * 
 * Business logic for meal plan CRUD operations and meal assignments
 */

import * as indexedDB from '@/lib/storage/indexedDB';
import { MealPlan, MealAssignment } from '@/types/MealPlan';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addWeeks, subWeeks } from 'date-fns';

const MEAL_PLAN_PREFIX = indexedDB.KEY_PREFIXES.MEAL_PLAN;

/**
 * Get all meal plans from IndexedDB
 */
export async function getAllMealPlans(): Promise<MealPlan[]> {
  try {
    const plans = await indexedDB.getItemsByPrefix<MealPlan>(MEAL_PLAN_PREFIX);
    // Sort by start date (most recent first)
    return plans.sort((a, b) => b.startDate.localeCompare(a.startDate));
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
}

/**
 * Get a single meal plan by ID
 */
export async function getMealPlanById(id: string): Promise<MealPlan | undefined> {
  try {
    const key = `${MEAL_PLAN_PREFIX}${id}`;
    return await indexedDB.getItem<MealPlan>(key);
  } catch (error) {
    console.error(`Error fetching meal plan ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new meal plan
 */
export async function createMealPlan(plan: MealPlan): Promise<MealPlan> {
  try {
    const key = `${MEAL_PLAN_PREFIX}${plan.id}`;
    const success = await indexedDB.setItem(key, plan);
    if (!success) {
      throw new Error('Failed to create meal plan');
    }
    return plan;
  } catch (error) {
    console.error('Error creating meal plan:', error);
    throw error;
  }
}

/**
 * Update an existing meal plan
 */
export async function updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
  try {
    const existing = await getMealPlanById(id);
    if (!existing) {
      throw new Error(`Meal plan ${id} not found`);
    }
    
    const updated: MealPlan = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
    };
    
    const key = `${MEAL_PLAN_PREFIX}${id}`;
    const success = await indexedDB.setItem(key, updated);
    if (!success) {
      throw new Error('Failed to update meal plan');
    }
    
    return updated;
  } catch (error) {
    console.error(`Error updating meal plan ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a meal plan
 */
export async function deleteMealPlan(id: string): Promise<boolean> {
  try {
    const key = `${MEAL_PLAN_PREFIX}${id}`;
    return await indexedDB.deleteItem(key);
  } catch (error) {
    console.error(`Error deleting meal plan ${id}:`, error);
    throw error;
  }
}

/**
 * Add a meal assignment to a plan
 * If assignment already exists for the date/mealType, append the new recipeIds to existing ones
 */
export async function addMealAssignment(
  planId: string,
  assignment: MealAssignment
): Promise<MealPlan> {
  try {
    const plan = await getMealPlanById(planId);
    if (!plan) {
      throw new Error(`Meal plan ${planId} not found`);
    }
    
    // Check if assignment already exists for same date/mealType
    const existingIndex = plan.meals.findIndex(
      (m) => m.date === assignment.date && m.mealType === assignment.mealType
    );
    
    let updatedMeals: MealAssignment[];
    
    if (existingIndex >= 0) {
      // Append new recipeIds to existing assignment
      const existing = plan.meals[existingIndex];
      // Handle backward compatibility: ensure recipeIds is always an array
      const existingRecipeIds = Array.isArray(existing.recipeIds) 
        ? existing.recipeIds 
        : (existing.recipeIds ? [existing.recipeIds] : []);
      const mergedRecipeIds = [...new Set([...existingRecipeIds, ...assignment.recipeIds])];
      
      updatedMeals = plan.meals.map((m, i) =>
        i === existingIndex
          ? { ...m, recipeIds: mergedRecipeIds }
          : m
      );
    } else {
      // Add new assignment
      updatedMeals = [...plan.meals, assignment];
    }
    
    const updatedPlan: MealPlan = {
      ...plan,
      meals: updatedMeals,
    };
    
    return await updateMealPlan(planId, updatedPlan);
  } catch (error) {
    console.error('Error adding meal assignment:', error);
    throw error;
  }
}

/**
 * Remove a meal assignment from a plan
 */
export async function removeMealAssignment(
  planId: string,
  date: string,
  mealType: string
): Promise<MealPlan> {
  try {
    const plan = await getMealPlanById(planId);
    if (!plan) {
      throw new Error(`Meal plan ${planId} not found`);
    }
    
    const updatedPlan: MealPlan = {
      ...plan,
      meals: plan.meals.filter(
        (m) => !(m.date === date && m.mealType === mealType)
      ),
    };
    
    return await updateMealPlan(planId, updatedPlan);
  } catch (error) {
    console.error('Error removing meal assignment:', error);
    throw error;
  }
}

/**
 * Remove a specific recipe from a meal slot
 * If it's the last recipe, removes the entire assignment
 */
export async function removeRecipeFromSlot(
  planId: string,
  date: string,
  mealType: string,
  recipeId: string
): Promise<MealPlan> {
  try {
    const plan = await getMealPlanById(planId);
    if (!plan) {
      throw new Error(`Meal plan ${planId} not found`);
    }
    
    const updatedMeals = plan.meals
      .map(m => {
        if (m.date === date && m.mealType === mealType) {
          // Handle backward compatibility: ensure recipeIds is always an array
          const currentRecipeIds = Array.isArray(m.recipeIds) 
            ? m.recipeIds 
            : (m.recipeIds ? [m.recipeIds] : []);
          // Remove the specific recipe from recipeIds array
          const newRecipeIds = currentRecipeIds.filter(id => id !== recipeId);
          return { ...m, recipeIds: newRecipeIds };
        }
        return m;
      })
      // Remove assignments with no recipes left
      .filter(m => {
        const recipeIds = Array.isArray(m.recipeIds) ? m.recipeIds : [];
        return recipeIds.length > 0;
      });
    
    const updatedPlan: MealPlan = {
      ...plan,
      meals: updatedMeals,
    };
    
    return await updateMealPlan(planId, updatedPlan);
  } catch (error) {
    console.error('Error removing recipe from slot:', error);
    throw error;
  }
}

/**
 * Generate date range for a week starting from given date
 */
export function generateWeekDates(startDate: Date): string[] {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 }); // Sunday
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  return days.map(day => format(day, 'yyyy-MM-dd'));
}

/**
 * Get week range (start and end dates) for a given date
 */
export function getWeekRange(date: Date): { start: string; end: string } {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  
  return {
    start: format(weekStart, 'yyyy-MM-dd'),
    end: format(weekEnd, 'yyyy-MM-dd'),
  };
}

/**
 * Get next week's start date
 */
export function getNextWeek(currentDate: Date): Date {
  return addWeeks(currentDate, 1);
}

/**
 * Get previous week's start date
 */
export function getPreviousWeek(currentDate: Date): Date {
  return subWeeks(currentDate, 1);
}

/**
 * Get meal plan for a specific week
 */
export async function getMealPlanForWeek(startDate: string): Promise<MealPlan | undefined> {
  try {
    const plans = await getAllMealPlans();
    return plans.find(plan => plan.startDate === startDate);
  } catch (error) {
    console.error('Error fetching meal plan for week:', error);
    throw error;
  }
}

/**
 * Meal Plan Service Object
 * Export as singleton for easy importing
 */
export const mealPlanService = {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  addMealAssignment,
  removeMealAssignment,
  removeRecipeFromSlot,
  generateWeekDates,
  getWeekRange,
  getNextWeek,
  getPreviousWeek,
  getMealPlanForWeek,
};

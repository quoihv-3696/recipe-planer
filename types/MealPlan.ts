/**
 * MealPlan Entity
 * 
 * Organizes recipes into weekly meal schedules.
 * Stored in IndexedDB with key prefix 'meal-plan:'
 */

export interface MealPlan {
  /** Unique identifier (UUID v4) */
  id: string;
  
  /** Meal plan name/description (1-100 characters, e.g., "Week of Feb 5-11") */
  name: string;
  
  /** Plan start date (ISO 8601 date format: YYYY-MM-DD, typically Monday) */
  startDate: string;
  
  /** Plan end date (ISO 8601 date format: YYYY-MM-DD, typically Sunday, must be >= startDate) */
  endDate: string;
  
  /** Array of meal assignments (can be empty for new plans) */
  meals: MealAssignment[];
  
  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;
}

/**
 * Assignment of a recipe to a specific meal slot
 * Updated to support multiple recipes per meal slot
 */
export interface MealAssignment {
  /** Meal date (ISO 8601 date format: YYYY-MM-DD) */
  date: string;
  
  /** Type of meal */
  mealType: MealType;
  
  /** References to Recipe entity IDs (array to support multiple recipes per slot) */
  recipeIds: string[];
}

/**
 * Enum for meal types
 * Limited to breakfast, lunch, dinner in v1 (no snacks)
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/**
 * Helper to get all valid meal types
 */
export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

/**
 * Type guard to check if a string is a valid MealType
 */
export function isMealType(value: string): value is MealType {
  return MEAL_TYPES.includes(value as MealType);
}

/**
 * Type guard to check if an object is a valid MealPlan
 */
export function isMealPlan(obj: any): obj is MealPlan {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.startDate === 'string' &&
    typeof obj.endDate === 'string' &&
    Array.isArray(obj.meals) &&
    typeof obj.createdAt === 'string'
  );
}

/**
 * Create a new MealPlan with default values
 */
export function createMealPlan(
  partial: Partial<MealPlan> & Pick<MealPlan, 'name' | 'startDate' | 'endDate'>
): MealPlan {
  return {
    id: crypto.randomUUID(),
    meals: [],
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

/**
 * Get all meal assignments for a specific date
 */
export function getMealsByDate(mealPlan: MealPlan, date: string): MealAssignment[] {
  return mealPlan.meals.filter((meal) => meal.date === date);
}

/**
 * Get a specific meal assignment
 */
export function getMeal(
  mealPlan: MealPlan,
  date: string,
  mealType: MealType
): MealAssignment | undefined {
  return mealPlan.meals.find((meal) => meal.date === date && meal.mealType === mealType);
}

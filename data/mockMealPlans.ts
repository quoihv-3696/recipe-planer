/**
 * Mock MealPlan Data
 * 
 * Sample meal plans for initial data population
 */

import { MealPlan } from '@/types/MealPlan';

export const mockMealPlans: MealPlan[] = [
  {
    id: 'meal-plan-001',
    name: 'Week of Feb 3-9, 2026',
    startDate: '2026-02-03',
    endDate: '2026-02-09',
    meals: [
      // Monday Feb 3
      { date: '2026-02-03', mealType: 'breakfast', recipeId: 'recipe-005' },
      { date: '2026-02-03', mealType: 'lunch', recipeId: 'recipe-002' },
      { date: '2026-02-03', mealType: 'dinner', recipeId: 'recipe-001' },
      // Tuesday Feb 4
      { date: '2026-02-04', mealType: 'breakfast', recipeId: 'recipe-005' },
      { date: '2026-02-04', mealType: 'lunch', recipeId: 'recipe-004' },
      { date: '2026-02-04', mealType: 'dinner', recipeId: 'recipe-003' },
      // Wednesday Feb 5
      { date: '2026-02-05', mealType: 'breakfast', recipeId: 'recipe-005' },
      { date: '2026-02-05', mealType: 'lunch', recipeId: 'recipe-002' },
      { date: '2026-02-05', mealType: 'dinner', recipeId: 'recipe-001' },
      // Thursday Feb 6
      { date: '2026-02-06', mealType: 'lunch', recipeId: 'recipe-004' },
      { date: '2026-02-06', mealType: 'dinner', recipeId: 'recipe-003' },
      // Friday Feb 7
      { date: '2026-02-07', mealType: 'dinner', recipeId: 'recipe-001' },
    ],
    createdAt: '2026-02-01T10:00:00Z',
  },
];

/**
 * Sidebar Component
 * 
 * Displays today's meal plan in sidebar
 */

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MealPlan, MealType } from '@/types/MealPlan';
import { Recipe } from '@/types/Recipe';
import { format, parseISO, isToday } from 'date-fns';

export interface SidebarProps {
  mealPlans: MealPlan[];
  recipes: Recipe[];
}

export function Sidebar({ mealPlans, recipes }: SidebarProps) {
  const router = useRouter();
  
  // Get today's date in YYYY-MM-DD format
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  // Find today's meals across all meal plans
  const todaysMeals = useMemo(() => {
    const meals: { mealType: MealType; recipe: Recipe | null }[] = [
      { mealType: 'breakfast', recipe: null },
      { mealType: 'lunch', recipe: null },
      { mealType: 'dinner', recipe: null },
    ];
    
    // Create recipe map for fast lookup
    const recipeMap = new Map(recipes.map(r => [r.id, r]));
    
    // Find meals for today
    for (const plan of mealPlans) {
      const todaysAssignments = plan.meals.filter(meal => meal.date === todayStr);
      
      for (const assignment of todaysAssignments) {
        const mealIndex = meals.findIndex(m => m.mealType === assignment.mealType);
        if (mealIndex !== -1 && !meals[mealIndex].recipe) {
          meals[mealIndex].recipe = recipeMap.get(assignment.recipeId) || null;
        }
      }
    }
    
    return meals;
  }, [mealPlans, recipes, todayStr]);
  
  const handleMealClick = (recipe: Recipe) => {
    router.push(`/recipes/detail?id=${recipe.id}`);
  };
  
  return (
    <aside className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📅</span>
        <h2 className="text-xl font-bold text-gray-900">Today's Meals</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        {format(new Date(), 'EEEE, MMMM d, yyyy')}
      </p>
      
      <div className="space-y-4">
        {todaysMeals.map(({ mealType, recipe }) => (
          <div key={mealType} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {mealType === 'breakfast' && '🌅'}
                {mealType === 'lunch' && '🌞'}
                {mealType === 'dinner' && '🌙'}
              </span>
              <h3 className="font-semibold text-gray-900 capitalize">
                {mealType}
              </h3>
            </div>
            
            {recipe ? (
              <button
                onClick={() => handleMealClick(recipe)}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍳</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {recipe.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {recipe.ingredients.length} ingredients
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">No meal planned</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {todaysMeals.every(m => !m.recipe) && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">No meals planned for today</p>
          <button
            onClick={() => router.push('/meal-plan')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Plan Your Meals
          </button>
        </div>
      )}
    </aside>
  );
}

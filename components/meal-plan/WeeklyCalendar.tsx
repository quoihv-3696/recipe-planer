/**
 * WeeklyCalendar Component
 * 
 * Displays a weekly meal plan calendar with 7 days and 3 meals per day
 */

'use client';

import { format, parseISO } from 'date-fns';
import { MealPlan, MealType } from '@/types/MealPlan';
import { Recipe } from '@/types/Recipe';
import { MealSlot } from './MealSlot';

export interface WeeklyCalendarProps {
  mealPlan: MealPlan;
  recipes: Recipe[];
  weekDates: string[];
  purchasedDates?: string[];
  onMealSlotClick: (date: string, mealType: MealType) => void;
  onRemoveMeal: (date: string, mealType: MealType, recipeId: string) => void;
}

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

export function WeeklyCalendar({
  mealPlan,
  recipes,
  weekDates,
  purchasedDates = [],
  onMealSlotClick,
  onRemoveMeal,
}: WeeklyCalendarProps) {
  // Create a map of recipes by ID for quick lookup
  const recipeMap = new Map(recipes.map(r => [r.id, r]));
  
  // Check if a date has purchased ingredients
  const isDatePurchased = (date: string): boolean => {
    return purchasedDates.includes(date);
  };
  
  // Get all recipes for a specific date and meal type
  const getRecipesForSlot = (date: string, mealType: MealType): Recipe[] => {
    const assignment = mealPlan.meals.find(
      m => m.date === date && m.mealType === mealType
    );
    
    // Handle backward compatibility: recipeIds might be undefined in old data
    if (!assignment || !assignment.recipeIds || assignment.recipeIds.length === 0) {
      return [];
    }
    
    // Map recipeIds to Recipe objects, filtering out any not found
    return assignment.recipeIds
      .map(id => recipeMap.get(id))
      .filter((recipe): recipe is Recipe => recipe !== undefined);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop View: Grid Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">
                Meal
              </th>
              {weekDates.map(date => (
                <th key={date} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 relative">
                  <div className="flex items-center justify-center gap-1">
                    <span>{format(parseISO(date), 'EEE')}</span>
                    {isDatePurchased(date) && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs" title="Groceries purchased for this date">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-normal">
                    {format(parseISO(date), 'MMM d')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mealTypes.map(mealType => (
              <tr key={mealType}>
                <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 capitalize">
                  {mealType}
                </td>
                {weekDates.map(date => (
                  <td key={`${date}-${mealType}`} className="px-2 py-2">
                    <MealSlot
                      mealType={mealType}
                      recipes={getRecipesForSlot(date, mealType)}
                      onClick={() => onMealSlotClick(date, mealType)}
                      onRemove={(recipeId) => onRemoveMeal(date, mealType, recipeId)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile View: Stacked Days */}
      <div className="md:hidden divide-y divide-gray-200">
        {weekDates.map(date => (
          <div key={date} className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {format(parseISO(date), 'EEEE, MMM d')}
            </h3>
            <div className="space-y-2">
              {mealTypes.map(mealType => (
                <MealSlot
                  key={`${date}-${mealType}`}
                  mealType={mealType}
                  recipes={getRecipesForSlot(date, mealType)}
                  onClick={() => onMealSlotClick(date, mealType)}
                  onRemove={(recipeId) => onRemoveMeal(date, mealType, recipeId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

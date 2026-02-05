/**
 * MealSlot Component
 * 
 * Displays a single meal slot in the weekly calendar
 * Supports multiple recipes per slot
 */

'use client';

import { Recipe } from '@/types/Recipe';
import { MealType } from '@/types/MealPlan';

export interface MealSlotProps {
  mealType: MealType;
  recipes?: Recipe[]; // Changed from single recipe to array
  onClick: () => void;
  onRemove?: (recipeId: string) => void; // Now takes recipeId to remove specific recipe
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

const mealTypeIcons: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '🌞',
  dinner: '🌙',
};

export function MealSlot({ mealType, recipes = [], onClick, onRemove }: MealSlotProps) {
  const hasRecipes = recipes.length > 0;

  return (
    <div
      className={`border border-gray-200 rounded-lg p-3 transition-colors ${
        hasRecipes ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
      } min-h-[80px]`}
    >
      {/* Header with meal type */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{mealTypeIcons[mealType]}</span>
          <span className="text-sm font-medium text-gray-700">
            {mealTypeLabels[mealType]}
          </span>
          {hasRecipes && (
            <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
              {recipes.length}
            </span>
          )}
        </div>
      </div>
      
      {/* Recipe list or empty state */}
      {hasRecipes ? (
        <div className="space-y-2">
          {/* Display recipes as cards */}
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="bg-white border border-blue-200 rounded p-2 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1">
                  {recipe.name}
                </p>
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(recipe.id);
                    }}
                    className="text-red-600 hover:text-red-700 p-0.5 flex-shrink-0"
                    aria-label={`Remove ${recipe.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Another Recipe button */}
          <button
            onClick={onClick}
            className="w-full border border-dashed border-blue-400 rounded p-2 text-xs text-blue-600 hover:bg-blue-100 hover:border-blue-500 transition-colors"
          >
            + Add Another Recipe
          </button>
        </div>
      ) : (
        <button
          onClick={onClick}
          className="w-full text-left"
        >
          <p className="text-xs text-gray-500 italic">
            Click to add recipe
          </p>
        </button>
      )}
    </div>
  );
}

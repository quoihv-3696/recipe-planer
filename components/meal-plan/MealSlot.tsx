/**
 * MealSlot Component
 * 
 * Displays a single meal slot in the weekly calendar
 */

'use client';

import { Recipe } from '@/types/Recipe';
import { MealType } from '@/types/MealPlan';

export interface MealSlotProps {
  mealType: MealType;
  recipe?: Recipe;
  onClick: () => void;
  onRemove?: () => void;
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

export function MealSlot({ mealType, recipe, onClick, onRemove }: MealSlotProps) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-3 transition-colors ${
        recipe ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
      } cursor-pointer min-h-[80px]`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{mealTypeIcons[mealType]}</span>
          <span className="text-sm font-medium text-gray-700">
            {mealTypeLabels[mealType]}
          </span>
        </div>
        {recipe && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-red-600 hover:text-red-700 p-1"
            aria-label="Remove meal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {recipe ? (
        <div>
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">
            {recipe.name}
          </p>
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic">
          Click to add recipe
        </p>
      )}
    </div>
  );
}

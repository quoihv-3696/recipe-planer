/**
 * RecipeCard Component
 * 
 * Card displaying recipe in list view
 */

'use client';

import { Recipe } from '@/types/Recipe';
import { Card } from '@/components/common/Card';
import { formatCalories } from '@/lib/utils/formatters';

export interface RecipeCardProps {
  recipe: Recipe;
  onClick: (id: string) => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <Card hoverable onClick={() => onClick(recipe.id)} className="h-full">
      <div className="flex flex-col h-full">
        {/* Recipe Image */}
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-48 object-cover rounded-t-lg -mx-4 -mt-4 mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg -mx-4 -mt-4 mb-4 flex items-center justify-center">
            <span className="text-6xl">🍳</span>
          </div>
        )}
        
        {/* Recipe Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.name}
          </h3>
          
          <div className="mt-auto flex items-center justify-between text-sm text-gray-600">
            <span>{recipe.ingredients.length} ingredients</span>
            {recipe.totalCalories && (
              <span>{formatCalories(recipe.totalCalories)}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

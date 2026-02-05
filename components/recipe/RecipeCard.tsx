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
  weeklyUsage?: number;
  monthlyUsage?: number;
}

export function RecipeCard({ recipe, onClick, weeklyUsage, monthlyUsage }: RecipeCardProps) {
  const showUsage = (weeklyUsage !== undefined && weeklyUsage > 0) || (monthlyUsage !== undefined && monthlyUsage > 0);
  
  return (
    <Card hoverable onClick={() => onClick(recipe.id)} className="h-full !p-0">
      <div className="flex flex-col h-full">
        {/* Recipe Image */}
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-6xl">🍳</span>
          </div>
        )}
        
        {/* Recipe Info */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.name}
          </h3>
          
          {/* Usage Badge */}
          {showUsage && (
            <div className="mb-3 flex flex-wrap gap-2">
              {weeklyUsage !== undefined && weeklyUsage > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  📊 {weeklyUsage}× this week
                </span>
              )}
              {monthlyUsage !== undefined && monthlyUsage > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  📈 {monthlyUsage}× this month
                </span>
              )}
            </div>
          )}
          
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

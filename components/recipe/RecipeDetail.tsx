/**
 * RecipeDetail Component
 * 
 * Full recipe display with all details
 */

'use client';

import { Recipe } from '@/types/Recipe';
import { Ingredient } from '@/types/Ingredient';
import { formatCalories, formatQuantity } from '@/lib/utils/formatters';
import { Button } from '@/components/common/Button';

export interface RecipeDetailProps {
  recipe: Recipe;
  ingredients?: Ingredient[];
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export function RecipeDetail({ recipe, ingredients = [], onEdit, onDelete, onBack }: RecipeDetailProps) {
  // Create a map of ingredient IDs to ingredient details
  const ingredientMap = new Map(ingredients.map(ing => [ing.id, ing]));
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with Actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to recipes
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
            {recipe.totalCalories && (
              <p className="text-lg text-gray-600">{formatCalories(recipe.totalCalories)}</p>
            )}
          </div>
          
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button onClick={onEdit} variant="secondary" size="sm">
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button onClick={onDelete} variant="danger" size="sm">
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Recipe Image */}
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-96 object-cover"
        />
      ) : (
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <span className="text-9xl">🍳</span>
        </div>
      )}
      
      <div className="p-6">
        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((recipeIng, index) => {
              const ingredient = ingredientMap.get(recipeIng.ingredientId);
              return (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="font-medium">{formatQuantity(recipeIng.quantity, recipeIng.unit)}</span>
                  <span>{ingredient?.name || `Ingredient ${recipeIng.ingredientId}`}</span>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="prose max-w-none">
            {recipe.instructions.split('\n').map((line, index) => (
              <p key={index} className="mb-2 text-gray-700">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

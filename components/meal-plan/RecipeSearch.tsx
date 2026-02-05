/**
 * RecipeSearch Component
 * 
 * Search and select recipes for meal planning
 */

'use client';

import { useState, useMemo } from 'react';
import { Recipe } from '@/types/Recipe';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export interface RecipeSearchProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onCancel: () => void;
}

export function RecipeSearch({ recipes, onSelect, onCancel }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return recipes;
    }
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => {
      // Search by recipe name
      if (recipe.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search by ingredient names (you'd need to fetch ingredient details)
      // For now, just search by recipe name
      return false;
    });
  }, [recipes, searchQuery]);
  
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes by name..."
          autoFocus
        />
        {filteredRecipes.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>
      
      {/* Recipe List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recipes found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-2xl">🍳</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {recipe.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {recipe.ingredients.length} ingredients
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

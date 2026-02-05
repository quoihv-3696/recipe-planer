/**
 * Recipes List Page
 * 
 * Browse all recipes in a grid layout
 */

'use client';

import { useState, useMemo, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { useIngredients } from '@/lib/hooks/useIngredients';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import type { RecipeFormData } from '@/components/recipe/RecipeForm';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';

// Lazy load the heavy RecipeForm component
const RecipeForm = lazy(() => import('@/components/recipe/RecipeForm').then(module => ({ default: module.RecipeForm })));

export default function RecipesPage() {
  const router = useRouter();
  const { recipes, isLoading, error, createRecipe } = useRecipes();
  const { ingredients } = useIngredients();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return recipes;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const ingredientMap = new Map(ingredients.map(ing => [ing.id, ing]));
    
    return recipes.filter(recipe => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in instructions
      if (recipe.instructions.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in ingredient names
      for (const recipeIng of recipe.ingredients) {
        const ingredient = ingredientMap.get(recipeIng.ingredientId);
        if (ingredient && ingredient.name.toLowerCase().includes(query)) {
          return true;
        }
      }
      
      return false;
    });
  }, [recipes, searchQuery, ingredients]);
  
  const handleCreateRecipe = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    try {
      // Generate a unique ID for the new recipe
      const recipeId = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await createRecipe({
        id: recipeId,
        name: data.name,
        instructions: data.instructions,
        imageUrl: data.imageUrl,
        ingredients: data.ingredients,
        totalCalories: 0, // Can be calculated from ingredients if needed
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to create recipe:', err);
      alert('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading recipes...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading recipes: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipes</h1>
            <p className="text-gray-600">Browse your recipe collection</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            + Add Recipe
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by name or ingredient..."
            className="w-full"
            aria-label="Search recipes"
            id="recipe-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Search Results Count */}
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>
      
      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon="🔍"
            title="No recipes found"
            description={`No recipes match "${searchQuery}". Try a different search term.`}
            action={{
              label: 'Clear Search',
              onClick: () => setSearchQuery('')
            }}
          />
        ) : (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No recipes yet"
            description="Start building your recipe collection by adding your first recipe."
          />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={(id) => router.push(`/recipes/detail?id=${id}`)}
            />
          ))}
        </div>
      )}
      
      {/* Add Recipe Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title="Add New Recipe"
      >
        <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
          <RecipeForm
            onSubmit={handleCreateRecipe}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Suspense>
      </Modal>
    </div>
  );
}

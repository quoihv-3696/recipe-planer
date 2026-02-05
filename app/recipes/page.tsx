/**
 * Recipes List Page
 * 
 * Browse all recipes in a grid layout
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeForm, RecipeFormData } from '@/components/recipe/RecipeForm';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import * as ingredientService from '@/lib/services/ingredientService';
import { Ingredient } from '@/types/Ingredient';
import { useEffect } from 'react';

export default function RecipesPage() {
  const router = useRouter();
  const { recipes, isLoading, error, createRecipe } = useRecipes();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load ingredients for the form
  useEffect(() => {
    const loadIngredients = async () => {
      const allIngredients = await ingredientService.getAllIngredients();
      setIngredients(allIngredients);
    };
    loadIngredients();
  }, []);
  
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipes</h1>
          <p className="text-gray-600">Browse your recipe collection</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          + Add Recipe
        </Button>
      </div>
      
      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="No recipes yet"
          description="Start building your recipe collection by adding your first recipe."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
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
        <RecipeForm
          ingredients={ingredients}
          onSubmit={handleCreateRecipe}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

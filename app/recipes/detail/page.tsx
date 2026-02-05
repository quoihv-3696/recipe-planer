/**
 * Recipe Detail Page
 * 
 * Display full recipe details using client-side routing
 * Route: /recipes/detail?id=<recipe-id>
 */

'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Recipe } from '@/types/Recipe';
import { Ingredient } from '@/types/Ingredient';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { useIngredients } from '@/lib/hooks/useIngredients';
import { RecipeDetail } from '@/components/recipe/RecipeDetail';
import type { RecipeFormData } from '@/components/recipe/RecipeForm';
import { DeleteConfirmModal } from '@/components/recipe/DeleteConfirmModal';
import { Modal } from '@/components/common/Modal';

// Lazy load the heavy RecipeForm component
const RecipeForm = lazy(() => import('@/components/recipe/RecipeForm').then(module => ({ default: module.RecipeForm })));

export default function RecipeDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id');
  const { getRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const { ingredients } = useIngredients();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!recipeId) {
      setError('No recipe ID provided');
      setIsLoading(false);
      return;
    }
    
    loadRecipeAndIngredients();
  }, [recipeId]);
  
  const loadRecipeAndIngredients = async () => {
    if (!recipeId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Load recipe
      const loadedRecipe = await getRecipe(recipeId);
      if (!loadedRecipe) {
        setError('Recipe not found');
        setIsLoading(false);
        return;
      }
      setRecipe(loadedRecipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditRecipe = async (data: RecipeFormData) => {
    if (!recipeId) return;
    
    setIsSubmitting(true);
    try {
      await updateRecipe(recipeId, {
        name: data.name,
        instructions: data.instructions,
        imageUrl: data.imageUrl,
        ingredients: data.ingredients,
        updatedAt: new Date().toISOString()
      });
      
      // Reload recipe to show updated data
      await loadRecipeAndIngredients();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update recipe:', err);
      alert('Failed to update recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteRecipe = async () => {
    if (!recipeId) return;
    
    setIsDeleting(true);
    try {
      await deleteRecipe(recipeId);
      router.push('/recipes'); // Navigate back to list after deletion
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      alert('Failed to delete recipe. Please try again.');
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Recipe not found'}
        </div>
        <button
          onClick={() => router.push('/recipes')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          ← Back to Recipes
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RecipeDetail
        recipe={recipe}
        ingredients={ingredients}
        onBack={() => router.push('/recipes')}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />
      
      {/* Edit Recipe Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        title="Edit Recipe"
      >
        <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
          <RecipeForm
            recipe={recipe}
            onSubmit={handleEditRecipe}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </Suspense>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteRecipe}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

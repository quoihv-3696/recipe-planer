/**
 * useRecipes Hook
 * 
 * Custom hook for recipe operations
 */

'use client';

import { useEffect } from 'react';
import { useRecipeStore } from '@/lib/stores/recipeStore';
import * as recipeService from '@/lib/services/recipeService';
import { Recipe } from '@/types/Recipe';

export function useRecipes() {
  const { recipes, isLoading, error, setRecipes, addRecipe, updateRecipe, deleteRecipe, setLoading, setError } = useRecipeStore();
  
  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, []);
  
  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedRecipes = await recipeService.getAllRecipes();
      setRecipes(loadedRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };
  
  const getRecipe = async (id: string): Promise<Recipe | undefined> => {
    try {
      return await recipeService.getRecipeById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recipe');
      return undefined;
    }
  };
  
  const createRecipe = async (recipe: Recipe) => {
    try {
      setError(null);
      const created = await recipeService.createRecipe(recipe);
      addRecipe(created);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
      throw err;
    }
  };
  
  const updateRecipeById = async (id: string, updates: Partial<Recipe>) => {
    try {
      setError(null);
      const updated = await recipeService.updateRecipe(id, updates);
      updateRecipe(id, updates);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
      throw err;
    }
  };
  
  const deleteRecipeById = async (id: string) => {
    try {
      setError(null);
      await recipeService.deleteRecipe(id);
      deleteRecipe(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      throw err;
    }
  };
  
  const searchRecipes = async (query: string): Promise<Recipe[]> => {
    try {
      setError(null);
      return await recipeService.searchRecipes(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search recipes');
      return [];
    }
  };
  
  const getUsageStats = async () => {
    try {
      setError(null);
      return await recipeService.getRecipeUsageStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get usage stats');
      return null;
    }
  };
  
  const getRecipeUsageCount = async (recipeId: string, period: 'week' | 'month') => {
    try {
      return await recipeService.getUsageForRecipe(recipeId, period);
    } catch (err) {
      console.error('Failed to get recipe usage count:', err);
      return 0;
    }
  };
  
  return {
    recipes,
    isLoading,
    error,
    loadRecipes,
    getRecipe,
    createRecipe,
    updateRecipe: updateRecipeById,
    deleteRecipe: deleteRecipeById,
    searchRecipes,
    getUsageStats,
    getRecipeUsageCount,
  };
}

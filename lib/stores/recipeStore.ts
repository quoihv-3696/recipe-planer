/**
 * Recipe Store using Zustand
 * 
 * Global state management for recipes
 */

import { create } from 'zustand';
import { Recipe } from '@/types/Recipe';

interface RecipeState {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  isLoading: false,
  error: null,
  
  setRecipes: (recipes) => set({ recipes }),
  
  addRecipe: (recipe) => set((state) => ({
    recipes: [...state.recipes, recipe],
  })),
  
  updateRecipe: (id, updates) => set((state) => ({
    recipes: state.recipes.map((recipe) =>
      recipe.id === id ? { ...recipe, ...updates, updatedAt: new Date().toISOString() } : recipe
    ),
  })),
  
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((recipe) => recipe.id !== id),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

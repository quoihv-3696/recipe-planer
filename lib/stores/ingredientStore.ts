/**
 * Ingredient Store using Zustand
 * 
 * Global state management for ingredients
 */

import { create } from 'zustand';
import { Ingredient } from '@/types/Ingredient';

interface IngredientState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setIngredients: (ingredients: Ingredient[]) => void;
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: [],
  isLoading: false,
  error: null,
  
  setIngredients: (ingredients) => set({ ingredients }),
  
  addIngredient: (ingredient) => set((state) => ({
    ingredients: [...state.ingredients, ingredient],
  })),
  
  updateIngredient: (id, updates) => set((state) => ({
    ingredients: state.ingredients.map((ingredient) =>
      ingredient.id === id ? { ...ingredient, ...updates, updatedAt: new Date().toISOString() } : ingredient
    ),
  })),
  
  deleteIngredient: (id) => set((state) => ({
    ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

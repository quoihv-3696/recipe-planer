/**
 * useIngredients Hook
 * 
 * Custom hook for ingredient operations
 */

import { useEffect } from 'react';
import { useIngredientStore } from '@/lib/stores/ingredientStore';
import * as ingredientService from '@/lib/services/ingredientService';

export function useIngredients() {
  const { ingredients, isLoading, error, setIngredients, setLoading, setError } = useIngredientStore();
  
  // Load ingredients on mount
  useEffect(() => {
    loadIngredients();
  }, []);
  
  const loadIngredients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ingredientService.getAllIngredients();
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    ingredients,
    isLoading,
    error,
    reloadIngredients: loadIngredients,
  };
}

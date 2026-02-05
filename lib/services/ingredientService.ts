/**
 * Ingredient Service
 * 
 * Business logic for ingredient CRUD operations
 */

import * as indexedDB from '@/lib/storage/indexedDB';
import { Ingredient } from '@/types/Ingredient';

const INGREDIENT_PREFIX = indexedDB.KEY_PREFIXES.INGREDIENT;

/**
 * Get all ingredients from IndexedDB
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
  try {
    const ingredients = await indexedDB.getItemsByPrefix<Ingredient>(INGREDIENT_PREFIX);
    // Sort by name
    return ingredients.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
}

/**
 * Get a single ingredient by ID
 */
export async function getIngredientById(id: string): Promise<Ingredient | undefined> {
  try {
    const key = `${INGREDIENT_PREFIX}${id}`;
    return await indexedDB.getItem<Ingredient>(key);
  } catch (error) {
    console.error(`Error fetching ingredient ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new ingredient
 */
export async function createIngredient(ingredient: Ingredient): Promise<Ingredient> {
  try {
    const key = `${INGREDIENT_PREFIX}${ingredient.id}`;
    const success = await indexedDB.setItem(key, ingredient);
    if (!success) {
      throw new Error('Failed to create ingredient');
    }
    return ingredient;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
}

/**
 * Update an existing ingredient
 */
export async function updateIngredient(id: string, updates: Partial<Ingredient>): Promise<Ingredient> {
  try {
    const existing = await getIngredientById(id);
    if (!existing) {
      throw new Error(`Ingredient ${id} not found`);
    }
    
    const updated: Ingredient = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    const key = `${INGREDIENT_PREFIX}${id}`;
    const success = await indexedDB.setItem(key, updated);
    if (!success) {
      throw new Error('Failed to update ingredient');
    }
    
    return updated;
  } catch (error) {
    console.error(`Error updating ingredient ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an ingredient
 */
export async function deleteIngredient(id: string): Promise<boolean> {
  try {
    const key = `${INGREDIENT_PREFIX}${id}`;
    return await indexedDB.deleteItem(key);
  } catch (error) {
    console.error(`Error deleting ingredient ${id}:`, error);
    throw error;
  }
}

/**
 * Check if ingredient is used in any recipes
 */
export async function isIngredientUsedInRecipes(ingredientId: string): Promise<boolean> {
  try {
    const recipes = await indexedDB.getItemsByPrefix(indexedDB.KEY_PREFIXES.RECIPE);
    return recipes.some((recipe: any) => 
      recipe.ingredients?.some((ing: any) => ing.ingredientId === ingredientId)
    );
  } catch (error) {
    console.error('Error checking ingredient usage:', error);
    return false;
  }
}

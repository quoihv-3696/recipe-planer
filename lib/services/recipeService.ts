/**
 * Recipe Service
 * 
 * Business logic for recipe CRUD operations
 */

import * as indexedDB from '@/lib/storage/indexedDB';
import { Recipe } from '@/types/Recipe';

const RECIPE_PREFIX = indexedDB.KEY_PREFIXES.RECIPE;

/**
 * Get all recipes from IndexedDB
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const recipes = await indexedDB.getItemsByPrefix<Recipe>(RECIPE_PREFIX);
    // Sort by creation date (newest first)
    return recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  try {
    const key = `${RECIPE_PREFIX}${id}`;
    return await indexedDB.getItem<Recipe>(key);
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new recipe
 */
export async function createRecipe(recipe: Recipe): Promise<Recipe> {
  try {
    const key = `${RECIPE_PREFIX}${recipe.id}`;
    const success = await indexedDB.setItem(key, recipe);
    if (!success) {
      throw new Error('Failed to create recipe');
    }
    return recipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
  try {
    const existing = await getRecipeById(id);
    if (!existing) {
      throw new Error(`Recipe ${id} not found`);
    }
    
    const updated: Recipe = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    const key = `${RECIPE_PREFIX}${id}`;
    const success = await indexedDB.setItem(key, updated);
    if (!success) {
      throw new Error('Failed to update recipe');
    }
    
    return updated;
  } catch (error) {
    console.error(`Error updating recipe ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const key = `${RECIPE_PREFIX}${id}`;
    return await indexedDB.deleteItem(key);
  } catch (error) {
    console.error(`Error deleting recipe ${id}:`, error);
    throw error;
  }
}

/**
 * Search recipes by name or ingredient
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const allRecipes = await getAllRecipes();
    const lowercaseQuery = query.toLowerCase();
    
    return allRecipes.filter((recipe) => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in instructions
      if (recipe.instructions.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      return false;
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

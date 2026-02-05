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
 * Supports partial matching (fuzzy search)
 */
export async function searchRecipes(query: string, ingredients?: { id: string; name: string }[]): Promise<Recipe[]> {
  try {
    if (!query.trim()) {
      return await getAllRecipes();
    }
    
    const allRecipes = await getAllRecipes();
    const lowercaseQuery = query.toLowerCase().trim();
    
    return allRecipes.filter((recipe) => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in instructions
      if (recipe.instructions.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in ingredient names (if ingredient list provided)
      if (ingredients && ingredients.length > 0) {
        const recipeIngredientIds = recipe.ingredients.map(ing => ing.ingredientId);
        const matchingIngredients = ingredients.filter(ing => 
          recipeIngredientIds.includes(ing.id) && 
          ing.name.toLowerCase().includes(lowercaseQuery)
        );
        if (matchingIngredients.length > 0) {
          return true;
        }
      }
      
      return false;
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

/**
 * Get recipe usage statistics
 * Calculates how many times each recipe is used in meal plans
 */
export async function getRecipeUsageStats(): Promise<import('@/types/RecipeStats').RecipeUsageSummary> {
  try {
    const recipes = await getAllRecipes();
    const mealPlans = await indexedDB.getItemsByPrefix<import('@/types/MealPlan').MealPlan>(
      indexedDB.KEY_PREFIXES.MEAL_PLAN
    );
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const stats = recipes.map(recipe => {
      let weeklyCount = 0;
      let monthlyCount = 0;
      let lastUsedDate: string | null = null;
      
      // Count occurrences in meal plans
      mealPlans.forEach(plan => {
        plan.meals.forEach(meal => {
          const mealDate = new Date(meal.date);
          
          // Support both old format (recipeId) and new format (recipeIds)
          const recipeIds = Array.isArray((meal as any).recipeIds) 
            ? (meal as any).recipeIds 
            : [(meal as any).recipeId].filter(Boolean);
          
          if (recipeIds.includes(recipe.id)) {
            // Update last used date
            if (!lastUsedDate || meal.date > lastUsedDate) {
              lastUsedDate = meal.date;
            }
            
            // Count for weekly
            if (mealDate >= weekAgo) {
              weeklyCount++;
            }
            
            // Count for monthly
            if (mealDate >= monthAgo) {
              monthlyCount++;
            }
          }
        });
      });
      
      return {
        recipeId: recipe.id,
        recipeName: recipe.name,
        weeklyCount,
        monthlyCount,
        lastUsedDate,
      };
    });
    
    return {
      stats,
      calculatedAt: now.toISOString(),
    };
  } catch (error) {
    console.error('Error calculating recipe usage stats:', error);
    throw error;
  }
}

/**
 * Get usage count for a specific recipe in a time period
 */
export async function getUsageForRecipe(
  recipeId: string, 
  period: 'week' | 'month'
): Promise<number> {
  try {
    const mealPlans = await indexedDB.getItemsByPrefix<import('@/types/MealPlan').MealPlan>(
      indexedDB.KEY_PREFIXES.MEAL_PLAN
    );
    
    const now = new Date();
    const cutoffDate = period === 'week' 
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let count = 0;
    
    mealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        const mealDate = new Date(meal.date);
        if (mealDate >= cutoffDate) {
          // Support both old format (recipeId) and new format (recipeIds)
          const recipeIds = Array.isArray((meal as any).recipeIds) 
            ? (meal as any).recipeIds 
            : [(meal as any).recipeId].filter(Boolean);
          
          if (recipeIds.includes(recipeId)) {
            count++;
          }
        }
      });
    });
    
    return count;
  } catch (error) {
    console.error(`Error getting usage for recipe ${recipeId}:`, error);
    throw error;
  }
}

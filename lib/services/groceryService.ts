/**
 * Grocery Service
 * 
 * Business logic for grocery list management and generation from meal plans
 */

import * as indexedDB from '@/lib/storage/indexedDB';
import { GroceryList, GroceryItem, GroceryListStatus } from '@/types/GroceryList';
import { MealPlan } from '@/types/MealPlan';
import { Recipe } from '@/types/Recipe';
import { Ingredient } from '@/types/Ingredient';
import { format } from 'date-fns';

const GROCERY_LIST_PREFIX = indexedDB.KEY_PREFIXES.GROCERY_LIST;

/**
 * Get all grocery lists from IndexedDB
 */
async function getAllGroceryLists(): Promise<GroceryList[]> {
  try {
    const lists = await indexedDB.getItemsByPrefix<GroceryList>(GROCERY_LIST_PREFIX);
    // Sort by creation date (most recent first)
    return lists.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    console.error('Error fetching grocery lists:', error);
    throw error;
  }
}

/**
 * Get a single grocery list by ID
 */
async function getGroceryListById(id: string): Promise<GroceryList | undefined> {
  try {
    const key = `${GROCERY_LIST_PREFIX}${id}`;
    return await indexedDB.getItem<GroceryList>(key);
  } catch (error) {
    console.error(`Error fetching grocery list ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new grocery list
 */
async function createGroceryList(list: GroceryList): Promise<GroceryList> {
  try {
    const key = `${GROCERY_LIST_PREFIX}${list.id}`;
    const success = await indexedDB.setItem(key, list);
    if (!success) {
      throw new Error('Failed to create grocery list');
    }
    return list;
  } catch (error) {
    console.error('Error creating grocery list:', error);
    throw error;
  }
}

/**
 * Update an existing grocery list
 */
async function updateGroceryList(id: string, updates: Partial<GroceryList>): Promise<GroceryList> {
  try {
    const existing = await getGroceryListById(id);
    if (!existing) {
      throw new Error(`Grocery list ${id} not found`);
    }
    
    const updated = { ...existing, ...updates };
    const key = `${GROCERY_LIST_PREFIX}${id}`;
    const success = await indexedDB.setItem(key, updated);
    
    if (!success) {
      throw new Error('Failed to update grocery list');
    }
    
    return updated;
  } catch (error) {
    console.error(`Error updating grocery list ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a grocery list
 */
async function deleteGroceryList(id: string): Promise<void> {
  try {
    const key = `${GROCERY_LIST_PREFIX}${id}`;
    const success = await indexedDB.deleteItem(key);
    if (!success) {
      throw new Error('Failed to delete grocery list');
    }
  } catch (error) {
    console.error(`Error deleting grocery list ${id}:`, error);
    throw error;
  }
}

/**
 * Aggregate ingredients from recipes
 * Sum quantities for the same ingredient
 */
function aggregateIngredients(
  recipes: Recipe[],
  ingredients: Ingredient[]
): Map<string, { ingredient: Ingredient; totalQuantity: number }> {
  const aggregated = new Map<string, { ingredient: Ingredient; totalQuantity: number }>();
  const ingredientMap = new Map(ingredients.map(ing => [ing.id, ing]));
  
  for (const recipe of recipes) {
    for (const recipeIng of recipe.ingredients) {
      const ingredient = ingredientMap.get(recipeIng.ingredientId);
      if (!ingredient) continue;
      
      const existing = aggregated.get(recipeIng.ingredientId);
      if (existing) {
        existing.totalQuantity += recipeIng.quantity;
      } else {
        aggregated.set(recipeIng.ingredientId, {
          ingredient,
          totalQuantity: recipeIng.quantity,
        });
      }
    }
  }
  
  return aggregated;
}

/**
 * Calculate estimated cost from ingredient prices
 */
function calculateEstimatedCost(
  aggregatedIngredients: Map<string, { ingredient: Ingredient; totalQuantity: number }>
): number {
  let total = 0;
  
  for (const { ingredient, totalQuantity } of aggregatedIngredients.values()) {
    if (ingredient.unitPrice) {
      total += ingredient.unitPrice * totalQuantity;
    }
  }
  
  return total;
}

/**
 * Generate grocery list from meal plan
 */
async function generateFromMealPlan(
  mealPlan: MealPlan,
  recipes: Recipe[],
  ingredients: Ingredient[]
): Promise<GroceryList> {
  try {
    // Get recipes used in meal plan
    const recipeIds = new Set(mealPlan.meals.flatMap(m => m.recipeIds));
    const usedRecipes = recipes.filter(r => recipeIds.has(r.id));
    
    // Aggregate ingredients
    const aggregated = aggregateIngredients(usedRecipes, ingredients);
    
    // Create grocery items
    const items: GroceryItem[] = Array.from(aggregated.entries()).map(
      ([ingredientId, { ingredient, totalQuantity }]) => ({
        ingredientId,
        quantity: totalQuantity,
        unit: ingredient.quantityUnit || 'unit',
        estimatedPrice: ingredient.unitPrice ? ingredient.unitPrice * totalQuantity : 0,
      })
    );
    
    // Calculate total estimated cost
    const estimatedCost = calculateEstimatedCost(aggregated);
    
    // Create grocery list
    const groceryList: GroceryList = {
      id: `grocery-${Date.now()}`,
      mealPlanId: mealPlan.id,
      items,
      status: 'not_purchased' as GroceryListStatus,
      estimatedTotal: estimatedCost,
      actualCost: null,
      createdAt: new Date().toISOString(),
      purchaseDate: null,
    };
    
    return await createGroceryList(groceryList);
  } catch (error) {
    console.error('Error generating grocery list from meal plan:', error);
    throw error;
  }
}

/**
 * Mark grocery list as purchased with actual cost
 */
async function markAsPurchased(id: string, actualCost: number): Promise<GroceryList> {
  try {
    const list = await getGroceryListById(id);
    if (!list) {
      throw new Error(`Grocery list ${id} not found`);
    }
    
    const updates: Partial<GroceryList> = {
      status: 'purchased' as GroceryListStatus,
      actualCost,
      purchaseDate: new Date().toISOString(),
    };
    
    return await updateGroceryList(id, updates);
  } catch (error) {
    console.error(`Error marking grocery list ${id} as purchased:`, error);
    throw error;
  }
}

/**
 * Calculate spending statistics
 */
async function getSpendingStatistics(year: number, month?: number): Promise<{
  totalSpent: number;
  listCount: number;
  averagePerList: number;
}> {
  try {
    const allLists = await getAllGroceryLists();
    
    // Filter by year and optionally month
    const filteredLists = allLists.filter(list => {
      if (list.status !== 'purchased' || !list.purchaseDate) return false;
      
      const purchaseDate = new Date(list.purchaseDate);
      const purchaseYear = purchaseDate.getFullYear();
      const purchaseMonth = purchaseDate.getMonth() + 1;
      
      if (purchaseYear !== year) return false;
      if (month !== undefined && purchaseMonth !== month) return false;
      
      return true;
    });
    
    const totalSpent = filteredLists.reduce((sum, list) => sum + (list.actualCost || 0), 0);
    const listCount = filteredLists.length;
    const averagePerList = listCount > 0 ? totalSpent / listCount : 0;
    
    return {
      totalSpent,
      listCount,
      averagePerList,
    };
  } catch (error) {
    console.error('Error calculating spending statistics:', error);
    throw error;
  }
}

/**
 * Grocery Service Object
 */
export const groceryService = {
  getAllGroceryLists,
  getGroceryListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
  generateFromMealPlan,
  markAsPurchased,
  getSpendingStatistics,
};

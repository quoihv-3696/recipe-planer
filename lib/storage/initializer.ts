/**
 * Storage Initializer
 * 
 * Hydrates mock data into IndexedDB on first application load
 */

import * as localStorage from './localStorage';
import * as indexedDB from './indexedDB';
import { mockRecipes } from '@/data/mockRecipes';
import { mockIngredients } from '@/data/mockIngredients';
import { mockMealPlans } from '@/data/mockMealPlans';

const INITIALIZED_KEY = localStorage.STORAGE_KEYS.INITIALIZED;

/**
 * Check if data has been initialized
 */
export function isInitialized(): boolean {
  return localStorage.getItem<boolean>(INITIALIZED_KEY) === true;
}

/**
 * Mark data as initialized
 */
function markAsInitialized(): void {
  localStorage.setItem(INITIALIZED_KEY, true);
}

/**
 * Initialize mock data in IndexedDB
 * Only runs once on first load
 */
export async function initializeData(): Promise<void> {
  // Skip if already initialized
  if (isInitialized()) {
    console.log('Data already initialized, skipping...');
    return;
  }

  console.log('Initializing data for the first time...');

  try {
    // Initialize recipes
    console.log(`Loading ${mockRecipes.length} recipes...`);
    await Promise.all(
      mockRecipes.map((recipe) =>
        indexedDB.setItem(`${indexedDB.KEY_PREFIXES.RECIPE}${recipe.id}`, recipe)
      )
    );

    // Initialize ingredients
    console.log(`Loading ${mockIngredients.length} ingredients...`);
    await Promise.all(
      mockIngredients.map((ingredient) =>
        indexedDB.setItem(`${indexedDB.KEY_PREFIXES.INGREDIENT}${ingredient.id}`, ingredient)
      )
    );

    // Initialize meal plans
    console.log(`Loading ${mockMealPlans.length} meal plans...`);
    await Promise.all(
      mockMealPlans.map((mealPlan) =>
        indexedDB.setItem(`${indexedDB.KEY_PREFIXES.MEAL_PLAN}${mealPlan.id}`, mealPlan)
      )
    );

    // Mark as initialized
    markAsInitialized();
    console.log('Data initialization complete!');
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}

/**
 * Reset data to mock defaults
 * Clears all data and re-initializes
 */
export async function resetToDefaults(): Promise<void> {
  console.log('Resetting data to defaults...');
  
  try {
    // Clear all IndexedDB data
    await indexedDB.clearAll();
    
    // Clear localStorage (except theme and preferences if desired)
    localStorage.removeItem(INITIALIZED_KEY);
    
    // Re-initialize
    await initializeData();
    
    console.log('Data reset complete!');
  } catch (error) {
    console.error('Error resetting data:', error);
    throw error;
  }
}

/**
 * Export all data for backup
 */
export async function exportAllData(): Promise<string> {
  try {
    const recipes = await indexedDB.getItemsByPrefix(indexedDB.KEY_PREFIXES.RECIPE);
    const ingredients = await indexedDB.getItemsByPrefix(indexedDB.KEY_PREFIXES.INGREDIENT);
    const mealPlans = await indexedDB.getItemsByPrefix(indexedDB.KEY_PREFIXES.MEAL_PLAN);
    const groceryLists = await indexedDB.getItemsByPrefix(indexedDB.KEY_PREFIXES.GROCERY_LIST);

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        recipes,
        ingredients,
        mealPlans,
        groceryLists,
      },
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Import data from backup
 * @param jsonString - JSON string containing exported data
 */
export async function importData(jsonString: string): Promise<void> {
  try {
    const importData = JSON.parse(jsonString);
    
    if (!importData.version || !importData.data) {
      throw new Error('Invalid import data format');
    }

    console.log('Importing data...');

    // Clear existing data
    await indexedDB.clearAll();

    // Import recipes
    if (importData.data.recipes) {
      await Promise.all(
        importData.data.recipes.map((recipe: any) =>
          indexedDB.setItem(`${indexedDB.KEY_PREFIXES.RECIPE}${recipe.id}`, recipe)
        )
      );
    }

    // Import ingredients
    if (importData.data.ingredients) {
      await Promise.all(
        importData.data.ingredients.map((ingredient: any) =>
          indexedDB.setItem(`${indexedDB.KEY_PREFIXES.INGREDIENT}${ingredient.id}`, ingredient)
        )
      );
    }

    // Import meal plans
    if (importData.data.mealPlans) {
      await Promise.all(
        importData.data.mealPlans.map((mealPlan: any) =>
          indexedDB.setItem(`${indexedDB.KEY_PREFIXES.MEAL_PLAN}${mealPlan.id}`, mealPlan)
        )
      );
    }

    // Import grocery lists
    if (importData.data.groceryLists) {
      await Promise.all(
        importData.data.groceryLists.map((groceryList: any) =>
          indexedDB.setItem(`${indexedDB.KEY_PREFIXES.GROCERY_LIST}${groceryList.id}`, groceryList)
        )
      );
    }

    markAsInitialized();
    console.log('Data import complete!');
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}

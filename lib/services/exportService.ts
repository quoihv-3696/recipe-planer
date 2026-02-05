/**
 * Export Service
 * 
 * Data export/import for backup and restore functionality
 */

import * as indexedDB from '@/lib/storage/indexedDB';
import { Recipe } from '@/types/Recipe';
import { Ingredient } from '@/types/Ingredient';
import { MealPlan } from '@/types/MealPlan';
import { GroceryList } from '@/types/GroceryList';
import { seedDatabase } from '@/lib/utils/seedDatabase';

interface ExportData {
  version: string;
  exportDate: string;
  recipes: Recipe[];
  ingredients: Ingredient[];
  mealPlans: MealPlan[];
  groceryLists: GroceryList[];
}

/**
 * Export all data to JSON
 */
export async function exportAllData(): Promise<string> {
  try {
    // Get all data from IndexedDB
    const recipes = await indexedDB.getItemsByPrefix<Recipe>(indexedDB.KEY_PREFIXES.RECIPE);
    const ingredients = await indexedDB.getItemsByPrefix<Ingredient>(indexedDB.KEY_PREFIXES.INGREDIENT);
    const mealPlans = await indexedDB.getItemsByPrefix<MealPlan>(indexedDB.KEY_PREFIXES.MEAL_PLAN);
    const groceryLists = await indexedDB.getItemsByPrefix<GroceryList>(indexedDB.KEY_PREFIXES.GROCERY_LIST);
    
    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      recipes,
      ingredients,
      mealPlans,
      groceryLists,
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
}

/**
 * Download exported data as JSON file
 */
export function downloadExportedData(jsonData: string, filename?: string) {
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || `recipe-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate imported data structure
 */
function validateImportData(data: any): data is ExportData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check required fields
  if (!data.version || !data.exportDate) {
    return false;
  }
  
  // Check arrays exist
  if (!Array.isArray(data.recipes) || 
      !Array.isArray(data.ingredients) || 
      !Array.isArray(data.mealPlans) || 
      !Array.isArray(data.groceryLists)) {
    return false;
  }
  
  return true;
}

/**
 * Import data from JSON
 */
export async function importData(jsonData: string): Promise<{
  success: boolean;
  message: string;
  stats?: {
    recipes: number;
    ingredients: number;
    mealPlans: number;
    groceryLists: number;
  };
}> {
  try {
    // Parse JSON
    let data: any;
    try {
      data = JSON.parse(jsonData);
    } catch (e) {
      return {
        success: false,
        message: 'Invalid JSON format. Please check your file.',
      };
    }
    
    // Validate structure
    if (!validateImportData(data)) {
      return {
        success: false,
        message: 'Invalid data structure. Please use a valid backup file.',
      };
    }
    
    // Clear existing data
    await clearAllData();
    
    // Import recipes
    for (const recipe of data.recipes) {
      const key = `${indexedDB.KEY_PREFIXES.RECIPE}${recipe.id}`;
      await indexedDB.setItem(key, recipe);
    }
    
    // Import ingredients
    for (const ingredient of data.ingredients) {
      const key = `${indexedDB.KEY_PREFIXES.INGREDIENT}${ingredient.id}`;
      await indexedDB.setItem(key, ingredient);
    }
    
    // Import meal plans
    for (const mealPlan of data.mealPlans) {
      const key = `${indexedDB.KEY_PREFIXES.MEAL_PLAN}${mealPlan.id}`;
      await indexedDB.setItem(key, mealPlan);
    }
    
    // Import grocery lists
    for (const groceryList of data.groceryLists) {
      const key = `${indexedDB.KEY_PREFIXES.GROCERY_LIST}${groceryList.id}`;
      await indexedDB.setItem(key, groceryList);
    }
    
    return {
      success: true,
      message: 'Data imported successfully!',
      stats: {
        recipes: data.recipes.length,
        ingredients: data.ingredients.length,
        mealPlans: data.mealPlans.length,
        groceryLists: data.groceryLists.length,
      },
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return {
      success: false,
      message: 'Failed to import data. Please try again.',
    };
  }
}

/**
 * Clear all data from IndexedDB
 */
async function clearAllData(): Promise<void> {
  try {
    // Get all keys
    const allKeys = await indexedDB.getAllKeys();
    
    // Delete all items (filter to string keys only)
    for (const key of allKeys) {
      if (typeof key === 'string') {
        await indexedDB.deleteItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}

/**
 * Reset to default mock data
 */
export async function resetToDefaultData(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Clear all existing data
    await clearAllData();
    
    // Re-seed with mock data
    const result = await seedDatabase();
    
    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error('Error resetting to default data:', error);
    return {
      success: false,
      message: 'Failed to reset data. Please try again.',
    };
  }
}

/**
 * Export service object
 */
export const exportService = {
  exportAllData,
  downloadExportedData,
  importData,
  resetToDefaultData,
};

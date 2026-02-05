/**
 * Database Seeder
 * 
 * Utility to populate IndexedDB with initial mock data
 */

import { mockIngredients } from '@/data/mockIngredients';
import { mockRecipes } from '@/data/mockRecipes';
import * as ingredientService from '@/lib/services/ingredientService';
import * as recipeService from '@/lib/services/recipeService';

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const existingIngredients = await ingredientService.getAllIngredients();
    const existingRecipes = await recipeService.getAllRecipes();
    
    if (existingIngredients.length > 0 || existingRecipes.length > 0) {
      console.log('Database already contains data. Skipping seed.');
      return {
        success: true,
        message: 'Database already seeded',
        ingredientsCount: existingIngredients.length,
        recipesCount: existingRecipes.length
      };
    }
    
    // Seed ingredients first
    console.log('Seeding ingredients...');
    for (const ingredient of mockIngredients) {
      await ingredientService.createIngredient(ingredient);
    }
    
    // Seed recipes
    console.log('Seeding recipes...');
    for (const recipe of mockRecipes) {
      await recipeService.createRecipe(recipe);
    }
    
    console.log('Database seeding completed successfully');
    return {
      success: true,
      message: 'Database seeded successfully',
      ingredientsCount: mockIngredients.length,
      recipesCount: mockRecipes.length
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to seed database',
      ingredientsCount: 0,
      recipesCount: 0
    };
  }
}

export async function clearDatabase() {
  try {
    const ingredients = await ingredientService.getAllIngredients();
    const recipes = await recipeService.getAllRecipes();
    
    // Delete all recipes
    for (const recipe of recipes) {
      await recipeService.deleteRecipe(recipe.id);
    }
    
    // Delete all ingredients
    for (const ingredient of ingredients) {
      await ingredientService.deleteIngredient(ingredient.id);
    }
    
    console.log('Database cleared successfully');
    return {
      success: true,
      message: 'Database cleared successfully',
      deletedIngredients: ingredients.length,
      deletedRecipes: recipes.length
    };
  } catch (error) {
    console.error('Error clearing database:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear database'
    };
  }
}

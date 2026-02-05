/**
 * Recipe Entity Contract
 * 
 * Represents a cooking recipe with ingredients, instructions, and nutritional information.
 * Stored in IndexedDB with key prefix 'recipe:'
 */

export interface Recipe {
  /** Unique identifier (UUID v4) */
  id: string;
  
  /** Recipe name/title (1-100 characters) */
  name: string;
  
  /** URL to recipe image (optional, must be valid URL) */
  imageUrl?: string;
  
  /** List of ingredients with quantities required for this recipe */
  ingredients: RecipeIngredient[];
  
  /** Cooking instructions (1-5000 characters, supports Markdown) */
  instructions: string;
  
  /** Total caloric value (optional, >= 0) */
  totalCalories?: number;
  
  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;
  
  /** Last update timestamp (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Ingredient reference within a recipe
 * Links to Ingredient entity with specific quantity for this recipe
 */
export interface RecipeIngredient {
  /** Reference to Ingredient entity ID */
  ingredientId: string;
  
  /** Amount needed for recipe (must be > 0) */
  quantity: number;
  
  /** Unit of measurement (e.g., "grams", "cups", "pieces", "tablespoons") */
  unit: string;
}

/**
 * Type guard to check if an object is a valid Recipe
 */
export function isRecipe(obj: any): obj is Recipe {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.ingredients) &&
    typeof obj.instructions === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
}

/**
 * Create a new Recipe with default values
 */
export function createRecipe(partial: Partial<Recipe> & Pick<Recipe, 'name' | 'instructions'>): Recipe {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    imageUrl: undefined,
    ingredients: [],
    totalCalories: undefined,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

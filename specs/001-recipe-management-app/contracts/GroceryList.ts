/**
 * GroceryList Entity Contract
 * 
 * Shopping list generated from meal plans with purchase tracking.
 * Stored in IndexedDB with key prefix 'grocery-list:'
 */

export interface GroceryList {
  /** Unique identifier (UUID v4) */
  id: string;
  
  /** Reference to source MealPlan ID */
  mealPlanId: string;
  
  /** List of ingredients to purchase (can be empty array) */
  items: GroceryItem[];
  
  /** Total estimated cost (calculated from items, must be >= 0) */
  estimatedTotal: number;
  
  /** Purchase status */
  status: GroceryListStatus;
  
  /** Actual amount spent (null if not purchased, must be >= 0 when set) */
  actualCost: number | null;
  
  /** Date of purchase (null if not purchased, ISO 8601 format) */
  purchaseDate: string | null;
  
  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;
}

/**
 * Individual item in a grocery list
 */
export interface GroceryItem {
  /** Reference to Ingredient entity ID */
  ingredientId: string;
  
  /** Total quantity needed (aggregated from all recipes in meal plan) */
  quantity: number;
  
  /** Unit of measurement */
  unit: string;
  
  /** Estimated cost for this item (quantity × ingredient unit price) */
  estimatedPrice: number;
}

/**
 * Enum for grocery list purchase status
 */
export type GroceryListStatus = 'not_purchased' | 'purchased';

/**
 * Helper to get all valid statuses
 */
export const GROCERY_LIST_STATUSES: GroceryListStatus[] = ['not_purchased', 'purchased'];

/**
 * Type guard to check if a string is a valid GroceryListStatus
 */
export function isGroceryListStatus(value: string): value is GroceryListStatus {
  return GROCERY_LIST_STATUSES.includes(value as GroceryListStatus);
}

/**
 * Type guard to check if an object is a valid GroceryList
 */
export function isGroceryList(obj: any): obj is GroceryList {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.mealPlanId === 'string' &&
    Array.isArray(obj.items) &&
    typeof obj.estimatedTotal === 'number' &&
    obj.estimatedTotal >= 0 &&
    isGroceryListStatus(obj.status) &&
    typeof obj.createdAt === 'string'
  );
}

/**
 * Create a new GroceryList with default values
 */
export function createGroceryList(
  partial: Partial<GroceryList> & Pick<GroceryList, 'mealPlanId'>
): GroceryList {
  return {
    id: crypto.randomUUID(),
    items: [],
    estimatedTotal: 0,
    status: 'not_purchased',
    actualCost: null,
    purchaseDate: null,
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

/**
 * Mark grocery list as purchased with actual cost
 */
export function markAsPurchased(groceryList: GroceryList, actualCost: number): GroceryList {
  return {
    ...groceryList,
    status: 'purchased',
    actualCost,
    purchaseDate: new Date().toISOString(),
  };
}

/**
 * Calculate estimated total from grocery items
 */
export function calculateEstimatedTotal(items: GroceryItem[]): number {
  return items.reduce((total, item) => total + item.estimatedPrice, 0);
}

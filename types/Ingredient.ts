/**
 * Ingredient Entity
 * 
 * Represents an inventory item with pricing and quantity tracking.
 * Stored in IndexedDB with key prefix 'ingredient:'
 */

export interface Ingredient {
  /** Unique identifier (UUID v4) */
  id: string;
  
  /** Ingredient name (1-100 characters) */
  name: string;
  
  /** Notes or details about ingredient (optional, 0-500 characters) */
  description?: string;
  
  /** Price per unit (must be >= 0) */
  unitPrice: number;
  
  /** Unit for pricing (e.g., "per kg", "per item", "per bunch") */
  priceUnit: string;
  
  /** Current inventory quantity (optional, >= 0) */
  remainingQuantity?: number;
  
  /** Unit for quantity (e.g., "kg", "items", "liters", "bunches") */
  quantityUnit?: string;
  
  /** Creation timestamp (ISO 8601 format) */
  createdAt: string;
  
  /** Last update timestamp (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Type guard to check if an object is a valid Ingredient
 */
export function isIngredient(obj: any): obj is Ingredient {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.unitPrice === 'number' &&
    obj.unitPrice >= 0 &&
    typeof obj.priceUnit === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
}

/**
 * Create a new Ingredient with default values
 */
export function createIngredient(
  partial: Partial<Ingredient> & Pick<Ingredient, 'name' | 'unitPrice' | 'priceUnit'>
): Ingredient {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    description: undefined,
    remainingQuantity: undefined,
    quantityUnit: undefined,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

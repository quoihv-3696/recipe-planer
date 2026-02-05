/**
 * Validators
 * 
 * Input validation utilities for forms and data integrity
 */

/**
 * Validate recipe name
 * @param name - The recipe name to validate
 * @returns Error message or null if valid
 */
export function validateRecipeName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Recipe name is required';
  }
  if (name.length > 100) {
    return 'Recipe name must be 100 characters or less';
  }
  return null;
}

/**
 * Validate recipe instructions
 * @param instructions - The instructions to validate
 * @returns Error message or null if valid
 */
export function validateInstructions(instructions: string): string | null {
  if (!instructions || instructions.trim().length === 0) {
    return 'Instructions are required';
  }
  if (instructions.length > 5000) {
    return 'Instructions must be 5000 characters or less';
  }
  return null;
}

/**
 * Validate ingredient name
 * @param name - The ingredient name to validate
 * @returns Error message or null if valid
 */
export function validateIngredientName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Ingredient name is required';
  }
  if (name.length > 100) {
    return 'Ingredient name must be 100 characters or less';
  }
  return null;
}

/**
 * Validate price value
 * @param price - The price to validate
 * @returns Error message or null if valid
 */
export function validatePrice(price: number): string | null {
  if (isNaN(price)) {
    return 'Price must be a valid number';
  }
  if (price < 0) {
    return 'Price must be greater than or equal to 0';
  }
  return null;
}

/**
 * Validate quantity value
 * @param quantity - The quantity to validate
 * @returns Error message or null if valid
 */
export function validateQuantity(quantity: number): string | null {
  if (isNaN(quantity)) {
    return 'Quantity must be a valid number';
  }
  if (quantity <= 0) {
    return 'Quantity must be greater than 0';
  }
  return null;
}

/**
 * Validate URL string
 * @param url - The URL to validate
 * @returns Error message or null if valid
 */
export function validateUrl(url: string): string | null {
  if (!url || url.trim().length === 0) {
    return null; // URL is optional
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
}

/**
 * Validate date range (end date must be >= start date)
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Error message or null if valid
 */
export function validateDateRange(startDate: string, endDate: string): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    return 'Invalid start date';
  }
  if (isNaN(end.getTime())) {
    return 'Invalid end date';
  }
  if (end < start) {
    return 'End date must be on or after start date';
  }
  return null;
}

/**
 * Validate meal plan name
 * @param name - The meal plan name to validate
 * @returns Error message or null if valid
 */
export function validateMealPlanName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Meal plan name is required';
  }
  if (name.length > 100) {
    return 'Meal plan name must be 100 characters or less';
  }
  return null;
}

/**
 * Sanitize string input (trim and remove extra whitespace)
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Check if a value is a positive number
 * @param value - The value to check
 * @returns True if valid positive number
 */
export function isPositiveNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

/**
 * Check if a value is a non-negative number
 * @param value - The value to check
 * @returns True if valid non-negative number
 */
export function isNonNegativeNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

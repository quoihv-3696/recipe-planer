/**
 * localStorage Wrapper
 * 
 * Provides type-safe wrapper around browser localStorage with error handling
 */

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme',
  LAST_VIEWED_RECIPE: 'last-viewed-recipe',
  INITIALIZED: 'data-initialized',
} as const;

/**
 * Get item from localStorage
 * @param key - Storage key
 * @returns Parsed value or null if not found/error
 */
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Set item in localStorage
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns True if successful, false otherwise
 */
export function setItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (key: ${key}):`, error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
    }
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param key - Storage key
 * @returns True if successful, false otherwise
 */
export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 * @returns True if successful, false otherwise
 */
export function clear(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 * @returns True if localStorage is available and working
 */
export function isAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all keys from localStorage
 * @returns Array of all keys
 */
export function getAllKeys(): string[] {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
}

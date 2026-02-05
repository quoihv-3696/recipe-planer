/**
 * IndexedDB Wrapper using idb-keyval
 * 
 * Provides CRUD operations for storing large datasets (recipes, ingredients, meal plans, grocery lists)
 */

import { get, set, del, keys, clear, entries } from 'idb-keyval';

/**
 * Storage key prefixes for different entity types
 */
export const KEY_PREFIXES = {
  RECIPE: 'recipe:',
  INGREDIENT: 'ingredient:',
  MEAL_PLAN: 'meal-plan:',
  GROCERY_LIST: 'grocery-list:',
} as const;

/**
 * Get item from IndexedDB
 * @param key - Storage key (with or without prefix)
 * @returns Promise resolving to value or undefined if not found
 */
export async function getItem<T>(key: string): Promise<T | undefined> {
  try {
    return await get<T>(key);
  } catch (error) {
    console.error(`Error reading from IndexedDB (key: ${key}):`, error);
    return undefined;
  }
}

/**
 * Set item in IndexedDB
 * @param key - Storage key (should include appropriate prefix)
 * @param value - Value to store
 * @returns Promise resolving to true if successful
 */
export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await set(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing to IndexedDB (key: ${key}):`, error);
    return false;
  }
}

/**
 * Delete item from IndexedDB
 * @param key - Storage key
 * @returns Promise resolving to true if successful
 */
export async function deleteItem(key: string): Promise<boolean> {
  try {
    await del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting from IndexedDB (key: ${key}):`, error);
    return false;
  }
}

/**
 * Get all keys from IndexedDB
 * @returns Promise resolving to array of all keys
 */
export async function getAllKeys(): Promise<IDBValidKey[]> {
  try {
    return await keys();
  } catch (error) {
    console.error('Error getting IndexedDB keys:', error);
    return [];
  }
}

/**
 * Get all keys with a specific prefix
 * @param prefix - Key prefix to filter by
 * @returns Promise resolving to array of matching keys
 */
export async function getKeysByPrefix(prefix: string): Promise<string[]> {
  try {
    const allKeys = await getAllKeys();
    return allKeys
      .filter((key): key is string => typeof key === 'string')
      .filter((key) => key.startsWith(prefix));
  } catch (error) {
    console.error(`Error getting keys by prefix (${prefix}):`, error);
    return [];
  }
}

/**
 * Get all items with a specific prefix
 * @param prefix - Key prefix to filter by
 * @returns Promise resolving to array of items
 */
export async function getItemsByPrefix<T>(prefix: string): Promise<T[]> {
  try {
    const matchingKeys = await getKeysByPrefix(prefix);
    const items = await Promise.all(matchingKeys.map((key) => getItem<T>(key)));
    const filteredItems: T[] = [];
    for (const item of items) {
      if (item !== undefined) {
        filteredItems.push(item);
      }
    }
    return filteredItems;
  } catch (error) {
    console.error(`Error getting items by prefix (${prefix}):`, error);
    return [];
  }
}

/**
 * Get all entries (key-value pairs) from IndexedDB
 * @returns Promise resolving to array of [key, value] tuples
 */
export async function getAllEntries<T>(): Promise<[IDBValidKey, T][]> {
  try {
    const result = await entries();
    return result as [IDBValidKey, T][];
  } catch (error) {
    console.error('Error getting IndexedDB entries:', error);
    return [];
  }
}

/**
 * Clear all data from IndexedDB
 * @returns Promise resolving to true if successful
 */
export async function clearAll(): Promise<boolean> {
  try {
    await clear();
    return true;
  } catch (error) {
    console.error('Error clearing IndexedDB:', error);
    return false;
  }
}

/**
 * Clear all items with a specific prefix
 * @param prefix - Key prefix to filter by
 * @returns Promise resolving to true if successful
 */
export async function clearByPrefix(prefix: string): Promise<boolean> {
  try {
    const matchingKeys = await getKeysByPrefix(prefix);
    await Promise.all(matchingKeys.map((key) => deleteItem(key)));
    return true;
  } catch (error) {
    console.error(`Error clearing items by prefix (${prefix}):`, error);
    return false;
  }
}

/**
 * Check if IndexedDB is available
 * @returns Promise resolving to true if IndexedDB is available and working
 */
export async function isAvailable(): Promise<boolean> {
  try {
    const testKey = '__idb_test__';
    await set(testKey, 'test');
    await del(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * useGrocery Hook
 * 
 * Custom hook for grocery list operations with auto-loading
 */

import { useEffect } from 'react';
import { useGroceryStore } from '@/lib/stores/groceryStore';
import { groceryService } from '@/lib/services/groceryService';

export function useGrocery() {
  const {
    groceryLists,
    currentListId,
    isLoading,
    error,
    setGroceryLists,
    setCurrentList,
    setLoading,
    setError,
  } = useGroceryStore();
  
  // Load grocery lists on mount
  useEffect(() => {
    loadGroceryLists();
  }, []);
  
  const loadGroceryLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const lists = await groceryService.getAllGroceryLists();
      setGroceryLists(lists);
      
      // Set first list as current if none selected
      if (!currentListId && lists.length > 0) {
        setCurrentList(lists[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grocery lists');
    } finally {
      setLoading(false);
    }
  };
  
  // Get current list
  const currentList = groceryLists.find((list) => list.id === currentListId);
  
  return {
    groceryLists,
    currentList,
    currentListId,
    isLoading,
    error,
    setCurrentList,
    reloadGroceryLists: loadGroceryLists,
  };
}

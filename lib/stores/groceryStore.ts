/**
 * Grocery Store
 * 
 * Zustand store for grocery list state management
 */

import { create } from 'zustand';
import { GroceryList } from '@/types/GroceryList';

interface GroceryStore {
  groceryLists: GroceryList[];
  currentListId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGroceryLists: (lists: GroceryList[]) => void;
  setCurrentList: (id: string | null) => void;
  addGroceryList: (list: GroceryList) => void;
  updateGroceryList: (id: string, updates: Partial<GroceryList>) => void;
  deleteGroceryList: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGroceryStore = create<GroceryStore>((set) => ({
  groceryLists: [],
  currentListId: null,
  isLoading: false,
  error: null,
  
  setGroceryLists: (lists) => set({ groceryLists: lists }),
  
  setCurrentList: (id) => set({ currentListId: id }),
  
  addGroceryList: (list) =>
    set((state) => ({
      groceryLists: [list, ...state.groceryLists],
    })),
  
  updateGroceryList: (id, updates) =>
    set((state) => ({
      groceryLists: state.groceryLists.map((list) =>
        list.id === id ? { ...list, ...updates } : list
      ),
    })),
  
  deleteGroceryList: (id) =>
    set((state) => ({
      groceryLists: state.groceryLists.filter((list) => list.id !== id),
      currentListId: state.currentListId === id ? null : state.currentListId,
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

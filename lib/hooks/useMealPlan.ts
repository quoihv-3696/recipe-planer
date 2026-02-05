/**
 * useMealPlan Hook
 * 
 * Custom hook for meal plan operations
 */

import { useEffect } from 'react';
import { useMealPlanStore } from '@/lib/stores/mealPlanStore';
import * as mealPlanService from '@/lib/services/mealPlanService';

export function useMealPlan() {
  const {
    mealPlans,
    currentPlanId,
    isLoading,
    error,
    setMealPlans,
    setCurrentPlan,
    setLoading,
    setError,
  } = useMealPlanStore();
  
  // Load meal plans on mount
  useEffect(() => {
    loadMealPlans();
  }, []);
  
  const loadMealPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mealPlanService.getAllMealPlans();
      setMealPlans(data);
      
      // Set current plan to the most recent one if none selected
      if (!currentPlanId && data.length > 0) {
        setCurrentPlan(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };
  
  const currentPlan = mealPlans.find(plan => plan.id === currentPlanId);
  
  return {
    mealPlans,
    currentPlan,
    currentPlanId,
    isLoading,
    error,
    setCurrentPlan,
    reloadMealPlans: loadMealPlans,
  };
}

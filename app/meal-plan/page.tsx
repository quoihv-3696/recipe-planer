/**
 * Meal Plan Page
 * 
 * Weekly meal planning interface
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMealPlan } from '@/lib/hooks/useMealPlan';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { useIngredients } from '@/lib/hooks/useIngredients';
import { WeeklyCalendar } from '@/components/meal-plan/WeeklyCalendar';
import { RecipeSearch } from '@/components/meal-plan/RecipeSearch';
import { GroceryListOptions } from '@/components/grocery/GroceryListOptions';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { mealPlanService } from '@/lib/services/mealPlanService';
import { groceryService } from '@/lib/services/groceryService';
import { Recipe } from '@/types/Recipe';
import { MealType } from '@/types/MealPlan';
import { format, parseISO, addWeeks, subWeeks } from 'date-fns';

export default function MealPlanPage() {
  const router = useRouter();
  const { mealPlans, currentPlan, isLoading: planLoading, reloadMealPlans } = useMealPlan();
  const { recipes, isLoading: recipesLoading } = useRecipes();
  const { ingredients, isLoading: ingredientsLoading } = useIngredients();
  
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; mealType: MealType } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGroceryOptionsOpen, setIsGroceryOptionsOpen] = useState(false);
  const [purchasedDates, setPurchasedDates] = useState<string[]>([]);
  
  // Generate current week dates
  const weekDates = mealPlanService.generateWeekDates(weekStart);
  
  // Find meal plan for current week
  const weekMealPlan = currentPlan || mealPlans[0] || null;
  
  // Load purchased dates when meal plan changes
  useEffect(() => {
    if (weekMealPlan) {
      const { useMealPlanStore } = require('@/lib/stores/mealPlanStore');
      const dates = useMealPlanStore.getState().getPurchasedDates(weekMealPlan.id);
      setPurchasedDates(dates);
    }
  }, [weekMealPlan]);
  
  // Week navigation
  const handlePreviousWeek = () => {
    setWeekStart(prev => subWeeks(prev, 1));
  };
  
  const handleNextWeek = () => {
    setWeekStart(prev => addWeeks(prev, 1));
  };
  
  // Meal slot interaction
  const handleMealSlotClick = (date: string, mealType: MealType) => {
    setSelectedSlot({ date, mealType });
    setIsSearchOpen(true);
  };
  
  const handleRecipeSelect = async (recipe: Recipe) => {
    if (!selectedSlot || !weekMealPlan) return;
    
    try {
      await mealPlanService.addMealAssignment(
        weekMealPlan.id,
        {
          date: selectedSlot.date,
          mealType: selectedSlot.mealType,
          recipeIds: [recipe.id] // Will be appended to existing recipes
        }
      );
      await reloadMealPlans();
      // Keep modal open so user can add another recipe
      // setIsSearchOpen(false); // Commented out to keep modal open
      // setSelectedSlot(null); // Keep slot selected
      alert(`${recipe.name} added! Add another recipe or close this dialog.`);
    } catch (error) {
      console.error('Failed to assign recipe:', error);
      alert('Failed to assign recipe. Please try again.');
    }
  };
  
  const handleRemoveMeal = async (date: string, mealType: MealType, recipeId: string) => {
    if (!weekMealPlan) return;
    
    if (!confirm('Remove this recipe from the meal slot?')) return;
    
    try {
      await mealPlanService.removeRecipeFromSlot(weekMealPlan.id, date, mealType, recipeId);
      await reloadMealPlans();
    } catch (error) {
      console.error('Failed to remove recipe:', error);
      alert('Failed to remove recipe. Please try again.');
    }
  };
  
  const handleGenerateGroceryList = async () => {
    if (!weekMealPlan) {
      alert('No meal plan available for this week');
      return;
    }
    
    if (weekMealPlan.meals.length === 0) {
      alert('Please add some meals to your plan before generating a grocery list');
      return;
    }
    
    // Open the grocery list options modal
    setIsGroceryOptionsOpen(true);
  };
  
  const handleGenerateList = async (
    generationType: 'daily' | 'weekly' | 'full',
    startDate: string,
    endDate?: string
  ) => {
    if (!weekMealPlan) return;
    
    try {
      // Get purchased dates from store
      const { useMealPlanStore } = await import('@/lib/stores/mealPlanStore');
      const purchasedDates = useMealPlanStore.getState().getPurchasedDates(weekMealPlan.id);
      
      if (generationType === 'daily') {
        await groceryService.generateDailyList(
          weekMealPlan,
          startDate,
          recipes,
          ingredients,
          purchasedDates
        );
      } else if (generationType === 'weekly' && endDate) {
        await groceryService.generateWeeklyList(
          weekMealPlan,
          startDate,
          endDate,
          recipes,
          ingredients,
          purchasedDates
        );
      } else {
        // Full meal plan
        await groceryService.generateFromMealPlan(weekMealPlan, recipes, ingredients);
      }
      
      setIsGroceryOptionsOpen(false);
      alert('Grocery list generated successfully!');
      router.push('/grocery-list');
    } catch (error) {
      console.error('Failed to generate grocery list:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate grocery list. Please try again.');
    }
  };
  
  const loading = planLoading || recipesLoading || ingredientsLoading;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading meal plans...</p>
      </div>
    );
  }
  
  if (!weekMealPlan) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <EmptyState
          icon="📅"
          title="No meal plan available"
          description="Create your first meal plan to get started with meal planning"
          action={{
            label: 'Create Meal Plan',
            onClick: () => alert('Meal plan creation coming soon!')
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meal Plan</h1>
            <p className="text-gray-600 mt-1">
              Week of {format(parseISO(weekDates[0]), 'MMM d')} - {format(parseISO(weekDates[6]), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={handleGenerateGroceryList}
            >
              📝 Generate Grocery List
            </Button>
          </div>
        </div>
      </div>
      
      {/* Week Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handlePreviousWeek}
        >
          ← Previous Week
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => setWeekStart(new Date())}
        >
          Today
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleNextWeek}
        >
          Next Week →
        </Button>
      </div>
      
      {/* Weekly Calendar */}
      <div className="max-w-7xl mx-auto">
        <WeeklyCalendar
          mealPlan={weekMealPlan}
          recipes={recipes}
          weekDates={weekDates}
          purchasedDates={purchasedDates}
          onMealSlotClick={handleMealSlotClick}
          onRemoveMeal={handleRemoveMeal}
        />
      </div>
      
      {/* Recipe Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSelectedSlot(null);
        }}
        title={`Select Recipe for ${selectedSlot?.mealType || ''}`}
      >
        <RecipeSearch
          recipes={recipes}
          onSelect={handleRecipeSelect}
          onCancel={() => {
            setIsSearchOpen(false);
            setSelectedSlot(null);
          }}
        />
      </Modal>
      
      {/* Grocery List Options Modal */}
      <Modal
        isOpen={isGroceryOptionsOpen}
        onClose={() => setIsGroceryOptionsOpen(false)}
        title="Generate Grocery List"
      >
        <GroceryListOptions
          onGenerate={handleGenerateList}
          onCancel={() => setIsGroceryOptionsOpen(false)}
          defaultDate={format(new Date(), 'yyyy-MM-dd')}
        />
      </Modal>
    </div>
  );
}

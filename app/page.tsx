/**
 * Home Page
 * 
 * Landing page with recipe list and today's meal plan
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { useMealPlan } from '@/lib/hooks/useMealPlan';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/common/Button';
import { seedDatabase } from '@/lib/utils/seedDatabase';
import type { RecipeUsageSummary } from '@/types/RecipeStats';

export default function HomePage() {
  const router = useRouter();
  const { recipes, isLoading: recipesLoading, getUsageStats } = useRecipes();
  const { mealPlans, isLoading: plansLoading } = useMealPlan();
  const [isSeeding, setIsSeeding] = useState(false);
  const [usageStats, setUsageStats] = useState<RecipeUsageSummary | null>(null);
  
  // Show latest 6 recipes
  const latestRecipes = recipes.slice(0, 6);
  
  // Load usage stats when recipes are available
  useEffect(() => {
    if (recipes.length > 0) {
      loadUsageStats();
    }
  }, [recipes.length, mealPlans.length]); // Reload when recipes or meal plans change
  
  const loadUsageStats = async () => {
    const stats = await getUsageStats();
    if (stats) {
      setUsageStats(stats);
    }
  };
  
  const getRecipeUsage = (recipeId: string) => {
    if (!usageStats) return { weekly: 0, monthly: 0 };
    const stat = usageStats.stats.find(s => s.recipeId === recipeId);
    return {
      weekly: stat?.weeklyCount || 0,
      monthly: stat?.monthlyCount || 0,
    };
  };
  
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      alert(result.message);
      window.location.reload(); // Reload to show seeded data
    } catch (err) {
      alert('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };
  
  const loading = recipesLoading || plansLoading;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Recipe Planner
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Organize your recipes, plan meals, and manage your grocery lists all in one place
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => router.push('/recipes')} size="lg">
            Browse Recipes
          </Button>
          <Button onClick={() => router.push('/meal-plan')} variant="secondary" size="lg">
            Plan Your Meals
          </Button>
          {/* Development helper - seed initial data */}
          {recipes.length === 0 && !loading && (
            <Button
              onClick={handleSeedDatabase}
              variant="ghost"
              size="sm"
              disabled={isSeeding}
            >
              {isSeeding ? 'Loading sample data...' : '📦 Load Sample Data'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 mt-12">
        {/* Today's Meal Plan Sidebar - Mobile: Top, Desktop: Right */}
        <div className="lg:hidden">
          {!loading && (
            <Sidebar mealPlans={mealPlans} recipes={recipes} />
          )}
        </div>
        
        {/* Center Column - Recipe List */}
        <div className="flex-1">
          {!loading && latestRecipes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Recipes</h2>
                <Button
                  onClick={() => router.push('/recipes')}
                  variant="ghost"
                  size="sm"
                >
                  View All →
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestRecipes.map((recipe) => {
                  const usage = getRecipeUsage(recipe.id);
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={(id) => router.push(`/recipes/detail?id=${id}`)}
                      weeklyUsage={usage.weekly}
                      monthlyUsage={usage.monthly}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
        </div>
        
        {/* Today's Meal Plan Sidebar - Desktop: Right Column */}
        <div className="hidden lg:block lg:w-96 flex-shrink-0">
          {!loading && (
            <div className="sticky top-8">
              <Sidebar mealPlans={mealPlans} recipes={recipes} />
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipe Collection</h3>
          <p className="text-gray-600">
            Store and organize all your favorite recipes in one place
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Meal Planning</h3>
          <p className="text-gray-600">
            Plan your weekly meals and stay organized
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Grocery Lists</h3>
          <p className="text-gray-600">
            Generate shopping lists from your meal plans automatically
          </p>
        </div>
      </div>
    </div>
  );
}

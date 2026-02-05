/**
 * Home Page
 * 
 * Landing page with recipe list preview
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Button } from '@/components/common/Button';
import { seedDatabase } from '@/lib/utils/seedDatabase';

export default function HomePage() {
  const router = useRouter();
  const { recipes, isLoading } = useRecipes();
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Show latest 6 recipes
  const latestRecipes = recipes.slice(0, 6);
  
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
          {recipes.length === 0 && !isLoading && (
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
      
      {/* Latest Recipes Section */}
      {!isLoading && latestRecipes.length > 0 && (
        <div className="mt-12">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={(id) => router.push(`/recipes/detail?id=${id}`)}
              />
            ))}
          </div>
        </div>
      )}
      
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

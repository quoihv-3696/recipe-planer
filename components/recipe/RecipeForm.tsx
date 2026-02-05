/**
 * RecipeForm Component
 * 
 * Form for creating/editing recipes
 */

'use client';

import { useState, useEffect } from 'react';
import { Recipe, RecipeIngredient } from '@/types/Recipe';
import { Ingredient } from '@/types/Ingredient';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useIngredients } from '@/lib/hooks/useIngredients';

export interface RecipeFormProps {
  recipe?: Recipe; // If provided, form is in edit mode
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface RecipeFormData {
  name: string;
  instructions: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
}

export function RecipeForm({
  recipe,
  onSubmit,
  onCancel,
  isSubmitting = false
}: RecipeFormProps) {
  // Load ingredients from store
  const { ingredients } = useIngredients();
  
  // Form state
  const [name, setName] = useState(recipe?.name || '');
  const [instructions, setInstructions] = useState(recipe?.instructions || '');
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl || '');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(recipe?.ingredients || []);
  
  // Ingredient selection state
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset form if recipe changes
  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setInstructions(recipe.instructions);
      setImageUrl(recipe.imageUrl || '');
      setRecipeIngredients(recipe.ingredients || []);
    }
  }, [recipe]);
  
  // Add ingredient to recipe
  const handleAddIngredient = () => {
    if (!selectedIngredientId) {
      setErrors({ ...errors, ingredient: 'Please select an ingredient' });
      return;
    }
    
    if (!quantity || parseFloat(quantity) <= 0) {
      setErrors({ ...errors, quantity: 'Please enter a valid quantity' });
      return;
    }
    
    if (!unit) {
      setErrors({ ...errors, unit: 'Please enter a unit' });
      return;
    }
    
    // Check if ingredient already added
    if (recipeIngredients.some(ri => ri.ingredientId === selectedIngredientId)) {
      setErrors({ ...errors, ingredient: 'This ingredient is already added' });
      return;
    }
    
    const newIngredient: RecipeIngredient = {
      ingredientId: selectedIngredientId,
      quantity: parseFloat(quantity),
      unit: unit
    };
    
    setRecipeIngredients([...recipeIngredients, newIngredient]);
    
    // Reset ingredient selection
    setSelectedIngredientId('');
    setQuantity('');
    setUnit('');
    setErrors({});
  };
  
  // Remove ingredient from recipe
  const handleRemoveIngredient = (ingredientId: string) => {
    setRecipeIngredients(recipeIngredients.filter(ri => ri.ingredientId !== ingredientId));
  };
  
  // Get ingredient name by ID
  const getIngredientName = (id: string): string => {
    return ingredients.find(ing => ing.id === id)?.name || 'Unknown';
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Recipe name is required';
    }
    
    if (!instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    if (recipeIngredients.length === 0) {
      newErrors.ingredients = 'Please add at least one ingredient';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData: RecipeFormData = {
      name: name.trim(),
      instructions: instructions.trim(),
      imageUrl: imageUrl.trim() || undefined,
      ingredients: recipeIngredients
    };
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recipe Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Name *
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Spaghetti Carbonara"
          error={errors.name}
          disabled={isSubmitting}
        />
      </div>
      
      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (optional)
        </label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Instructions */}
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
          Instructions *
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step-by-step cooking instructions..."
          rows={6}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.instructions ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.instructions && (
          <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>
        )}
      </div>
      
      {/* Ingredient Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients *
        </label>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Add Ingredient Form */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <select
                value={selectedIngredientId}
                onChange={(e) => setSelectedIngredientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Select ingredient...</option>
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-3">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="sm:col-span-2">
              <Input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unit *"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="sm:col-span-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddIngredient}
                disabled={isSubmitting}
                className="w-full"
              >
                Add
              </Button>
            </div>
          </div>
          
          {errors.ingredient && (
            <p className="text-sm text-red-600">{errors.ingredient}</p>
          )}
          {errors.quantity && (
            <p className="text-sm text-red-600">{errors.quantity}</p>
          )}
          {errors.unit && (
            <p className="text-sm text-red-600">{errors.unit}</p>
          )}
          
          {/* Ingredients List */}
          {recipeIngredients.length > 0 && (
            <div className="space-y-2">
              {recipeIngredients.map((ri) => (
                <div
                  key={ri.ingredientId}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {getIngredientName(ri.ingredientId)}
                    </span>
                    <span className="text-gray-600 ml-2">
                      - {ri.quantity} {ri.unit || ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ri.ingredientId)}
                    className="text-red-600 hover:text-red-700 ml-2"
                    disabled={isSubmitting}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {errors.ingredients && (
            <p className="text-sm text-red-600">{errors.ingredients}</p>
          )}
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  );
}

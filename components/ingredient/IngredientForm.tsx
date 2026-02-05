/**
 * IngredientForm Component
 * 
 * Form for creating and editing ingredients
 */

'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/types/Ingredient';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export interface IngredientFormProps {
  ingredient?: Ingredient | null;
  onSubmit: (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function IngredientForm({ ingredient, onSubmit, onCancel }: IngredientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    priceUnit: '',
    remainingQuantity: '',
    quantityUnit: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Populate form when editing
  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        description: ingredient.description || '',
        unitPrice: ingredient.unitPrice.toString(),
        priceUnit: ingredient.priceUnit,
        remainingQuantity: ingredient.remainingQuantity?.toString() || '',
        quantityUnit: ingredient.quantityUnit || '',
      });
    }
  }, [ingredient]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const price = parseFloat(formData.unitPrice);
    if (!formData.unitPrice || isNaN(price) || price < 0) {
      newErrors.unitPrice = 'Valid price is required';
    }
    
    if (!formData.priceUnit.trim()) {
      newErrors.priceUnit = 'Price unit is required';
    }
    
    const quantity = parseFloat(formData.remainingQuantity);
    if (!formData.remainingQuantity || isNaN(quantity) || quantity < 0) {
      newErrors.remainingQuantity = 'Valid quantity is required';
    }
    
    if (!formData.quantityUnit.trim()) {
      newErrors.quantityUnit = 'Quantity unit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      unitPrice: parseFloat(formData.unitPrice),
      priceUnit: formData.priceUnit.trim(),
      remainingQuantity: parseFloat(formData.remainingQuantity),
      quantityUnit: formData.quantityUnit.trim(),
    });
  };
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="e.g., Tomatoes"
        />
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description"
        />
      </div>
      
      {/* Price Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Price *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.unitPrice}
            onChange={(e) => handleChange('unitPrice', e.target.value)}
            error={errors.unitPrice}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Unit *
          </label>
          <Input
            value={formData.priceUnit}
            onChange={(e) => handleChange('priceUnit', e.target.value)}
            error={errors.priceUnit}
            placeholder="e.g., per kg"
          />
        </div>
      </div>
      
      {/* Quantity Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.remainingQuantity}
            onChange={(e) => handleChange('remainingQuantity', e.target.value)}
            error={errors.remainingQuantity}
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity Unit *
          </label>
          <Input
            value={formData.quantityUnit}
            onChange={(e) => handleChange('quantityUnit', e.target.value)}
            error={errors.quantityUnit}
            placeholder="e.g., kg, pieces"
          />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {ingredient ? 'Update Ingredient' : 'Add Ingredient'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}

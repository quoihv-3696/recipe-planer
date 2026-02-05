/**
 * IngredientCard Component
 * 
 * Card displaying ingredient in list view
 */

'use client';

import { Ingredient } from '@/types/Ingredient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatPrice } from '@/lib/utils/formatters';

export interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
}

export function IngredientCard({ ingredient, onEdit, onDelete }: IngredientCardProps) {
  return (
    <Card className="h-full !p-0">
      <div className="flex flex-col h-full">
        {/* Ingredient Icon */}
        <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <span className="text-5xl">🥘</span>
        </div>
        
        {/* Ingredient Info */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {ingredient.name}
          </h3>
          
          {ingredient.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {ingredient.description}
            </p>
          )}
          
          <div className="mt-auto space-y-2">
            {/* Price */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium text-gray-900">
                {formatPrice(ingredient.unitPrice)} {ingredient.priceUnit}
              </span>
            </div>
            
            {/* Quantity */}
            {ingredient.remainingQuantity !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-gray-900">
                  {ingredient.remainingQuantity} {ingredient.quantityUnit}
                </span>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(ingredient)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(ingredient.id)}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

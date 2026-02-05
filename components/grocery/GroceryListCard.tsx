/**
 * GroceryListCard Component
 * 
 * Display grocery list card with items and status
 */

import { GroceryList } from '@/types/GroceryList';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatPrice } from '@/lib/utils/formatters';
import { format, parseISO } from 'date-fns';

export interface GroceryListCardProps {
  groceryList: GroceryList;
  onClick: () => void;
  onMarkPurchased: () => void;
  onDelete: () => void;
}

export function GroceryListCard({
  groceryList,
  onClick,
  onMarkPurchased,
  onDelete,
}: GroceryListCardProps) {
  const isPurchased = groceryList.status === 'purchased';
  
  // Generate list name based on generation type
  const getListName = () => {
    if (groceryList.generationType === 'daily') {
      return `Daily List - ${format(parseISO(groceryList.targetDates[0]), 'MMM d, yyyy')}`;
    } else if (groceryList.generationType === 'weekly') {
      const startDate = format(parseISO(groceryList.targetDates[0]), 'MMM d');
      const endDate = format(parseISO(groceryList.targetDates[groceryList.targetDates.length - 1]), 'MMM d, yyyy');
      return `Weekly List - ${startDate} to ${endDate}`;
    }
    return `Full Meal Plan - ${format(parseISO(groceryList.generatedDate || groceryList.createdAt), 'MMM d, yyyy')}`;
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{getListName()}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Generated {format(parseISO(groceryList.generatedDate || groceryList.createdAt), 'MMM d, yyyy')}
            </p>
            {groceryList.targetDates && groceryList.targetDates.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                For meals on: {groceryList.targetDates.length === 1 
                  ? format(parseISO(groceryList.targetDates[0]), 'MMM d, yyyy')
                  : `${groceryList.targetDates.length} days`}
              </p>
            )}
          </div>
          
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPurchased
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {isPurchased ? '✓ Purchased' : 'Not Purchased'}
          </span>
        </div>
        
        {/* Items Summary */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>📝 {groceryList.items.length} items</span>
          {isPurchased && groceryList.purchaseDate && (
            <span>
              Purchased {format(parseISO(groceryList.purchaseDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
        
        {/* Cost Information */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(groceryList.estimatedTotal)}
              </p>
            </div>
            
            {isPurchased && groceryList.actualCost !== null && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Actual Cost</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice(groceryList.actualCost)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {!isPurchased && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkPurchased();
              }}
            >
              Mark as Purchased
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

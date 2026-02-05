/**
 * Grocery List Page
 * 
 * Manage grocery lists with purchase tracking and spending statistics
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGrocery } from '@/lib/hooks/useGrocery';
import { useIngredients } from '@/lib/hooks/useIngredients';
import { GroceryListCard } from '@/components/grocery/GroceryListCard';
import { SpendingStats } from '@/components/grocery/SpendingStats';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';
import { groceryService } from '@/lib/services/groceryService';
import { GroceryList } from '@/types/GroceryList';
import { format, parseISO } from 'date-fns';

export default function GroceryListPage() {
  const router = useRouter();
  const { groceryLists, isLoading, reloadGroceryLists } = useGrocery();
  const { ingredients } = useIngredients();
  
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actualCost, setActualCost] = useState('');
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(new Date().getMonth() + 1);
  
  const handleMarkPurchased = (list: GroceryList) => {
    setSelectedList(list);
    setActualCost(list.estimatedTotal.toFixed(2));
    setIsPurchaseModalOpen(true);
  };
  
  const handleConfirmPurchase = async () => {
    if (!selectedList) return;
    
    const cost = parseFloat(actualCost);
    if (isNaN(cost) || cost < 0) {
      alert('Please enter a valid cost');
      return;
    }
    
    try {
      await groceryService.markAsPurchased(selectedList.id, cost, selectedList.mealPlanId);
      await reloadGroceryLists();
      setIsPurchaseModalOpen(false);
      setSelectedList(null);
      setActualCost('');
    } catch (error) {
      console.error('Error marking as purchased:', error);
      alert('Failed to mark as purchased. Please try again.');
    }
  };
  
  const handleViewDetail = (list: GroceryList) => {
    setSelectedList(list);
    setIsDetailModalOpen(true);
  };
  
  const handleDelete = async (list: GroceryList) => {
    const listName = `Grocery List - ${format(parseISO(list.createdAt), 'MMM d, yyyy')}`;
    if (!confirm(`Delete "${listName}"?`)) return;
    
    try {
      await groceryService.deleteGroceryList(list.id);
      await reloadGroceryLists();
    } catch (error) {
      console.error('Error deleting grocery list:', error);
      alert('Failed to delete grocery list. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading grocery lists...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grocery Lists</h1>
          <p className="text-gray-600">
            Track your grocery shopping and spending
          </p>
        </div>
        
        {/* Spending Statistics */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Year</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2026, month - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <SpendingStats year={selectedYear} month={selectedMonth} />
        </div>
        
        {/* Grocery Lists */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Lists</h2>
          
          {groceryLists.length === 0 ? (
            <EmptyState
              icon="🛒"
              title="No grocery lists yet"
              description="Generate a grocery list from your meal plan to get started"
              action={{
                label: 'Go to Meal Plan',
                onClick: () => router.push('/meal-plan')
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groceryLists.map((list) => (
                <GroceryListCard
                  key={list.id}
                  groceryList={list}
                  onClick={() => handleViewDetail(list)}
                  onMarkPurchased={() => handleMarkPurchased(list)}
                  onDelete={() => handleDelete(list)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Purchase Modal */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedList(null);
          setActualCost('');
        }}
        title="Mark as Purchased"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Enter the actual cost you spent on this grocery list:
          </p>
          
          <Input
            type="number"
            value={actualCost}
            onChange={(e) => setActualCost(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            autoFocus
          />
          
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsPurchaseModalOpen(false);
                setSelectedList(null);
                setActualCost('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase}>
              Confirm Purchase
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedList(null);
        }}
        title={selectedList ? `Grocery List - ${format(parseISO(selectedList.createdAt), 'MMM d, yyyy')}` : 'Grocery List'}
      >
        {selectedList && (
          <div className="space-y-4">
            {/* List Info */}
            <div className="border-b border-gray-200 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {selectedList.generationType === 'daily' ? 'Daily' : 
                   selectedList.generationType === 'weekly' ? 'Weekly' : 'Full Plan'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                Generated: {format(parseISO(selectedList.generatedDate || selectedList.createdAt), 'MMM d, yyyy')}
              </div>
              
              {selectedList.targetDates && selectedList.targetDates.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">For meals on:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedList.targetDates.map(date => (
                      <span key={date} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {format(parseISO(date), 'MMM d')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                {selectedList.items.length} items
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {selectedList.items.map((item, index) => {
                const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{ingredient?.name || 'Unknown ingredient'}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${item.estimatedPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>
                  ${(selectedList.actualCost || selectedList.estimatedTotal).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

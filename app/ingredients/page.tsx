/**
 * Ingredients Page
 * 
 * List and manage ingredients
 */

'use client';

import { useState } from 'react';
import { useIngredients } from '@/lib/hooks/useIngredients';
import { useIngredientStore } from '@/lib/stores/ingredientStore';
import { Ingredient } from '@/types/Ingredient';
import { IngredientCard } from '@/components/ingredient/IngredientCard';
import { IngredientForm } from '@/components/ingredient/IngredientForm';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import * as ingredientService from '@/lib/services/ingredientService';
import { generateId } from '@/lib/utils/uuid';

export default function IngredientsPage() {
  const { ingredients, isLoading, reloadIngredients } = useIngredients();
  const { addIngredient, updateIngredient, deleteIngredient } = useIngredientStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deletingIngredientId, setDeletingIngredientId] = useState<string | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  
  const handleAddClick = () => {
    setEditingIngredient(null);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = async (id: string) => {
    // Check if ingredient is used in recipes
    const isUsed = await ingredientService.isIngredientUsedInRecipes(id);
    
    if (isUsed) {
      setDeleteWarning('This ingredient is used in one or more recipes. Deleting it may affect those recipes.');
    } else {
      setDeleteWarning(null);
    }
    
    setDeletingIngredientId(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleFormSubmit = async (data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingIngredient) {
        // Update existing ingredient
        const updated = await ingredientService.updateIngredient(editingIngredient.id, data);
        updateIngredient(editingIngredient.id, updated);
        alert('Ingredient updated successfully!');
      } else {
        // Create new ingredient
        const newIngredient: Ingredient = {
          ...data,
          id: `ing-${generateId()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await ingredientService.createIngredient(newIngredient);
        addIngredient(newIngredient);
        alert('Ingredient added successfully!');
      }
      
      setIsFormOpen(false);
      setEditingIngredient(null);
      await reloadIngredients();
    } catch (error) {
      alert('Failed to save ingredient');
      console.error(error);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!deletingIngredientId) return;
    
    try {
      await ingredientService.deleteIngredient(deletingIngredientId);
      deleteIngredient(deletingIngredientId);
      alert('Ingredient deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeletingIngredientId(null);
      setDeleteWarning(null);
      await reloadIngredients();
    } catch (error) {
      alert('Failed to delete ingredient');
      console.error(error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">Loading ingredients...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ingredients</h1>
          <p className="text-gray-600 mt-2">
            Manage your ingredient inventory
          </p>
        </div>
        <Button onClick={handleAddClick} size="lg">
          + Add Ingredient
        </Button>
      </div>
      
      {/* Ingredients Grid */}
      {ingredients.length === 0 ? (
        <EmptyState
          icon="🥘"
          title="No Ingredients Yet"
          description="Start building your ingredient inventory"
          action={{
            label: 'Add First Ingredient',
            onClick: handleAddClick,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingIngredient(null);
        }}
        title={editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
        size="lg"
      >
        <IngredientForm
          ingredient={editingIngredient}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingIngredient(null);
          }}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingIngredientId(null);
          setDeleteWarning(null);
        }}
        title="Delete Ingredient"
        size="sm"
      >
        <div className="space-y-4">
          {deleteWarning && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">⚠️ {deleteWarning}</p>
            </div>
          )}
          
          <p className="text-gray-700">
            Are you sure you want to delete this ingredient? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDeleteConfirm} className="flex-1">
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingIngredientId(null);
                setDeleteWarning(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

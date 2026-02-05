/**
 * GroceryListOptions Component
 * 
 * Modal UI for selecting grocery list generation type (Daily/Weekly)
 * with date pickers
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { format } from 'date-fns';

export interface GroceryListOptionsProps {
  onGenerate: (type: 'daily' | 'weekly', startDate: string, endDate?: string) => void;
  onCancel: () => void;
  defaultDate?: string;
}

export function GroceryListOptions({ 
  onGenerate, 
  onCancel,
  defaultDate = format(new Date(), 'yyyy-MM-dd')
}: GroceryListOptionsProps) {
  const [generationType, setGenerationType] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);

  const handleGenerate = () => {
    if (generationType === 'daily') {
      onGenerate('daily', selectedDate);
    } else {
      // Validate date range
      if (startDate > endDate) {
        alert('End date must be after start date');
        return;
      }
      onGenerate('weekly', startDate, endDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Generation Type
        </label>
        <div className="space-y-2">
          {/* Daily Option */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
            generationType === 'daily' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200'
          }">
            <input
              type="radio"
              name="generationType"
              value="daily"
              checked={generationType === 'daily'}
              onChange={(e) => setGenerationType(e.target.value as 'daily')}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="font-semibold text-gray-900">Daily List</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Generate grocery list for a single day
              </p>
            </div>
          </label>

          {/* Weekly Option */}
          <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
            generationType === 'weekly' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200'
          }`}>
            <input
              type="radio"
              name="generationType"
              value="weekly"
              checked={generationType === 'weekly'}
              onChange={(e) => setGenerationType(e.target.value as 'weekly')}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">📆</span>
                <span className="font-semibold text-gray-900">Weekly List</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Generate grocery list for a date range (up to 7 days)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Date Picker(s) */}
      <div>
        {generationType === 'daily' ? (
          <div>
            <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <Input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full"
              />
            </div>
            {startDate && endDate && (
              <p className="text-sm text-gray-600">
                📊 Generating list for {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} day(s)
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleGenerate}
        >
          Generate List
        </Button>
      </div>
    </div>
  );
}

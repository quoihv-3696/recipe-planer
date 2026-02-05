/**
 * SpendingStats Component
 * 
 * Display spending statistics with monthly/yearly breakdown
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatPrice } from '@/lib/utils/formatters';
import { groceryService } from '@/lib/services/groceryService';

export interface SpendingStatsProps {
  year: number;
  month?: number;
}

export function SpendingStats({ year, month }: SpendingStatsProps) {
  const [stats, setStats] = useState<{
    totalSpent: number;
    listCount: number;
    averagePerList: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, [year, month]);
  
  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await groceryService.getSpendingStatistics(year, month);
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-600">
          Loading statistics...
        </div>
      </Card>
    );
  }
  
  if (!stats) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-600">
          Failed to load statistics
        </div>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {month ? `${getMonthName(month)} ${year}` : year} Spending
          </h2>
          <span className="text-2xl">📊</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Spent */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(stats.totalSpent)}
            </p>
          </div>
          
          {/* Number of Lists */}
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Grocery Trips</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.listCount}
            </p>
          </div>
          
          {/* Average per List */}
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Average per Trip</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatPrice(stats.averagePerList)}
            </p>
          </div>
        </div>
        
        {stats.listCount === 0 && (
          <div className="text-center py-4 text-gray-500">
            No purchases recorded for this period
          </div>
        )}
      </div>
    </Card>
  );
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}

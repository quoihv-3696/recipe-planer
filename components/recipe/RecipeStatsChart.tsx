'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RecipeUsageSummary } from '@/types/RecipeStats';

interface RecipeStatsChartProps {
  usageStats: RecipeUsageSummary | null;
}

type TimePeriod = 'week' | 'month';

export default function RecipeStatsChart({ usageStats }: RecipeStatsChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  if (!usageStats || usageStats.stats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📊 Recipe Usage Statistics
        </h2>
        <p className="text-gray-500 text-center py-8">
          No recipe usage data available yet. Start planning meals to see statistics.
        </p>
      </div>
    );
  }

  // Prepare chart data based on selected time period
  const chartData = usageStats.stats
    .map(stat => ({
      name: stat.recipeName.length > 20 
        ? stat.recipeName.substring(0, 20) + '...' 
        : stat.recipeName,
      fullName: stat.recipeName,
      count: timePeriod === 'week' ? stat.weeklyCount : stat.monthlyCount,
      recipeId: stat.recipeId,
    }))
    .filter(item => item.count > 0) // Only show recipes with usage
    .sort((a, b) => b.count - a.count) // Sort by usage count descending
    .slice(0, 10); // Show top 10 recipes

  // Custom tooltip to show full recipe name
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {payload[0].value} {payload[0].value === 1 ? 'time' : 'times'} this {timePeriod}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      {/* Header with title and period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-0">
          📊 Recipe Usage Statistics
        </h2>
        
        {/* Time period selector */}
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            onClick={() => setTimePeriod('week')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timePeriod === 'week'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimePeriod('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timePeriod === 'month'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="w-full" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{ value: 'Times Used', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={timePeriod === 'week' ? '#3b82f6' : '#10b981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No recipes used in the selected time period.
        </p>
      )}

      {/* Summary info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing top {chartData.length} recipes used in the last{' '}
          {timePeriod === 'week' ? '7 days' : '30 days'}.
          {chartData.length === 10 && ' (Limited to top 10)'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Last updated: {new Date(usageStats.calculatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

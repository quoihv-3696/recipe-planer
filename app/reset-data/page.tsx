/**
 * Database Reset Page
 * Only available in development mode
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { resetData } from '@/scripts/reset-data';

export default function ResetPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!confirm('Are you sure you want to delete all data and create new sample data?')) {
      return;
    }

    setIsResetting(true);
    setMessage('Resetting database...');

    try {
      await resetData();
      setMessage('✅ Database reset complete! Redirecting to home...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error resetting database:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🗑️ Reset Database
        </h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> This will delete all existing data including:
          </p>
          <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
            <li>All ingredients</li>
            <li>All recipes</li>
            <li>All meal plans</li>
            <li>All grocery lists</li>
          </ul>
          <p className="text-sm text-yellow-800 mt-2">
            New sample data will be created after deletion.
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-800' 
              : message.includes('❌')
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        <Button
          onClick={handleReset}
          disabled={isResetting}
          variant="danger"
          className="w-full"
        >
          {isResetting ? 'Resetting...' : 'Reset Database & Create Sample Data'}
        </Button>

        <Button
          onClick={() => window.location.href = '/'}
          variant="secondary"
          className="w-full mt-3"
        >
          Cancel & Go Home
        </Button>
      </div>
    </div>
  );
}

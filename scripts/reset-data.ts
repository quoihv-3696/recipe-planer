/**
 * Reset and seed database with fresh data
 * This script clears all IndexedDB data and creates new sample data
 */

import { resetToDefaults } from '@/lib/storage/initializer';

async function resetData() {
  console.log('🗑️  Resetting data to defaults...');
  
  try {
    await resetToDefaults();
    console.log('🎉 Database reset complete! The page will reload...');
    
    // Reload page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

// Run if executed directly
if (typeof window !== 'undefined') {
  resetData().catch((error) => {
    console.error('❌ Error:', error);
  });
}

export { resetData };

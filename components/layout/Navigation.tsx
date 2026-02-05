/**
 * Navigation Component
 * 
 * Main navigation bar for desktop
 */

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { exportService } from '@/lib/services/exportService';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/ingredients', label: 'Ingredients' },
  { href: '/meal-plan', label: 'Meal Plan' },
  { href: '/grocery-list', label: 'Grocery List' },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  const handleExport = async () => {
    try {
      const jsonData = await exportService.exportAllData();
      exportService.downloadExportedData(jsonData);
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const result = await exportService.importData(text);
      
      if (result.success) {
        alert(`${result.message}\n\nImported:\n- ${result.stats?.recipes || 0} recipes\n- ${result.stats?.ingredients || 0} ingredients\n- ${result.stats?.mealPlans || 0} meal plans\n- ${result.stats?.groceryLists || 0} grocery lists`);
        router.refresh();
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check your file.');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all data? This will delete everything and restore default sample data.')) {
      return;
    }
    
    try {
      const result = await exportService.resetToDefaultData();
      if (result.success) {
        alert(result.message);
        router.refresh();
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Failed to reset data. Please try again.');
    }
  };
  
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>
      
      <nav className="bg-white border-b border-gray-200" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">🍳</span>
              <span className="ml-2 text-xl font-semibold text-gray-900">Recipe Planner</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Data Management Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ⚙️ Data
              </button>
              
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => {
                        handleExport();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📥 Export Data
                    </button>
                    <button
                      onClick={() => {
                        handleImportClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      📤 Import Data
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        handleReset();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🔄 Reset to Default
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Hidden file input for import */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
              aria-label="Import data file"
            />
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

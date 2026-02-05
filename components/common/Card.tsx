/**
 * Card Component
 * 
 * Reusable card container with optional header and footer
 */

import { ReactNode } from 'react';

export interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Card header */
  header?: ReactNode;
  /** Card footer */
  footer?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Hover effect */
  hoverable?: boolean;
}

export function Card({
  children,
  header,
  footer,
  className = '',
  onClick,
  hoverable = false,
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
  const hoverStyles = hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  const combinedClassName = `${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`.trim();
  
  return (
    <div className={combinedClassName} onClick={onClick}>
      {header && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          {header}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}

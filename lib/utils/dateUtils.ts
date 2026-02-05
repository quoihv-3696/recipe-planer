/**
 * Date Utilities
 * 
 * Wrappers around date-fns functions for consistent date handling
 */

import { 
  format, 
  parseISO, 
  startOfWeek, 
  endOfWeek, 
  addDays,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay
} from 'date-fns';

/**
 * Format a date to ISO 8601 date string (YYYY-MM-DD)
 */
export function formatToISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format a date to ISO 8601 datetime string
 */
export function formatToISO(date: Date): string {
  return date.toISOString();
}

/**
 * Parse an ISO 8601 string to Date
 */
export function parseISOString(isoString: string): Date {
  return parseISO(isoString);
}

/**
 * Format a date for display (e.g., "Feb 5, 2026")
 */
export function formatForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Format a date for display with day name (e.g., "Monday, Feb 5")
 */
export function formatWithDay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'EEEE, MMM d');
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday = 1
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 }); // Monday = 1
}

/**
 * Generate an array of dates for the current week
 */
export function getCurrentWeekDates(): Date[] {
  const start = getWeekStart();
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Generate an array of ISO date strings for a week range
 */
export function getWeekDateStrings(startDate: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => formatToISODate(addDays(startDate, i)));
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
}

/**
 * Check if a date falls within a date range (inclusive)
 */
export function isDateInRange(date: Date | string, startDate: Date | string, endDate: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return isWithinInterval(dateObj, { start: startOfDay(start), end: endOfDay(end) });
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getTodayISOString(): string {
  return formatToISODate(new Date());
}

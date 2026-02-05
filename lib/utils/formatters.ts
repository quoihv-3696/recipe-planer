/**
 * Formatters
 * 
 * Utility functions for formatting prices, quantities, and other display values
 */

/**
 * Format a price value for display (e.g., "$12.50")
 * @param price - The price value
 * @param currency - Currency symbol (default: "$")
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = '$'): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format a quantity with unit (e.g., "2.5 kg", "3 items")
 * @param quantity - The quantity value
 * @param unit - The unit string
 * @returns Formatted quantity string
 */
export function formatQuantity(quantity: number, unit: string): string {
  // Remove decimal if it's a whole number
  const formattedQty = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2);
  return `${formattedQty} ${unit}`;
}

/**
 * Format calories (e.g., "350 cal")
 * @param calories - The calorie value
 * @returns Formatted calorie string
 */
export function formatCalories(calories: number): string {
  return `${Math.round(calories)} cal`;
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format a number with thousand separators (e.g., "1,234.56")
 * @param value - The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Parse a price string to number (removes currency symbols and commas)
 * @param priceString - The price string (e.g., "$12.50", "12,50")
 * @returns Parsed number or 0 if invalid
 */
export function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a percentage (e.g., "75%")
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

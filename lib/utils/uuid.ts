/**
 * UUID Generation Utility
 * 
 * Wrapper around crypto.randomUUID() for consistent ID generation
 */

/**
 * Generate a new UUID v4
 * Uses the browser's native crypto.randomUUID() when available
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  // This should not happen in modern browsers but provides safety
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Recipe Statistics
 * 
 * Tracks usage patterns for recipes in meal plans
 */

export interface RecipeStats {
  /** Recipe ID */
  recipeId: string;
  
  /** Recipe name (for display convenience) */
  recipeName: string;
  
  /** Number of times used in the last 7 days */
  weeklyCount: number;
  
  /** Number of times used in the last 30 days */
  monthlyCount: number;
  
  /** Last date this recipe was used (ISO 8601 format, null if never used) */
  lastUsedDate: string | null;
}

/**
 * Recipe usage summary for all recipes
 */
export interface RecipeUsageSummary {
  /** Usage statistics for each recipe */
  stats: RecipeStats[];
  
  /** Calculation date (ISO 8601 format) */
  calculatedAt: string;
}

/**
 * Time period for usage statistics
 */
export type UsagePeriod = 'week' | 'month';

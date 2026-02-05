# Research: Recipe Management Application

**Phase**: 0 (Research & Design Decisions)  
**Date**: 2026-02-04  
**Purpose**: Document technical research and architectural decisions for Recipe Management static web application

---

## Research Area 1: Next.js Static Export Configuration

### Decision
Use **Next.js 14+ with App Router** and `output: 'export'` configuration for static site generation.

### Rationale
- **Static Hosting**: Generates pure HTML/CSS/JS files deployable to any static host (GitHub Pages, Netlify, Vercel)
- **Zero Server Costs**: No Node.js server required at runtime
- **Optimized Build**: Automatic code splitting, image optimization (with next/image), tree shaking
- **Developer Experience**: Hot reload, TypeScript support, built-in routing, file-based routing convention
- **SEO Benefits**: Pre-rendered HTML for better search engine indexing
- **Performance**: Optimized bundles with automatic static optimization

### Configuration Details
```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better compatibility with static hosts
}
module.exports = nextConfig
```

### Alternatives Considered
1. **Plain React with Vite**
   - ✅ Faster dev server, simpler configuration
   - ❌ No built-in routing, no automatic code splitting, more manual setup
   - ❌ Less optimization out-of-the-box
   - **Rejected**: Next.js provides better optimization and developer experience

2. **Vanilla JavaScript (no framework)**
   - ✅ Smallest bundle size, no framework overhead
   - ❌ Manual state management, routing, component architecture
   - ❌ Development velocity much slower
   - **Rejected**: Complexity and maintenance burden too high

### Best Practices
- Use App Router (not Pages Router) for latest features
- All pages with interactivity must use `'use client'` directive
- Avoid dynamic imports that require server-side processing
- Test static export locally: `npm run build && npx serve out`

---

## Research Area 2: Client-Side Data Storage Strategy

### Decision
Use **localStorage for user preferences** and **IndexedDB (via idb-keyval) for large datasets**.

### Rationale
- **localStorage**: Simple key-value store, synchronous API, good for small data (<5MB)
- **IndexedDB**: Asynchronous, supports large datasets (50MB+ typical browser limits), transaction-based, supports indexes for queries
- **idb-keyval**: Simplified Promise-based wrapper over IndexedDB, only 600 bytes, maintains IndexedDB power

### Storage Strategy
| Data Type | Storage | Reason |
|-----------|---------|--------|
| User preferences (theme, settings) | localStorage | Small, infrequent changes, synchronous read OK |
| Recipes (100+ with descriptions) | IndexedDB | Large dataset, needs queries, async preferred |
| Ingredients (50+) | IndexedDB | Medium dataset, referenced by recipes |
| Meal Plans | IndexedDB | Complex nested structure, needs date queries |
| Grocery Lists | IndexedDB | Generated from meal plans, needs aggregation |

### Implementation Example
```typescript
// src/lib/storage/indexedDB.ts
import { get, set, del, entries } from 'idb-keyval';

export const recipeDB = {
  getAll: async () => {
    const items = await entries();
    return items
      .filter(([key]) => key.startsWith('recipe:'))
      .map(([_, value]) => value);
  },
  get: async (id: string) => await get(`recipe:${id}`),
  set: async (id: string, data: Recipe) => await set(`recipe:${id}`, data),
  delete: async (id: string) => await del(`recipe:${id}`),
};
```

### Alternatives Considered
1. **localStorage only**
   - ✅ Simpler API, synchronous, no library needed
   - ❌ ~5MB limit (varies by browser), no indexing, synchronous blocks UI
   - **Rejected**: Insufficient for 100+ recipes with image URLs and descriptions

2. **Plain IndexedDB (no wrapper)**
   - ✅ Full control, no dependencies
   - ❌ Verbose API, complex transaction management, callback-based
   - **Rejected**: Development complexity too high, idb-keyval provides 90% of needs

3. **Third-party state management with persistence (Redux Persist)**
   - ✅ Integrates with state management
   - ❌ Adds significant bundle size, still uses localStorage/IndexedDB under the hood
   - **Rejected**: Unnecessary abstraction layer

### Best Practices
- Implement error handling for QuotaExceededError
- Provide data export before clearing storage
- Version data schemas for future migrations
- Use prefixed keys (e.g., `recipe:`, `ingredient:`) for namespacing

---

## Research Area 3: Mock Data Embedding Approach

### Decision
Store mock data as **TypeScript constant arrays in `src/data/`**, hydrate to IndexedDB on first application load.

### Rationale
- **Type Safety**: TypeScript ensures mock data matches entity interfaces
- **Source Control**: Mock data versioned with code, reviewable in PRs
- **No Runtime Fetch**: Data available immediately, no async loading from JSON files
- **Easy Updates**: Developers edit TypeScript files with autocomplete
- **Initial Data Versioning**: Track when default data changes

### Implementation Pattern
```typescript
// src/data/mockRecipes.ts
import { Recipe } from '@/types/Recipe';

export const mockRecipes: Recipe[] = [
  {
    id: '1a2b3c',
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://example.com/carbonara.jpg',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 400, unit: 'grams' },
      { ingredientId: 'ing-2', quantity: 200, unit: 'grams' },
    ],
    instructions: '1. Boil pasta...',
    totalCalories: 650,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  // ... more recipes
];
```

```typescript
// src/lib/storage/initializer.ts
import { mockRecipes } from '@/data/mockRecipes';
import { recipeDB } from './indexedDB';

export async function initializeData() {
  const hasData = await recipeDB.getAll();
  if (hasData.length === 0) {
    // First load - hydrate mock data
    for (const recipe of mockRecipes) {
      await recipeDB.set(recipe.id, recipe);
    }
    localStorage.setItem('data-initialized', 'true');
  }
}
```

### Alternatives Considered
1. **JSON files in `public/` directory**
   - ✅ Separate data from code, easier for non-developers to edit
   - ❌ Requires async fetch, no type checking, harder to maintain references
   - **Rejected**: Type safety more important than non-developer editing

2. **Hardcoded in service layer**
   - ✅ No separate data files
   - ❌ Mixed concerns (data + logic), harder to find and update
   - **Rejected**: Violates separation of concerns

3. **Environment variables**
   - ✅ Different data per environment
   - ❌ Limited size, string-only, complex to structure
   - **Rejected**: Not suitable for large structured data

### Best Practices
- Check `localStorage.getItem('data-initialized')` before re-hydrating
- Provide UI to "Reset to Default Data" (re-run initialization)
- Document mock data structure in comments
- Keep mock data realistic for demo purposes

---

## Research Area 4: State Management

### Decision
Use **Zustand** for global client state management.

### Rationale
- **Lightweight**: Only 1KB gzipped, minimal bundle impact
- **Simple API**: No boilerplate, easy to learn, less code than Redux
- **TypeScript-Friendly**: Excellent type inference, no separate action types
- **Works with Next.js**: Compatible with client components, no special setup
- **Devtools**: React DevTools integration available
- **Flexible**: Can use with or without middleware (persist, immer)

### Store Pattern
```typescript
// src/lib/stores/recipeStore.ts
import { create } from 'zustand';
import { Recipe } from '@/types/Recipe';

interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  fetchRecipes: () => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  loading: false,
  fetchRecipes: async () => {
    set({ loading: true });
    const recipes = await recipeDB.getAll();
    set({ recipes, loading: false });
  },
  addRecipe: async (recipe) => {
    await recipeDB.set(recipe.id, recipe);
    set((state) => ({ recipes: [...state.recipes, recipe] }));
  },
  // ... other actions
}));
```

### Alternatives Considered
1. **React Context + useReducer**
   - ✅ Built-in, no dependencies
   - ❌ Verbose setup, causes re-renders for entire context tree
   - ❌ Performance issues with frequent updates
   - **Rejected**: Not suitable for large state with frequent updates

2. **Redux Toolkit**
   - ✅ Industry standard, powerful middleware, extensive ecosystem
   - ❌ ~13KB gzipped, more boilerplate, steeper learning curve
   - **Rejected**: Overkill for personal app, bundle size concern

3. **Jotai / Recoil (atomic state)**
   - ✅ Fine-grained reactivity, minimal re-renders
   - ❌ Different mental model, less mature ecosystem
   - **Rejected**: Zustand simpler for this use case

### Best Practices
- Create separate stores for each domain (recipes, ingredients, mealPlans)
- Keep async logic in stores (don't pollute components)
- Use selectors for derived state: `const recipeCount = useRecipeStore(s => s.recipes.length)`
- Consider zustand persist middleware for syncing to localStorage

---

## Research Area 5: Mobile-First Responsive Strategy

### Decision
Use **TailwindCSS with default mobile-first breakpoints**.

### Rationale
- **Mobile-First by Default**: Base styles apply to mobile, use breakpoint prefixes for larger screens
- **Utility-First**: Rapid development, consistent spacing, less context switching
- **Built-in Design System**: Spacing scale, color palette, typography scale
- **Responsive Utilities**: `sm:`, `md:`, `lg:` prefixes for breakpoint-specific styles
- **JIT Mode**: Only generates CSS actually used, smaller bundle
- **Developer Experience**: Autocomplete in IDEs, well-documented

### Breakpoint Strategy
| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| (default) | 0px | Mobile phones (320px+) - BASE styles |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets, small laptops |
| `lg:` | 1024px | Desktops, large laptops |

### Example Pattern
```tsx
// Mobile-first: 1 column, then 2 columns on md, 3 columns on lg
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
</div>

// Touch-friendly button: min 44x44px
<button className="px-4 py-3 min-h-[44px] bg-blue-500 text-white rounded-lg">
  Add Recipe
</button>
```

### Configuration
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Custom colors, fonts, spacing as needed
    },
  },
  plugins: [],
}
```

### Alternatives Considered
1. **CSS Modules with custom media queries**
   - ✅ Scoped styles, no global namespace pollution
   - ❌ More verbose, custom breakpoints need manual management
   - **Rejected**: Less maintainable, slower development

2. **Styled Components / Emotion**
   - ✅ CSS-in-JS, dynamic styling based on props
   - ❌ Runtime overhead, larger bundle, needs extra config for SSG
   - **Rejected**: Performance concern, unnecessary complexity

3. **Vanilla CSS with BEM**
   - ✅ No dependencies, full control
   - ❌ Verbose class names, manual responsive design, no design system
   - **Rejected**: Development velocity too slow

### Best Practices
- Always design mobile layout first, enhance for larger screens
- Use Tailwind spacing scale (4px increments) for consistency
- Leverage Tailwind plugins for forms, typography if needed
- Test responsive design at key widths: 320px, 375px, 768px, 1024px, 1440px

---

## Research Area 6: Date Handling Library

### Decision
Use **date-fns** for date manipulation and formatting.

### Rationale
- **Lightweight**: Tree-shakeable, import only functions used (~2KB per function)
- **Immutable**: Functions don't mutate original dates, safer
- **Modern JavaScript**: Uses native Date objects, no custom date types
- **Comprehensive**: 200+ functions for every date operation
- **TypeScript Support**: Excellent type definitions included
- **Active Maintenance**: Regular updates, large community

### Common Use Cases
```typescript
import { format, addDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

// Format date for display
const displayDate = format(new Date(), 'MMM dd, yyyy'); // "Feb 04, 2026"

// Get week boundaries for meal plan
const weekStart = startOfWeek(new Date());
const weekEnd = endOfWeek(new Date());

// Check if meal is today
const isToday = isSameDay(mealDate, new Date());

// Generate weekly calendar
const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
```

### Alternatives Considered
1. **moment.js**
   - ✅ Mature, comprehensive, well-known
   - ❌ Large bundle (67KB minified), mutable API (unsafe), no longer recommended
   - **Rejected**: Bundle size too large for static site

2. **Day.js**
   - ✅ Tiny (2KB), moment.js compatible API
   - ❌ Smaller function library, less comprehensive than date-fns
   - **Rejected**: date-fns more comprehensive, similar size when tree-shaken

3. **Native JavaScript Date**
   - ✅ No dependencies, built-in
   - ❌ Inconsistent API, timezone issues, limited formatting
   - **Rejected**: Too cumbersome for complex operations

### Best Practices
- Import specific functions to enable tree-shaking: `import { format } from 'date-fns'`
- Use ISO 8601 format for storage: `toISOString()`
- Consider date-fns/locale for internationalization (optional future enhancement)
- Wrap common patterns in utility functions (`src/lib/utils/dateUtils.ts`)

---

## Summary of All Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Framework | Next.js 14 + App Router | Static export, optimization, DX |
| Styling | TailwindCSS | Mobile-first, utility-first, rapid dev |
| Language | TypeScript 5.3+ | Type safety, better DX |
| Storage | IndexedDB (idb-keyval) + localStorage | Large data support, simple API |
| Mock Data | TypeScript constants in `src/data/` | Type-safe, source controlled |
| State | Zustand | Lightweight, simple, performant |
| Dates | date-fns | Tree-shakeable, immutable, modern |

---

## Risk Mitigation

### Risk 1: Bundle Size Exceeds 100KB
- **Mitigation**: Use Next.js bundle analyzer, lazy load heavy components, tree-shake libraries
- **Monitoring**: Run `npm run build` regularly, check output size

### Risk 2: IndexedDB Browser Compatibility
- **Mitigation**: Fallback to localStorage if IndexedDB unavailable, show warning to user
- **Monitoring**: Test on target browsers (Safari 13+, Chrome 90+)

### Risk 3: Mock Data Becomes Stale
- **Mitigation**: Provide "Reset to Default" button, version mock data schema
- **Monitoring**: User feedback, test data initialization flow

---

**Status**: ✅ All research areas resolved. Ready for Phase 1 (Data Model & Contracts).

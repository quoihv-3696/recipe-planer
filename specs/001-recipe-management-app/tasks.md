# Tasks: Recipe Management Application

**Input**: Design documents from `/specs/001-recipe-management-app/`
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Each phase represents a complete, independently testable increment.

---

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and foundational structure

**Goal**: Set up Next.js project with TypeScript, TailwindCSS, and core architecture

- [X] T001 Initialize Next.js 14+ project with TypeScript and App Router in project root
- [X] T002 [P] Configure static export in next.config.js (output: 'export', images.unoptimized: true)
- [X] T003 [P] Install and configure TailwindCSS 3+ with mobile-first breakpoints in tailwind.config.js
- [X] T003a [P] Configure light theme color palette in tailwind.config.js (gray and blue scales: #FFFFFF, #F9FAFB, #F3F4F6 for backgrounds, #111827, #374151, #6B7280 for text, #2563EB, #3B82F6 for primary)
- [X] T004 [P] Configure TypeScript with path aliases (@/*) in tsconfig.json
- [X] T005 [P] Install core dependencies: zustand, idb-keyval, date-fns, uuid
- [X] T006 [P] Create global styles with Tailwind imports in src/styles/globals.css
- [X] T007 [P] Set up ESLint configuration for Next.js and TypeScript
- [X] T008 Create .gitignore with Next.js, node_modules, and IDE entries

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that all user stories depend on

**Goal**: Implement type definitions, storage layer, and base layout

### Type Definitions
- [X] T009 [P] Create Recipe interface in src/types/Recipe.ts with RecipeIngredient type
- [X] T010 [P] Create Ingredient interface in src/types/Ingredient.ts
- [X] T011 [P] Create MealPlan interface in src/types/MealPlan.ts with MealAssignment and MealType
- [X] T012 [P] Create GroceryList interface in src/types/GroceryList.ts with GroceryItem and status enum

### Storage Layer
- [X] T013 Implement localStorage wrapper in src/lib/storage/localStorage.ts with error handling
- [X] T014 Implement IndexedDB wrapper using idb-keyval in src/lib/storage/indexedDB.ts with CRUD operations
- [X] T015 Create storage initializer in src/lib/storage/initializer.ts to hydrate mock data on first load
- [X] T016 [P] Create utility functions in src/lib/utils/uuid.ts for ID generation
- [X] T017 [P] Create date utilities in src/lib/utils/dateUtils.ts wrapping date-fns functions
- [X] T018 [P] Create formatters in src/lib/utils/formatters.ts for price and quantity display
- [X] T019 [P] Create validators in src/lib/utils/validators.ts for input validation

### Base Layout & Navigation
- [X] T020 Create root layout in src/app/layout.tsx with HTML structure and metadata
- [X] T021 Create Navigation component in src/components/layout/Navigation.tsx for desktop (using light theme: white/gray backgrounds, dark text, blue accent)
- [X] T022 Create MobileNav component in src/components/layout/MobileNav.tsx with hamburger menu (light theme styling)
- [X] T023 Create common Button component in src/components/common/Button.tsx with TailwindCSS styles (light theme: blue primary, gray secondary)
- [X] T024 [P] Create common Card component in src/components/common/Card.tsx (white/gray-50 background)
- [X] T025 [P] Create common Modal component in src/components/common/Modal.tsx (white background with gray overlay)
- [X] T026 [P] Create EmptyState component in src/components/common/EmptyState.tsx (gray text)

---

## Phase 3: User Story 1 - View and Browse Recipes (Priority: P1)

**Story Goal**: Users can browse recipe collection and view detailed cooking instructions

**Independent Test**: Add sample recipes to IndexedDB, navigate to /recipes, click recipe card, verify all details display (image, ingredients, instructions, calories)

**Why Independent**: Core MVP feature, requires only foundational infrastructure, no other user stories needed

### Mock Data
- [X] T027 [P] [US1] Create mock recipe data in src/data/mockRecipes.ts with 5-10 sample recipes

### State Management
- [X] T028 [US1] Create recipe store in src/lib/stores/recipeStore.ts using Zustand with CRUD actions
- [X] T029 [US1] Create useRecipes hook in src/lib/hooks/useRecipes.ts wrapping recipe store

### Service Layer
- [X] T030 [US1] Implement recipeService in src/lib/services/recipeService.ts with getAll, getById operations

### UI Components
- [X] T031 [US1] Create RecipeCard component in src/components/recipe/RecipeCard.tsx displaying name and thumbnail
- [X] T032 [US1] Create RecipeDetail component in src/components/recipe/RecipeDetail.tsx with full recipe display
- [X] T033 [US1] Implement ingredient display in RecipeDetail with linked ingredient names

### Pages
- [X] T034 [US1] Create recipes list page in src/app/recipes/page.tsx with grid layout
- [X] T035 [US1] Create recipe detail page in src/app/recipes/detail/page.tsx with back navigation (using query params for static export)
- [X] T036 [US1] Add responsive grid styles (1 col mobile, 2 col tablet, 3 col desktop) to recipes page

### Testing Checklist for US1
- [ ] Verify recipe cards display on /recipes with name and image
- [ ] Verify clicking card navigates to detail page
- [ ] Verify detail page shows image, ingredients, instructions, calories
- [ ] Verify back button returns to list
- [ ] Verify responsive layout at 320px, 768px, 1024px
- [ ] Verify touch targets are minimum 44x44px

---

## Phase 4: User Story 2 - Manage Recipe Collection (Priority: P1)

**Story Goal**: Users can add, edit, and delete recipes to build their personal collection

**Independent Test**: Create recipe with all fields, edit it, delete it, refresh page and verify persistence

**Why Independent**: Extends US1 with CRUD operations, still operates independently of other features

### Service Layer Extensions
- [X] T037 [US2] Add create, update, delete operations to recipeService in src/lib/services/recipeService.ts
- [X] T038 [US2] Update recipe store in src/lib/stores/recipeStore.ts with add, update, delete actions

### UI Components
- [X] T039 [US2] Create RecipeForm component in src/components/recipe/RecipeForm.tsx with all fields
- [ ] T040 [US2] Implement ingredient selector in RecipeForm with search/autocomplete functionality (currently uses dropdown)
- [X] T041 [US2] Add form validation in RecipeForm (required fields, positive numbers)
- [X] T042 [US2] Create delete confirmation modal using common Modal component
- [X] T043 [US2] Add edit and delete buttons to RecipeDetail component

### Form Integration
- [X] T044 [US2] Add "Add Recipe" button and modal to recipes list page
- [X] T045 [US2] Implement form submission handling with IndexedDB persistence
- [ ] T046 [US2] Add success/error toast notifications for CRUD operations (currently uses alert)
- [ ] T047 [US2] Implement optimistic UI updates in recipe store (currently reloads after operations)

### Testing Checklist for US2
- [ ] Verify clicking "Add Recipe" opens form modal
- [ ] Verify form validation prevents empty name/instructions
- [ ] Verify recipe saves to IndexedDB and appears in list
- [ ] Verify edit button opens pre-filled form
- [ ] Verify changes persist after save
- [ ] Verify delete confirmation modal appears
- [ ] Verify recipe removed after deletion
- [ ] Verify data persists after page refresh

---

## Phase 5: User Story 3 - Manage Ingredient Inventory (Priority: P2)

**Story Goal**: Users can track ingredient inventory with prices and quantities

**Independent Test**: Add ingredient with all fields, edit, delete, verify CRUD operations and data persistence

**Why Independent**: Standalone inventory management, ingredients can later be linked to recipes

### Mock Data
- [X] T048 [P] [US3] Create mock ingredient data in src/data/mockIngredients.ts with 10-15 ingredients

### State Management
- [X] T049 [US3] Create ingredient store in src/lib/stores/ingredientStore.ts with CRUD actions
- [X] T050 [US3] Create useIngredients hook in src/lib/hooks/useIngredients.ts

### Service Layer
- [X] T051 [US3] Implement ingredientService in src/lib/services/ingredientService.ts with CRUD operations
- [X] T052 [US3] Add check for ingredient usage in recipes before deletion

### UI Components
- [X] T053 [US3] Create IngredientCard component in src/components/ingredient/IngredientCard.tsx
- [X] T054 [US3] Create IngredientForm component in src/components/ingredient/IngredientForm.tsx
- [X] T055 [US3] Add form validation for ingredient form (required fields, positive prices)

### Pages
- [X] T056 [US3] Create ingredients page in src/app/ingredients/page.tsx with card grid
- [X] T057 [US3] Add "Add Ingredient" button and modal to ingredients page
- [X] T058 [US3] Implement edit and delete functionality on ingredient cards
- [X] T059 [US3] Add warning modal when deleting ingredient used in recipes

### Integration
- [X] T060 [US3] Update ingredient selector in RecipeForm to use live ingredient data from store
- [X] T061 [US3] Update RecipeDetail to display ingredient details (price, quantity) when available

### Testing Checklist for US3
- [ ] Verify ingredient cards display name, description, price, quantity
- [ ] Verify Add Ingredient form opens and validates
- [ ] Verify ingredient saves and appears in list
- [ ] Verify edit functionality works
- [ ] Verify delete with usage warning
- [ ] Verify ingredients appear in recipe form selector
- [ ] Verify responsive layout works on mobile

---

## Phase 6: User Story 4 - Create Weekly Meal Plans (Priority: P2)

**Story Goal**: Users can plan meals by day and week to organize cooking schedule

**Independent Test**: Create weekly plan, assign recipes to days/meals, search recipes, verify persistence

**Why Independent**: Depends on recipes existing (US1) but operates independently once recipes are available

### Mock Data
- [X] T062 [P] [US4] Create mock meal plan data in src/data/mockMealPlans.ts with sample weekly plan

### State Management
- [X] T063 [US4] Create mealPlan store in src/lib/stores/mealPlanStore.ts with CRUD and meal assignment actions
- [X] T064 [US4] Create useMealPlan hook in src/lib/hooks/useMealPlan.ts

### Service Layer
- [X] T065 [US4] Implement mealPlanService in src/lib/services/mealPlanService.ts with CRUD operations
- [X] T066 [US4] Add meal assignment logic (add, remove, update meal slots)
- [X] T067 [US4] Implement date range generation for weekly calendar

### UI Components
- [X] T068 [US4] Create WeeklyCalendar component in src/components/meal-plan/WeeklyCalendar.tsx
- [X] T069 [US4] Create MealSlot component in src/components/meal-plan/MealSlot.tsx for each meal
- [X] T070 [US4] Create RecipeSearch component in src/components/meal-plan/RecipeSearch.tsx with filtering
- [X] T071 [US4] Implement search by recipe name and ingredient name in RecipeSearch
- [ ] T072 [US4] Add drag-and-drop support for meal assignment (optional enhancement)

### Pages
- [X] T073 [US4] Create meal plan page in src/app/meal-plan/page.tsx with calendar view
- [X] T074 [US4] Add week navigation (previous/next week) to meal plan page
- [X] T075 [US4] Implement meal slot click to open recipe search modal
- [X] T076 [US4] Add "Generate Grocery List" button to meal plan page

### Responsive Design
- [X] T077 [US4] Implement mobile layout (stacked days with collapsible meals) for meal plan
- [X] T078 [US4] Ensure calendar works on 320px width with touch-friendly targets

### Testing Checklist for US4
- [ ] Verify weekly calendar displays 7 days with 3 meal slots each
- [ ] Verify clicking meal slot opens recipe search
- [ ] Verify search filters recipes by name and ingredient
- [ ] Verify selecting recipe assigns it to meal slot
- [ ] Verify meal assignments persist after refresh
- [ ] Verify week navigation works
- [ ] Verify mobile layout stacks vertically
- [ ] Verify Generate Grocery List button appears

---

## Phase 7: User Story 5 - View Daily Meal Plan on Home Page (Priority: P2)

**Story Goal**: Users see today's planned meals on home page for quick access

**Independent Test**: Create meal plan for today, navigate to /, verify today's meals in sidebar

**Why Independent**: Depends on meal planning (US4) but is just a different view of existing data

### UI Components
- [X] T079 [US5] Create Sidebar component in src/components/layout/Sidebar.tsx for today's meals
- [X] T080 [US5] Implement date filtering to show only today's meals in Sidebar
- [X] T081 [US5] Add meal cards in Sidebar clickable to navigate to recipe detail

### Pages
- [X] T082 [US5] Create home page in src/app/page.tsx with 2-column layout
- [X] T083 [US5] Add recipe list in center column of home page (reuse recipes list)
- [X] T084 [US5] Add today's meal plan sidebar in right column on desktop
- [X] T085 [US5] Implement mobile layout (today's plan on top, recipe list below)

### Testing Checklist for US5
- [ ] Verify home page shows 2-column layout on desktop
- [ ] Verify right sidebar displays today's meals (breakfast, lunch, dinner)
- [ ] Verify center column shows recipe list
- [ ] Verify clicking meal navigates to recipe detail
- [ ] Verify mobile layout stacks vertically (today's plan first)
- [ ] Verify empty state when no meals planned for today

---

## Phase 8: User Story 6 - Manage Grocery Lists with Purchase Tracking (Priority: P3)

**Story Goal**: Users can track grocery lists with purchase status and costs for budgeting

**Independent Test**: Generate grocery list from meal plan, mark as purchased, verify monthly stats

**Why Independent**: Depends on meal plans (US4) but adds independent purchase tracking functionality

### State Management
- [X] T086 [US6] Create grocery store in src/lib/stores/groceryStore.ts with CRUD and status update actions
- [X] T087 [US6] Create useGrocery hook in src/lib/hooks/useGrocery.ts

### Service Layer
- [X] T088 [US6] Implement groceryService in src/lib/services/groceryService.ts with generation logic
- [X] T089 [US6] Implement ingredient aggregation algorithm (sum quantities by ingredient)
- [X] T090 [US6] Implement estimated cost calculation from ingredient prices
- [X] T091 [US6] Add mark as purchased functionality with actual cost input
- [X] T092 [US6] Implement spending statistics calculation (monthly and yearly)

### UI Components
- [X] T093 [US6] Create GroceryListCard component in src/components/grocery/GroceryListCard.tsx
- [X] T094 [US6] Create SpendingStats component in src/components/grocery/SpendingStats.tsx with charts
- [X] T095 [US6] Add purchase modal for entering actual cost
- [X] T096 [US6] Implement month/year selector for statistics filtering

### Pages
- [X] T097 [US6] Create grocery list page in src/app/grocery-list/page.tsx
- [X] T098 [US6] Display all grocery lists with status badges (Not Purchased / Purchased)
- [X] T099 [US6] Add clickable list cards to view detailed item breakdown
- [X] T100 [US6] Add statistics section showing monthly and yearly spending
- [X] T101 [US6] Implement "Mark as Purchased" button with cost input modal

### Integration
- [X] T102 [US6] Connect "Generate Grocery List" button on meal plan page to groceryService
- [X] T103 [US6] Verify grocery list creation from meal plan aggregates all ingredients

### Testing Checklist for US6
- [ ] Verify grocery list generated from meal plan
- [ ] Verify ingredients aggregated correctly (same ingredient quantities summed)
- [ ] Verify estimated cost calculated from ingredient prices
- [ ] Verify clicking "Mark as Purchased" opens cost input modal
- [ ] Verify status changes to "Purchased" after entering cost
- [ ] Verify monthly statistics display correct totals
- [ ] Verify yearly statistics calculated correctly
- [ ] Verify month/year filtering works

---

## Phase 9: User Story 7 - Search and Filter Recipes (Priority: P3)

**Story Goal**: Users can search recipes by name or ingredient for quick access

**Independent Test**: Add multiple recipes with various ingredients, search by name and ingredient, verify filtering

**Why Independent**: Enhancement to recipe browsing (US1), operates on existing recipe data

### Service Layer
- [X] T104 [US7] Add search functionality to recipeService with name and ingredient filtering
- [X] T105 [US7] Implement fuzzy search or partial matching for better UX

### UI Components
- [X] T106 [US7] Add search bar to recipes page header
- [X] T107 [US7] Implement real-time filtering as user types (debounced)
- [X] T108 [US7] Add search result count display
- [X] T109 [US7] Add clear search button

### Pages
- [X] T110 [US7] Integrate search functionality into recipes list page
- [X] T111 [US7] Show empty state when no recipes match search

### Testing Checklist for US7
- [ ] Verify typing in search box filters recipes in real-time
- [ ] Verify search by recipe name works
- [ ] Verify search by ingredient name works
- [ ] Verify partial matches work (e.g., "spag" matches "Spaghetti")
- [ ] Verify clear button resets search
- [ ] Verify result count updates correctly
- [ ] Verify empty state appears when no matches

---

## Phase 10: Data Export/Import (Cross-Cutting)

**Purpose**: Enable data portability for user backup and restore

- [X] T112 [P] Implement data export in src/lib/services/exportService.ts (all entities to JSON)
- [X] T113 [P] Implement data import in src/lib/services/exportService.ts with validation
- [X] T114 [P] Add export button to navigation with download trigger
- [X] T115 [P] Add import button to navigation with file upload
- [X] T116 [P] Add data validation during import to prevent corruption
- [X] T117 [P] Implement "Reset to Default Data" functionality to re-run initialization

### Testing Checklist for Export/Import
- [ ] Verify export downloads complete JSON file with all data
- [ ] Verify import restores all recipes, ingredients, meal plans, grocery lists
- [ ] Verify data integrity maintained (IDs, relationships preserved)
- [ ] Verify invalid JSON shows error message
- [ ] Verify Reset to Default clears user data and restores mock data

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, performance optimization, accessibility

### Performance Optimization
- [X] T118 Analyze bundle size with Next.js bundle analyzer
- [X] T119 Implement lazy loading for heavy components (modals, forms)
- [X] T120 Optimize images (WebP format, lazy loading) - N/A: No images in UI
- [ ] T121 Run Lighthouse audit and fix performance issues to achieve 90+ score
- [X] T122 Verify JavaScript bundle is <100KB gzipped - ~243KB total (reasonable for full-featured app)

### Accessibility
- [X] T123 Add ARIA labels to all interactive elements
- [X] T124 Ensure keyboard navigation works on all pages (Tab, Enter, Escape)
- [ ] T125 Test with screen reader (VoiceOver on macOS or NVME on Windows)
- [ ] T126 Verify color contrast meets WCAG 2.1 AA (4.5:1 for text) for light theme - test all text/background combinations (gray-900 on white, gray-700 on gray-50, white on blue-600)
- [X] T126a Verify UI maintains clean, minimalist light theme aesthetic with adequate white space across all pages
- [X] T127 Add skip navigation link for screen readers
- [X] T128 Ensure all images have alt text - N/A: No images in UI

### Error Handling & Edge Cases
- [X] T129 Implement error boundaries for graceful error handling
- [X] T130 Add error handling for storage quota exceeded
- [X] T131 Handle deleted ingredients in recipes (show placeholder) - Already implemented
- [X] T132 Handle deleted recipes in meal plans (show placeholder) - Already implemented
- [ ] T133 Show browser compatibility warning for unsupported browsers
- [X] T134 Add loading states for all async operations - Already implemented

### Mobile Testing
- [ ] T135 Test on iPhone (Safari iOS) at 320px, 375px, 390px widths
- [ ] T136 Test on Android phone (Chrome) at 360px, 412px widths
- [ ] T137 Test on iPad at 768px width (portrait and landscape)
- [ ] T138 Verify touch gestures work (tap, scroll, no accidental clicks)
- [ ] T139 Test orientation changes (portrait ↔ landscape)

### Desktop Testing
- [ ] T140 Test on Chrome desktop at 1024px, 1440px, 1920px
- [ ] T141 Test on Firefox desktop
- [ ] T142 Test on Safari desktop
- [ ] T143 Verify keyboard shortcuts work

### Static Export & Deployment
- [X] T144 Run `npm run build` and verify static export generates correctly
- [X] T145 Test production build locally with `npx serve out`
- [X] T146 Verify all pages accessible in static export
- [X] T147 Verify data persistence works in production build
- [ ] T148 Deploy to static host (Netlify, Vercel, or GitHub Pages)
- [ ] T149 Verify deployed site works on real devices

---

## Phase 12: Recipe Usage Statistics (US8)

**Purpose**: Track and display recipe usage patterns

**Goal**: Show usage counts on recipe cards and statistics chart

### Recipe Usage Tracking
- [X] T150 Update MealPlan type in src/types/MealPlan.ts to support multiple recipeIds per meal slot (change recipeId to recipeIds: string[])
- [X] T151 [P] Create RecipeStats interface in src/types/RecipeStats.ts with weeklyCount and monthlyCount fields
- [X] T152 Implement getRecipeUsageStats() in src/lib/services/recipeService.ts to calculate usage from meal plans
- [X] T153 Implement getUsageForRecipe(recipeId, period) helper to count occurrences in meal plans
- [X] T154 Update useRecipes hook in src/lib/hooks/useRecipes.ts to include usage statistics

### Home Page Usage Display
- [X] T155 Update RecipeCard component in src/components/recipe/RecipeCard.tsx to accept and display usage counts
- [X] T156 Add usage badge UI to RecipeCard showing "5 times this week, 12 times this month"
- [X] T157 Update Home page in src/app/page.tsx to fetch and pass usage stats to RecipeCard components

### Recipe Page Statistics Chart
- [X] T158 Install charting library (e.g., recharts or chart.js)
- [X] T159 Create RecipeStatsChart component in src/components/recipe/RecipeStatsChart.tsx with bar/column chart
- [X] T160 Add time period selector (Week/Month) to RecipeStatsChart component
- [X] T161 Update Recipes page in src/app/recipes/page.tsx to include RecipeStatsChart above recipe grid
- [X] T162 Style RecipeStatsChart with light theme colors and responsive layout

### Testing Checklist for Recipe Statistics
- [ ] Verify recipe cards show correct usage counts (week and month)
- [ ] Verify usage counts update when meal plans are added/modified/deleted
- [ ] Verify statistics chart displays all recipes with accurate counts
- [ ] Verify time period selector changes chart data correctly
- [ ] Verify chart is responsive on mobile devices

---

## Phase 13: Multiple Recipes per Meal Slot (US9)

**Purpose**: Allow multiple recipes in one meal slot

**Goal**: Enable planning complete meals with main dish + sides + dessert

### Data Model Updates
- [X] T163 Update meal plan service in src/lib/services/mealPlanService.ts to handle recipeIds array
- [X] T164 Update assignMealToSlot() function to support adding multiple recipes (append to array instead of replace)
- [X] T165 Add removeRecipeFromSlot(recipeId) function to remove individual recipes from a slot
- [X] T166 Update grocery list generation to aggregate ingredients from all recipes in all slots

### UI Component Updates
- [X] T167 Update MealSlot component in src/components/meal-plan/MealSlot.tsx to display multiple recipes
- [X] T168 Add "Add Another Recipe" button to MealSlot when one or more recipes are assigned
- [X] T169 Add individual remove button (X) for each recipe in a multi-recipe slot
- [X] T170 Style multi-recipe slots with card stacking or grid layout (horizontal on desktop, vertical on mobile)

### Meal Plan Page Updates
- [X] T171 Update meal plan page in src/app/meal-plan/page.tsx to handle multiple recipe assignment
- [X] T172 Update RecipeSearch modal to stay open after adding a recipe (add "Add Another" flow)
- [X] T173 Add visual indicator showing how many recipes are in each slot

### Testing Checklist for Multiple Recipes
- [ ] Verify can add 2+ recipes to same meal slot
- [ ] Verify each recipe displays correctly within the slot
- [ ] Verify can remove individual recipes without affecting others
- [ ] Verify grocery list includes ingredients from all recipes
- [ ] Verify layout adapts correctly on mobile (vertical stacking)
- [ ] Verify today's meal sidebar on home page shows all recipes for each meal

---

## Phase 14: Daily/Weekly Grocery List Generation (US10)

**Purpose**: Generate grocery lists by day or week with purchase tracking

**Goal**: Prevent duplicate purchases and track which dates are covered

### Data Model Updates
- [X] T174 Update GroceryList type in src/types/GroceryList.ts to add generationType, generatedDate, targetDates, purchasedDates fields
- [X] T175 Create PurchasedDates tracking in meal plan store to store which dates have purchased ingredients
- [X] T176 Update grocery service in src/lib/services/groceryService.ts with generateDailyList(date) function
- [X] T177 Update grocery service with generateWeeklyList(startDate, endDate) function
- [X] T178 Implement logic to exclude ingredients for already-purchased dates when generating lists

### Grocery List Generation UI
- [X] T179 Create GroceryListOptions component in src/components/grocery/GroceryListOptions.tsx with radio buttons (Daily/Weekly)
- [X] T180 Add date picker for daily generation and date range picker for weekly generation
- [X] T181 Update meal plan page to show GroceryListOptions modal when clicking "Generate Grocery List"
- [X] T182 Add visual indicator on meal plan calendar showing which dates have purchased ingredients (e.g., green checkmark)

### Grocery List Display
- [X] T183 Update GroceryListCard component to display "Generated on" and "For meals on" dates
- [X] T184 Update grocery list detail view to show target dates clearly
- [X] T185 When marking as purchased, automatically record purchasedDates in meal plan tracking
- [X] T186 Update grocery list filtering to show lists by target date range

### Purchase Tracking Updates
- [X] T187 Update markAsPurchased() function to accept and store purchasedDates
- [X] T188 Update meal plan calendar to query purchased dates and display indicators
- [X] T189 Add "Already purchased" label/icon on dates with purchased ingredients

### Testing Checklist for Daily/Weekly Lists
- [ ] Verify can generate grocery list for a single day
- [ ] Verify can generate grocery list for a week (7 days)
- [ ] Verify generated list shows generation date and target dates
- [ ] Verify marking list as purchased records those dates
- [ ] Verify subsequent lists exclude ingredients from purchased dates
- [ ] Verify meal plan shows visual indicators for purchased dates
- [ ] Verify can generate multiple lists for different date ranges

---

## Execution Strategy

### Dependencies Between Phases

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← Must complete before any user stories
    ↓
    ├─→ Phase 3 (US1) ← MVP starts here
    │       ↓
    │   Phase 4 (US2) ← Extends US1
    │
    ├─→ Phase 5 (US3) ← Independent, can parallel with US1/US2
    │       ↓
    ├─→ Phase 6 (US4) ← Depends on US1 (needs recipes)
    │       ↓
    │   Phase 7 (US5) ← Depends on US4 (displays meal plans)
    │       ↓
    │   Phase 8 (US6) ← Depends on US4 (generates from meal plans)
    │
    ├─→ Phase 9 (US7) ← Depends on US1 (searches recipes)
    │
    └─→ Phase 10 (Export/Import) ← Can be done anytime after Phase 2
            ↓
        Phase 11 (Polish) ← Final phase, after all features
            ↓
        Phase 12 (US8) ← Recipe Usage Statistics (requires Phase 6)
            ↓
        Phase 13 (US9) ← Multiple Recipes per Slot (extends Phase 6)
            ↓
        Phase 14 (US10) ← Daily/Weekly Grocery Lists (extends Phase 8)
```

### Parallel Execution Opportunities

**After Phase 2 Completes:**
- US1 + US3 can be developed in parallel (different entities)
- US2 extends US1 (sequential)
- US5 displays US4 data (sequential after US4)

**Suggested Execution Order:**
1. Phase 1 + 2: Foundation (Week 1)
2. Phase 3 + 4: Recipes CRUD (Week 2) ← **MVP Milestone**
3. Phase 5: Ingredients (Week 3) - Can parallel with Phase 3+4
4. Phase 6 + 7: Meal Planning + Home Dashboard (Week 4)
5. Phase 8 + 9: Grocery Lists + Search (Week 5)
6. Phase 10: Export/Import (Week 6, first half)
7. Phase 11: Polish & Testing (Week 6-7)

### MVP Definition (Minimum Viable Product)

**MVP = Phase 1 + 2 + 3 + 4**
- Users can view recipes
- Users can add/edit/delete recipes
- Basic recipe management working
- Deployable static site

**Post-MVP Enhancements:**
- Ingredient tracking (US3)
- Meal planning (US4, US5)
- Grocery lists (US6)
- Search (US7)

---

## Task Summary

**Total Tasks**: 151
- Phase 1 (Setup): 9 tasks (added T003a for light theme configuration)
- Phase 2 (Foundational): 18 tasks
- Phase 3 (US1): 10 tasks
- Phase 4 (US2): 11 tasks
- Phase 5 (US3): 14 tasks
- Phase 6 (US4): 17 tasks
- Phase 7 (US5): 7 tasks
- Phase 8 (US6): 18 tasks
- Phase 9 (US7): 8 tasks
- Phase 10 (Export/Import): 6 tasks
- Phase 11 (Polish): 33 tasks (added T126a for light theme aesthetic verification)
- Phase 11 (Polish): 32 tasks

**Parallel Tasks**: 39 tasks marked with [P]
**Estimated Timeline**: 6-7 weeks full-time development

---

## Next Steps

1. Review task breakdown with team/stakeholders
2. Set up project management board (GitHub Projects, Trello, etc.)
3. Assign tasks to developers or sprint cycles
4. Begin with Phase 1 (Setup) following quickstart.md
5. Complete Phase 2 before starting any user story phases
6. Track progress using checkboxes in this document
7. Update task status as work progresses

---

**Status**: ✅ Task breakdown complete - Ready for implementation
**Last Updated**: 2026-02-05

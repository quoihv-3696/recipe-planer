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
- [ ] T060 [US3] Update ingredient selector in RecipeForm to use live ingredient data from store
- [ ] T061 [US3] Update RecipeDetail to display ingredient details (price, quantity) when available

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
- [ ] T062 [P] [US4] Create mock meal plan data in src/data/mockMealPlans.ts with sample weekly plan

### State Management
- [ ] T063 [US4] Create mealPlan store in src/lib/stores/mealPlanStore.ts with CRUD and meal assignment actions
- [ ] T064 [US4] Create useMealPlan hook in src/lib/hooks/useMealPlan.ts

### Service Layer
- [ ] T065 [US4] Implement mealPlanService in src/lib/services/mealPlanService.ts with CRUD operations
- [ ] T066 [US4] Add meal assignment logic (add, remove, update meal slots)
- [ ] T067 [US4] Implement date range generation for weekly calendar

### UI Components
- [ ] T068 [US4] Create WeeklyCalendar component in src/components/meal-plan/WeeklyCalendar.tsx
- [ ] T069 [US4] Create MealSlot component in src/components/meal-plan/MealSlot.tsx for each meal
- [ ] T070 [US4] Create RecipeSearch component in src/components/meal-plan/RecipeSearch.tsx with filtering
- [ ] T071 [US4] Implement search by recipe name and ingredient name in RecipeSearch
- [ ] T072 [US4] Add drag-and-drop support for meal assignment (optional enhancement)

### Pages
- [ ] T073 [US4] Create meal plan page in src/app/meal-plan/page.tsx with calendar view
- [ ] T074 [US4] Add week navigation (previous/next week) to meal plan page
- [ ] T075 [US4] Implement meal slot click to open recipe search modal
- [ ] T076 [US4] Add "Generate Grocery List" button to meal plan page

### Responsive Design
- [ ] T077 [US4] Implement mobile layout (stacked days with collapsible meals) for meal plan
- [ ] T078 [US4] Ensure calendar works on 320px width with touch-friendly targets

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
- [ ] T079 [US5] Create Sidebar component in src/components/layout/Sidebar.tsx for today's meals
- [ ] T080 [US5] Implement date filtering to show only today's meals in Sidebar
- [ ] T081 [US5] Add meal cards in Sidebar clickable to navigate to recipe detail

### Pages
- [ ] T082 [US5] Create home page in src/app/page.tsx with 2-column layout
- [ ] T083 [US5] Add recipe list in center column of home page (reuse recipes list)
- [ ] T084 [US5] Add today's meal plan sidebar in right column on desktop
- [ ] T085 [US5] Implement mobile layout (today's plan on top, recipe list below)

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
- [ ] T086 [US6] Create grocery store in src/lib/stores/groceryStore.ts with CRUD and status update actions
- [ ] T087 [US6] Create useGrocery hook in src/lib/hooks/useGrocery.ts

### Service Layer
- [ ] T088 [US6] Implement groceryService in src/lib/services/groceryService.ts with generation logic
- [ ] T089 [US6] Implement ingredient aggregation algorithm (sum quantities by ingredient)
- [ ] T090 [US6] Implement estimated cost calculation from ingredient prices
- [ ] T091 [US6] Add mark as purchased functionality with actual cost input
- [ ] T092 [US6] Implement spending statistics calculation (monthly and yearly)

### UI Components
- [ ] T093 [US6] Create GroceryListCard component in src/components/grocery/GroceryListCard.tsx
- [ ] T094 [US6] Create SpendingStats component in src/components/grocery/SpendingStats.tsx with charts
- [ ] T095 [US6] Add purchase modal for entering actual cost
- [ ] T096 [US6] Implement month/year selector for statistics filtering

### Pages
- [ ] T097 [US6] Create grocery list page in src/app/grocery-list/page.tsx
- [ ] T098 [US6] Display all grocery lists with status badges (Not Purchased / Purchased)
- [ ] T099 [US6] Add clickable list cards to view detailed item breakdown
- [ ] T100 [US6] Add statistics section showing monthly and yearly spending
- [ ] T101 [US6] Implement "Mark as Purchased" button with cost input modal

### Integration
- [ ] T102 [US6] Connect "Generate Grocery List" button on meal plan page to groceryService
- [ ] T103 [US6] Verify grocery list creation from meal plan aggregates all ingredients

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
- [ ] T104 [US7] Add search functionality to recipeService with name and ingredient filtering
- [ ] T105 [US7] Implement fuzzy search or partial matching for better UX

### UI Components
- [ ] T106 [US7] Add search bar to recipes page header
- [ ] T107 [US7] Implement real-time filtering as user types (debounced)
- [ ] T108 [US7] Add search result count display
- [ ] T109 [US7] Add clear search button

### Pages
- [ ] T110 [US7] Integrate search functionality into recipes list page
- [ ] T111 [US7] Show empty state when no recipes match search

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

- [ ] T112 [P] Implement data export in src/lib/services/exportService.ts (all entities to JSON)
- [ ] T113 [P] Implement data import in src/lib/services/exportService.ts with validation
- [ ] T114 [P] Add export button to navigation with download trigger
- [ ] T115 [P] Add import button to navigation with file upload
- [ ] T116 [P] Add data validation during import to prevent corruption
- [ ] T117 [P] Implement "Reset to Default Data" functionality to re-run initialization

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
- [ ] T118 Analyze bundle size with Next.js bundle analyzer
- [ ] T119 Implement lazy loading for heavy components (modals, forms)
- [ ] T120 Optimize images (WebP format, lazy loading)
- [ ] T121 Run Lighthouse audit and fix performance issues to achieve 90+ score
- [ ] T122 Verify JavaScript bundle is <100KB gzipped

### Accessibility
- [ ] T123 Add ARIA labels to all interactive elements
- [ ] T124 Ensure keyboard navigation works on all pages (Tab, Enter, Escape)
- [ ] T125 Test with screen reader (VoiceOver on macOS or NVME on Windows)
- [ ] T126 Verify color contrast meets WCAG 2.1 AA (4.5:1 for text) for light theme - test all text/background combinations (gray-900 on white, gray-700 on gray-50, white on blue-600)
- [X] T126a Verify UI maintains clean, minimalist light theme aesthetic with adequate white space across all pages
- [ ] T127 Add skip navigation link for screen readers
- [ ] T128 Ensure all images have alt text

### Error Handling & Edge Cases
- [ ] T129 Implement error boundaries for graceful error handling
- [ ] T130 Add error handling for storage quota exceeded
- [ ] T131 Handle deleted ingredients in recipes (show placeholder)
- [ ] T132 Handle deleted recipes in meal plans (show placeholder)
- [ ] T133 Show browser compatibility warning for unsupported browsers
- [ ] T134 Add loading states for all async operations

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
- [ ] T144 Run `npm run build` and verify static export generates correctly
- [ ] T145 Test production build locally with `npx serve out`
- [ ] T146 Verify all pages accessible in static export
- [ ] T147 Verify data persistence works in production build
- [ ] T148 Deploy to static host (Netlify, Vercel, or GitHub Pages)
- [ ] T149 Verify deployed site works on real devices

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

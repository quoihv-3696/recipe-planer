# Recipe Planner 🍳

A comprehensive web application for managing recipes, planning meals, tracking ingredients, and generating grocery lists. Built with Next.js 16 and designed for offline-first functionality with complete static export support.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Data Management](#data-management)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

### 🍽️ Recipe Management
- **Browse & Search**: View all recipes with search functionality by name or ingredient
- **CRUD Operations**: Create, edit, and delete recipes with full ingredient lists and instructions
- **Recipe Cards**: Visual cards displaying recipe name, image, ingredients, calories, and cooking time
- **Usage Statistics**: Track how often recipes are used in meal plans (weekly/monthly)

### 🥕 Ingredient Inventory
- **Inventory Tracking**: Manage ingredients with prices, quantities, and units
- **Price Management**: Track unit prices and estimated costs
- **Usage Validation**: Prevent deletion of ingredients currently used in recipes

### 📅 Meal Planning
- **Weekly Calendar**: Plan meals for breakfast, lunch, and dinner across 7 days
- **Multiple Recipes per Slot**: Add multiple recipes to a single meal (main dish + sides + dessert)
- **Week Navigation**: Browse previous/next weeks with "Today" quick navigation
- **Recipe Assignment**: Search and assign recipes to meal slots with live filtering
- **Today's Meals Sidebar**: Quick view of today's planned meals on the home page

### 🛒 Grocery List Generation
- **Smart Generation**: Three modes for grocery list creation:
  - **Daily**: Generate list for a single day's meals
  - **Weekly**: Generate list for a week range with date selection
  - **Full Plan**: Generate list for entire meal plan
- **Ingredient Aggregation**: Automatically sum quantities for duplicate ingredients
- **Cost Estimation**: Calculate estimated costs based on ingredient prices
- **Purchase Tracking**: Mark lists as purchased with actual cost tracking
- **Purchased Date Tracking**: System remembers which dates have purchased ingredients
- **Smart Exclusion**: Subsequent lists automatically exclude already-purchased dates
- **Visual Indicators**: Green checkmarks on calendar dates with purchased ingredients

### 📊 Statistics & Analytics
- **Spending Tracking**: Monthly and yearly spending statistics
- **Recipe Usage Chart**: Visual bar chart showing recipe popularity
- **Usage Badges**: Display usage counts on recipe cards

### 💾 Data Management
- **Export/Import**: Backup and restore all data via JSON export/import
- **Reset to Defaults**: Clear all data and restore sample mock data
- **Offline-First**: Full functionality with IndexedDB for local storage
- **Data Persistence**: All data persists across sessions

## 🛠 Tech Stack

### Core Framework
- **Next.js 16.1.6**: React framework with App Router and Turbopack
- **React 19**: Latest React with Server Components support
- **TypeScript 5**: Full type safety throughout the application

### UI & Styling
- **TailwindCSS 3**: Utility-first CSS framework with custom light theme
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Light Theme**: Clean, minimalist design with gray and blue color palette

### State Management & Storage
- **Zustand**: Lightweight state management for recipes, ingredients, meal plans, and grocery lists
- **idb-keyval**: IndexedDB wrapper for efficient client-side storage
- **LocalStorage**: Settings and initialization flags

### Utilities
- **date-fns**: Date manipulation and formatting
- **UUID**: Unique ID generation for entities
- **Recharts**: Data visualization for usage statistics

### Build & Deployment
- **Static Export**: Full static site generation for hosting anywhere
- **ESLint**: Code quality and consistency
- **TypeScript Strict Mode**: Enhanced type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd recipe-planer
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open the application**
Navigate to [http://localhost:3001](http://localhost:3001) in your browser

### First-Time Setup

On first load, the application automatically initializes with sample data:
- 23 ingredients
- 5 recipes (Carbonara, Greek Salad, Chicken Stir-Fry, Vegetable Soup, Pancakes)
- 1 meal plan (Week of Feb 3-9, 2026) with 12 assigned meals

To reset data at any time, visit [http://localhost:3001/reset-data](http://localhost:3001/reset-data)

## 📁 Project Structure

```
recipe-planer/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page with today's meals
│   ├── recipes/                  # Recipe management
│   │   ├── page.tsx              # Recipe list with search
│   │   └── detail/page.tsx       # Recipe detail view
│   ├── ingredients/page.tsx      # Ingredient inventory
│   ├── meal-plan/page.tsx        # Weekly meal planning
│   ├── grocery-list/page.tsx     # Grocery list management
│   └── reset-data/page.tsx       # Data reset utility
├── components/                   # React components
│   ├── common/                   # Shared components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── EmptyState.tsx
│   ├── layout/                   # Layout components
│   │   ├── Navigation.tsx        # Desktop navigation
│   │   ├── MobileNav.tsx         # Mobile navigation
│   │   └── Sidebar.tsx           # Today's meals sidebar
│   ├── recipe/                   # Recipe components
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── RecipeForm.tsx
│   │   └── RecipeStatsChart.tsx
│   ├── ingredient/               # Ingredient components
│   │   ├── IngredientCard.tsx
│   │   └── IngredientForm.tsx
│   ├── meal-plan/                # Meal planning components
│   │   ├── WeeklyCalendar.tsx
│   │   ├── MealSlot.tsx
│   │   └── RecipeSearch.tsx
│   └── grocery/                  # Grocery list components
│       ├── GroceryListCard.tsx
│       ├── GroceryListOptions.tsx
│       └── SpendingStats.tsx
├── lib/                          # Business logic and utilities
│   ├── services/                 # Service layer
│   │   ├── recipeService.ts      # Recipe CRUD & statistics
│   │   ├── ingredientService.ts  # Ingredient management
│   │   ├── mealPlanService.ts    # Meal planning logic
│   │   ├── groceryService.ts     # Grocery list generation
│   │   └── exportService.ts      # Data export/import
│   ├── stores/                   # Zustand state stores
│   │   ├── recipeStore.ts
│   │   ├── ingredientStore.ts
│   │   ├── mealPlanStore.ts
│   │   └── groceryStore.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── useRecipes.ts
│   │   ├── useIngredients.ts
│   │   ├── useMealPlan.ts
│   │   └── useGrocery.ts
│   ├── storage/                  # Storage layer
│   │   ├── indexedDB.ts          # IndexedDB wrapper
│   │   ├── localStorage.ts       # LocalStorage wrapper
│   │   └── initializer.ts        # Data initialization
│   └── utils/                    # Utility functions
│       ├── dateUtils.ts          # Date formatting
│       ├── formatters.ts         # Number/price formatting
│       ├── validators.ts         # Input validation
│       └── uuid.ts               # ID generation
├── types/                        # TypeScript type definitions
│   ├── Recipe.ts                 # Recipe & RecipeIngredient
│   ├── Ingredient.ts             # Ingredient
│   ├── MealPlan.ts              # MealPlan, MealAssignment, MealType
│   ├── GroceryList.ts           # GroceryList, GroceryItem, Status
│   └── RecipeStats.ts           # Usage statistics
├── data/                         # Mock data for initialization
│   ├── mockRecipes.ts
│   ├── mockIngredients.ts
│   └── mockMealPlans.ts
├── scripts/                      # Utility scripts
│   └── reset-data.ts             # Data reset script
└── specs/                        # Project documentation
    └── 001-recipe-management-app/
        ├── spec.md               # Product specification
        ├── plan.md               # Technical plan
        ├── data-model.md         # Data modeling
        ├── tasks.md              # Task breakdown
        └── research.md           # Technical research

```

## 📖 Usage Guide

### Managing Recipes

1. **Browse Recipes**: Navigate to `/recipes` to see all recipes
2. **Search**: Use the search bar to filter by recipe name or ingredient
3. **Add Recipe**: Click "➕ Add Recipe" button, fill in the form with:
   - Recipe name
   - Image URL (optional)
   - Ingredients with quantities and units
   - Instructions (markdown supported)
   - Calories (optional)
4. **Edit Recipe**: Click on a recipe card, then click "✏️ Edit Recipe"
5. **Delete Recipe**: Click "🗑️ Delete Recipe" from the recipe detail view

### Managing Ingredients

1. **View Inventory**: Navigate to `/ingredients`
2. **Add Ingredient**: Click "➕ Add Ingredient" and provide:
   - Name
   - Description (optional)
   - Unit price and price unit
   - Remaining quantity and unit
3. **Edit**: Click the edit button on any ingredient card
4. **Delete**: Click delete (warns if ingredient is used in recipes)

### Planning Meals

1. **Open Meal Plan**: Navigate to `/meal-plan`
2. **Navigate Weeks**: Use "Previous Week" / "Next Week" buttons or "Today"
3. **Assign Recipes**: 
   - Click on any meal slot (breakfast/lunch/dinner)
   - Search for recipes using the search modal
   - Click a recipe to assign it
   - Add multiple recipes to the same slot with "+ Add Another Recipe"
4. **Remove Recipes**: Click the "✕" button on assigned recipes
5. **View Purchased Dates**: Look for green checkmarks (✓) on dates with purchased ingredients

### Generating Grocery Lists

1. **From Meal Plan**: Click "📝 Generate Grocery List" on the meal plan page
2. **Choose Generation Type**:
   - **Daily**: Select a specific date for single-day shopping
   - **Weekly**: Select start and end dates for week range
   - **Full Plan**: Generate for entire meal plan (default behavior)
3. **Review**: The system aggregates all ingredients and calculates estimated costs
4. **View Lists**: Navigate to `/grocery-list` to see all generated lists
5. **Mark as Purchased**: 
   - Click "Mark as Purchased" on any list
   - Enter the actual cost you paid
   - Confirm purchase
   - The system records which dates were purchased
6. **Smart Regeneration**: When generating new lists, the system automatically excludes meals from dates you've already purchased

### Viewing Statistics

- **Recipe Usage**: On `/recipes`, view the usage statistics chart showing how often each recipe is used
- **Spending**: On `/grocery-list`, view monthly and yearly spending totals
- **Home Page**: See today's planned meals in the sidebar

### Data Management

1. **Export Data**: Click "💾 Data" in the navigation → "Export Data"
2. **Import Data**: Click "💾 Data" → "Import Data" → Select JSON file
3. **Reset to Defaults**: Visit `/reset-data` → Click "Reset Database & Create Sample Data"

## 💾 Data Management

### Storage Architecture

The application uses a hybrid storage approach:

- **IndexedDB** (via idb-keyval): Primary storage for large datasets
  - Recipes: `recipe:recipe-001`, `recipe:recipe-002`, ...
  - Ingredients: `ingredient:ing-001`, `ingredient:ing-002`, ...
  - Meal Plans: `meal-plan:meal-plan-001`, ...
  - Grocery Lists: `grocery-list:list-001`, ...

- **LocalStorage**: Settings and flags
  - Initialization flag: `initialized`
  - User preferences

### Data Models

#### Recipe
```typescript
interface Recipe {
  id: string;                    // UUID
  name: string;                  // Recipe name
  imageUrl?: string;             // Optional image
  ingredients: RecipeIngredient[]; // Ingredient list
  instructions: string;          // Cooking steps
  totalCalories?: number;        // Optional calorie count
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}

interface RecipeIngredient {
  ingredientId: string;          // Reference to Ingredient
  quantity: number;              // Amount needed
  unit: string;                  // Measurement unit
}
```

#### Ingredient
```typescript
interface Ingredient {
  id: string;                    // UUID
  name: string;                  // Ingredient name
  description?: string;          // Optional notes
  unitPrice: number;             // Price per unit
  priceUnit: string;             // Unit for pricing
  remainingQuantity?: number;    // Current inventory
  quantityUnit?: string;         // Measurement unit
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

#### MealPlan
```typescript
interface MealPlan {
  id: string;                    // UUID
  name: string;                  // Plan name
  startDate: string;             // YYYY-MM-DD
  endDate: string;               // YYYY-MM-DD
  meals: MealAssignment[];       // Assigned meals
  createdAt: string;             // ISO 8601 timestamp
}

interface MealAssignment {
  date: string;                  // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipeIds: string[];           // Multiple recipes per slot
}
```

#### GroceryList
```typescript
interface GroceryList {
  id: string;                    // UUID
  mealPlanId: string;            // Source meal plan
  items: GroceryItem[];          // Ingredient list
  estimatedTotal: number;        // Calculated cost
  status: 'not-purchased' | 'purchased';
  actualCost: number | null;     // Actual paid amount
  purchaseDate: string | null;   // Purchase timestamp
  generationType: 'daily' | 'weekly' | 'full';
  generatedDate: string;         // When list was created
  targetDates: string[];         // Dates covered by this list
  purchasedDates: string[];      // Dates with purchased ingredients
  createdAt: string;             // ISO 8601 timestamp
}
```

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Development Workflow

1. **Run Development Server**: `npm run dev`
2. **Make Changes**: Edit files in `app/`, `components/`, or `lib/`
3. **Hot Reload**: Changes automatically reflect in the browser
4. **Type Check**: Run `npm run type-check` before committing
5. **Build Test**: Run `npm run build` to ensure production build works

### Adding New Features

1. **Create Types**: Define interfaces in `types/`
2. **Create Service**: Add business logic in `lib/services/`
3. **Create Store**: Add Zustand store in `lib/stores/`
4. **Create Hook**: Add custom hook in `lib/hooks/`
5. **Create Components**: Add UI components in `components/`
6. **Create Page**: Add route in `app/`

### Key Design Patterns

- **Service Layer Pattern**: Business logic separated from UI
- **Repository Pattern**: Storage abstraction through services
- **Custom Hooks Pattern**: State management through hooks
- **Compound Components**: Reusable UI components with composition
- **Controlled Components**: Form inputs with React state

## 🚀 Deployment

### Static Export

The application is built as a static export for deployment to any static hosting:

```bash
# Build for production
npm run build

# Output directory: ./out/
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
out
```

#### GitHub Pages
1. Build: `npm run build`
2. Copy `out/` contents to GitHub Pages branch
3. Push to repository

#### Static File Server
```bash
# Serve locally
npx serve out

# Or use any static file server
```

### Environment Configuration

No environment variables required. All configuration is in:
- `next.config.js`: Next.js settings
- `tailwind.config.js`: Styling configuration
- `tsconfig.json`: TypeScript settings

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**

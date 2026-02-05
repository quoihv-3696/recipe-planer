# Data Model: Recipe Management Application

**Phase**: 1 (Design & Contracts)  
**Date**: 2026-02-04  
**Purpose**: Define entity schemas, relationships, and storage structure

---

## Entity Overview

The Recipe Management Application has 4 core entities:

1. **Recipe**: Individual cooking recipes with ingredients and instructions
2. **Ingredient**: Inventory items with pricing and quantity tracking
3. **MealPlan**: Weekly meal schedules linking recipes to specific days/meals
4. **GroceryList**: Shopping lists generated from meal plans with purchase tracking

---

## Entity: Recipe

### Purpose
Stores complete recipe information including ingredients, cooking instructions, and nutritional data.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string (UUID) | Yes | Unique identifier | UUID v4 format |
| `name` | string | Yes | Recipe name/title | 1-100 characters |
| `imageUrl` | string | No | URL to recipe image | Valid URL or empty |
| `ingredients` | RecipeIngredient[] | Yes | List of ingredients with quantities | Min 1 ingredient |
| `instructions` | string | Yes | Cooking instructions | 1-5000 characters |
| `totalCalories` | number | No | Total caloric value | ≥ 0 |
| `createdAt` | string (ISO 8601) | Yes | Creation timestamp | ISO 8601 format |
| `updatedAt` | string (ISO 8601) | Yes | Last update timestamp | ISO 8601 format |

### Nested Type: RecipeIngredient

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ingredientId` | string (UUID) | Yes | Reference to Ingredient entity |
| `quantity` | number | Yes | Amount needed for recipe |
| `unit` | string | Yes | Unit of measurement (e.g., "grams", "cups", "pieces") |

### Example
```json
{
  "id": "recipe-001",
  "name": "Spaghetti Carbonara",
  "imageUrl": "https://example.com/images/carbonara.jpg",
  "ingredients": [
    {
      "ingredientId": "ing-001",
      "quantity": 400,
      "unit": "grams"
    },
    {
      "ingredientId": "ing-002",
      "quantity": 200,
      "unit": "grams"
    },
    {
      "ingredientId": "ing-003",
      "quantity": 4,
      "unit": "pieces"
    }
  ],
  "instructions": "1. Bring a large pot of salted water to boil.\n2. Cook spaghetti according to package directions.\n3. While pasta cooks, fry pancetta until crispy.\n4. Beat eggs with Parmesan cheese.\n5. Drain pasta, reserving 1 cup pasta water.\n6. Toss hot pasta with pancetta, then egg mixture.\n7. Add pasta water to reach desired consistency.\n8. Season with black pepper and serve immediately.",
  "totalCalories": 650,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-20T14:45:00Z"
}
```

### Relationships
- **Many-to-Many** with Ingredient (via `ingredients` array)
- **One-to-Many** with MealPlan.meals (recipes can be assigned to multiple meal slots)
- **One-to-Many** with GroceryList.items (via meal plan aggregation)

### Storage
- **Primary**: IndexedDB with key prefix `recipe:`
- **Indexing**: By `id`, sortable by `createdAt` or `name`

### Business Rules
1. Recipe name must be unique within user's collection (warning, not enforced)
2. Deleted ingredients show as "Deleted: [name]" in recipe view
3. Recipe can exist without ingredients (validation warning only)
4. Instructions support Markdown formatting (optional)

---

## Entity: Ingredient

### Purpose
Tracks ingredient inventory with pricing information for cost estimation and grocery list generation.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string (UUID) | Yes | Unique identifier | UUID v4 format |
| `name` | string | Yes | Ingredient name | 1-100 characters |
| `description` | string | No | Notes or details about ingredient | 0-500 characters |
| `unitPrice` | number | Yes | Price per unit | ≥ 0 |
| `priceUnit` | string | Yes | Unit for pricing (e.g., "per kg", "per item") | 1-20 characters |
| `remainingQuantity` | number | No | Current inventory quantity | ≥ 0 |
| `quantityUnit` | string | No | Unit for quantity (e.g., "kg", "items", "liters") | 1-20 characters |
| `createdAt` | string (ISO 8601) | Yes | Creation timestamp | ISO 8601 format |
| `updatedAt` | string (ISO 8601) | Yes | Last update timestamp | ISO 8601 format |

### Example
```json
{
  "id": "ing-001",
  "name": "Spaghetti Pasta",
  "description": "Italian durum wheat pasta",
  "unitPrice": 2.5,
  "priceUnit": "per kg",
  "remainingQuantity": 1.5,
  "quantityUnit": "kg",
  "createdAt": "2026-01-10T09:00:00Z",
  "updatedAt": "2026-02-01T15:30:00Z"
}
```

### Relationships
- **Many-to-Many** with Recipe (via Recipe.ingredients array)
- **One-to-Many** with GroceryList.items (ingredients appear in shopping lists)

### Storage
- **Primary**: IndexedDB with key prefix `ingredient:`
- **Indexing**: By `id`, sortable by `name`

### Business Rules
1. Ingredient name should be unique (warning if duplicate exists)
2. Warn user before deleting ingredient if used in recipes
3. Price unit and quantity unit are free-text (no unit conversion in v1)
4. Remaining quantity is optional (for future inventory management)

---

## Entity: MealPlan

### Purpose
Organizes recipes into weekly meal schedules, enabling meal planning and grocery list generation.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string (UUID) | Yes | Unique identifier | UUID v4 format |
| `name` | string | Yes | Meal plan name/description | 1-100 characters |
| `startDate` | string (ISO 8601 date) | Yes | Plan start date (Monday) | ISO 8601 date, YYYY-MM-DD |
| `endDate` | string (ISO 8601 date) | Yes | Plan end date (Sunday) | ISO 8601 date, YYYY-MM-DD |
| `meals` | MealAssignment[] | Yes | Array of meal assignments | Can be empty array |
| `createdAt` | string (ISO 8601) | Yes | Creation timestamp | ISO 8601 format |

### Nested Type: MealAssignment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string (ISO 8601 date) | Yes | Meal date (YYYY-MM-DD) |
| `mealType` | "breakfast" \| "lunch" \| "dinner" | Yes | Type of meal |
| `recipeId` | string (UUID) | Yes | Reference to Recipe entity |

### Example
```json
{
  "id": "plan-001",
  "name": "Week of Feb 5-11, 2026",
  "startDate": "2026-02-05",
  "endDate": "2026-02-11",
  "meals": [
    {
      "date": "2026-02-05",
      "mealType": "breakfast",
      "recipeId": "recipe-010"
    },
    {
      "date": "2026-02-05",
      "mealType": "lunch",
      "recipeId": "recipe-015"
    },
    {
      "date": "2026-02-05",
      "mealType": "dinner",
      "recipeId": "recipe-001"
    },
    {
      "date": "2026-02-06",
      "mealType": "dinner",
      "recipeId": "recipe-003"
    }
  ],
  "createdAt": "2026-02-04T12:00:00Z"
}
```

### Relationships
- **Many-to-One** with Recipe (each meal assignment references one recipe)
- **One-to-One** with GroceryList (each meal plan can generate one grocery list)

### Storage
- **Primary**: IndexedDB with key prefix `meal-plan:`
- **Indexing**: By `id`, sortable by `startDate`

### Business Rules
1. `endDate` must be ≥ `startDate` (validated on save)
2. Meals can be assigned to any date within plan range
3. Multiple meal plans can overlap (user can plan ahead for multiple weeks)
4. Deleted recipes show as "Recipe Deleted" in meal plan view with option to reassign
5. Meal types limited to: breakfast, lunch, dinner (no snacks in v1)

---

## Entity: GroceryList

### Purpose
Aggregates ingredients from meal plans into shopping lists with purchase tracking and cost management.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string (UUID) | Yes | Unique identifier | UUID v4 format |
| `mealPlanId` | string (UUID) | Yes | Reference to source MealPlan | Valid meal plan ID |
| `items` | GroceryItem[] | Yes | List of ingredients to purchase | Can be empty array |
| `estimatedTotal` | number | Yes | Total estimated cost | ≥ 0, calculated from items |
| `status` | "not_purchased" \| "purchased" | Yes | Purchase status | Enum value only |
| `actualCost` | number | No | Actual amount spent (null if not purchased) | ≥ 0 or null |
| `purchaseDate` | string (ISO 8601) | No | Date of purchase (null if not purchased) | ISO 8601 format or null |
| `createdAt` | string (ISO 8601) | Yes | Creation timestamp | ISO 8601 format |

### Nested Type: GroceryItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ingredientId` | string (UUID) | Yes | Reference to Ingredient entity |
| `quantity` | number | Yes | Total quantity needed |
| `unit` | string | Yes | Unit of measurement |
| `estimatedPrice` | number | Yes | Estimated cost for this item |

### Example
```json
{
  "id": "grocery-001",
  "mealPlanId": "plan-001",
  "items": [
    {
      "ingredientId": "ing-001",
      "quantity": 1.2,
      "unit": "kg",
      "estimatedPrice": 3.0
    },
    {
      "ingredientId": "ing-002",
      "quantity": 0.5,
      "unit": "kg",
      "estimatedPrice": 4.5
    },
    {
      "ingredientId": "ing-003",
      "quantity": 12,
      "unit": "pieces",
      "estimatedPrice": 2.4
    }
  ],
  "estimatedTotal": 9.9,
  "status": "purchased",
  "actualCost": 10.5,
  "purchaseDate": "2026-02-05T16:30:00Z",
  "createdAt": "2026-02-04T14:00:00Z"
}
```

### Relationships
- **Many-to-One** with MealPlan (generated from one meal plan)
- **Many-to-Many** with Ingredient (via items array)

### Storage
- **Primary**: IndexedDB with key prefix `grocery-list:`
- **Indexing**: By `id`, filterable by `status`, sortable by `createdAt` or `purchaseDate`

### Business Rules
1. Grocery list auto-generated from meal plan (aggregates all recipe ingredients)
2. Quantities aggregated by ingredient (sum across all recipes in meal plan)
3. Estimated total calculated from ingredient unit prices × quantities
4. Status starts as "not_purchased"
5. When marking as "purchased", user must enter `actualCost`
6. `purchaseDate` auto-set to current date when marked purchased
7. Deleted ingredients show with name placeholder in grocery list

---

## Data Aggregation Logic

### Grocery List Generation Algorithm

```
Input: MealPlan with meals[]

1. Extract all recipeIds from meals array
2. For each recipe:
   a. Fetch full recipe details
   b. For each ingredient in recipe.ingredients:
      - Add to aggregation map by ingredientId
      - Sum quantities (assuming same unit)
3. For each aggregated ingredient:
   a. Fetch ingredient details for pricing
   b. Calculate estimatedPrice = quantity × unitPrice
4. Sum all estimatedPrices → estimatedTotal
5. Create GroceryList entity with:
   - items[] containing aggregated ingredients
   - estimatedTotal
   - status = "not_purchased"
   - actualCost = null
   - purchaseDate = null
```

### Spending Statistics Calculation

```
Monthly Spending:
1. Filter all GroceryLists where status = "purchased"
2. Filter by purchaseDate within selected month
3. Sum all actualCost values

Yearly Spending:
1. Filter all GroceryLists where status = "purchased"
2. Filter by purchaseDate within selected year
3. Sum all actualCost values
4. Group by month for monthly breakdown
```

---

## Storage Schema

### IndexedDB Key Prefixes

All entities stored with prefixed keys for namespacing:

```
recipe:recipe-001 → Recipe object
recipe:recipe-002 → Recipe object
...
ingredient:ing-001 → Ingredient object
ingredient:ing-002 → Ingredient object
...
meal-plan:plan-001 → MealPlan object
meal-plan:plan-002 → MealPlan object
...
grocery-list:grocery-001 → GroceryList object
grocery-list:grocery-002 → GroceryList object
```

### localStorage Keys

```
data-initialized → "true" (marker for mock data hydration)
user-preferences → JSON object with app settings
```

---

## Validation Rules Summary

| Entity | Field | Rule |
|--------|-------|------|
| All | id | UUID v4 format |
| All | *required fields* | Cannot be empty/null |
| Recipe | name | 1-100 characters |
| Recipe | instructions | 1-5000 characters |
| Recipe | totalCalories | ≥ 0 |
| Recipe | ingredients | Min 1 ingredient (warning only) |
| Ingredient | name | 1-100 characters |
| Ingredient | unitPrice | ≥ 0 |
| Ingredient | remainingQuantity | ≥ 0 |
| MealPlan | name | 1-100 characters |
| MealPlan | endDate | ≥ startDate |
| MealPlan | meals[].mealType | "breakfast", "lunch", or "dinner" |
| GroceryList | estimatedTotal | ≥ 0 |
| GroceryList | actualCost | ≥ 0 or null |
| GroceryList | status | "not_purchased" or "purchased" |

---

## Migration Strategy (Future)

When data schema changes:

1. **Version Field**: Add `schemaVersion` to localStorage
2. **Migration Functions**: Write transformers for each version
3. **On Load**: Check schema version, run migrations if needed
4. **Backup**: Export data before migration

Example:
```typescript
const CURRENT_SCHEMA_VERSION = 2;

async function migrateData() {
  const version = localStorage.getItem('schemaVersion') || '1';
  if (version < CURRENT_SCHEMA_VERSION) {
    // Run migration
    await exportData(); // Backup first
    await runMigrations(version, CURRENT_SCHEMA_VERSION);
    localStorage.setItem('schemaVersion', CURRENT_SCHEMA_VERSION);
  }
}
```

---

**Status**: ✅ Data model complete. TypeScript interfaces generated in contracts/ directory.

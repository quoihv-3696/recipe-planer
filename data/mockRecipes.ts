/**
 * Mock Recipe Data
 * 
 * Sample recipes for initial data population
 */

import { Recipe } from '@/types/Recipe';

export const mockRecipes: Recipe[] = [
  {
    id: 'recipe-001',
    name: 'Classic Spaghetti Carbonara',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    ingredients: [
      { ingredientId: 'ing-001', quantity: 400, unit: 'grams' },
      { ingredientId: 'ing-002', quantity: 4, unit: 'pieces' },
      { ingredientId: 'ing-003', quantity: 150, unit: 'grams' },
      { ingredientId: 'ing-004', quantity: 50, unit: 'grams' },
    ],
    instructions: `1. Bring a large pot of salted water to boil for the pasta.
2. While water is heating, cut bacon into small strips.
3. Beat eggs in a bowl and mix with grated Parmesan cheese.
4. Cook pasta according to package directions until al dente.
5. While pasta cooks, fry bacon in a large skillet until crispy.
6. Reserve 1 cup pasta water, then drain pasta.
7. Add hot pasta to the skillet with bacon.
8. Remove from heat and quickly stir in egg mixture.
9. Add pasta water gradually to create a creamy sauce.
10. Season with black pepper and serve immediately.`,
    totalCalories: 650,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'recipe-002',
    name: 'Greek Salad',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    ingredients: [
      { ingredientId: 'ing-005', quantity: 3, unit: 'pieces' },
      { ingredientId: 'ing-006', quantity: 2, unit: 'pieces' },
      { ingredientId: 'ing-007', quantity: 1, unit: 'piece' },
      { ingredientId: 'ing-008', quantity: 200, unit: 'grams' },
      { ingredientId: 'ing-009', quantity: 100, unit: 'grams' },
      { ingredientId: 'ing-010', quantity: 3, unit: 'tablespoons' },
    ],
    instructions: `1. Wash and chop tomatoes into wedges.
2. Peel and slice cucumber into half-moons.
3. Dice red onion into thin slices.
4. Cut feta cheese into cubes.
5. In a large bowl, combine tomatoes, cucumber, onion, and olives.
6. Top with feta cheese cubes.
7. Drizzle with olive oil and season with salt and oregano.
8. Toss gently and serve immediately.`,
    totalCalories: 320,
    createdAt: '2026-01-16T14:30:00Z',
    updatedAt: '2026-01-16T14:30:00Z',
  },
  {
    id: 'recipe-003',
    name: 'Chicken Stir-Fry',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    ingredients: [
      { ingredientId: 'ing-011', quantity: 500, unit: 'grams' },
      { ingredientId: 'ing-012', quantity: 2, unit: 'pieces' },
      { ingredientId: 'ing-013', quantity: 1, unit: 'piece' },
      { ingredientId: 'ing-014', quantity: 200, unit: 'grams' },
      { ingredientId: 'ing-015', quantity: 3, unit: 'tablespoons' },
    ],
    instructions: `1. Cut chicken breast into bite-sized strips.
2. Slice bell peppers and broccoli into similar-sized pieces.
3. Mince garlic and ginger.
4. Heat oil in a wok or large skillet over high heat.
5. Add chicken and stir-fry for 5-7 minutes until cooked through.
6. Remove chicken and set aside.
7. Add garlic and ginger, stir-fry for 30 seconds.
8. Add vegetables and stir-fry for 3-4 minutes until tender-crisp.
9. Return chicken to the wok and add soy sauce.
10. Toss everything together and serve with rice.`,
    totalCalories: 450,
    createdAt: '2026-01-17T18:00:00Z',
    updatedAt: '2026-01-17T18:00:00Z',
  },
  {
    id: 'recipe-004',
    name: 'Vegetable Soup',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    ingredients: [
      { ingredientId: 'ing-016', quantity: 2, unit: 'pieces' },
      { ingredientId: 'ing-017', quantity: 3, unit: 'pieces' },
      { ingredientId: 'ing-018', quantity: 2, unit: 'pieces' },
      { ingredientId: 'ing-005', quantity: 2, unit: 'pieces' },
      { ingredientId: 'ing-019', quantity: 1500, unit: 'ml' },
    ],
    instructions: `1. Peel and dice all vegetables into small cubes.
2. Heat oil in a large pot over medium heat.
3. Sauté onions and garlic until soft and fragrant.
4. Add carrots and celery, cook for 5 minutes.
5. Add tomatoes and vegetable broth.
6. Bring to a boil, then reduce heat and simmer for 20 minutes.
7. Season with salt, pepper, and herbs to taste.
8. Serve hot with crusty bread.`,
    totalCalories: 180,
    createdAt: '2026-01-18T12:00:00Z',
    updatedAt: '2026-01-18T12:00:00Z',
  },
  {
    id: 'recipe-005',
    name: 'Pancakes',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
    ingredients: [
      { ingredientId: 'ing-020', quantity: 200, unit: 'grams' },
      { ingredientId: 'ing-002', quantity: 2, unit: 'pieces' },
      { ingredientId: 'ing-021', quantity: 300, unit: 'ml' },
      { ingredientId: 'ing-022', quantity: 2, unit: 'tablespoons' },
      { ingredientId: 'ing-023', quantity: 1, unit: 'teaspoon' },
    ],
    instructions: `1. In a large bowl, whisk together flour, sugar, baking powder, and salt.
2. In another bowl, beat eggs and add milk.
3. Pour wet ingredients into dry ingredients and mix until just combined (don't overmix).
4. Heat a non-stick pan over medium heat and lightly grease.
5. Pour 1/4 cup of batter for each pancake.
6. Cook until bubbles form on surface, about 2-3 minutes.
7. Flip and cook until golden brown, another 2 minutes.
8. Serve warm with maple syrup and butter.`,
    totalCalories: 380,
    createdAt: '2026-01-19T08:00:00Z',
    updatedAt: '2026-01-19T08:00:00Z',
  },
];

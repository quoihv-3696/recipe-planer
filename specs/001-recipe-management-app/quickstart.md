# Quickstart Guide: Recipe Management Application

**Purpose**: Get the development environment up and running quickly  
**Target Audience**: Developers setting up the project for the first time  
**Estimated Setup Time**: 10-15 minutes

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or later ([Download](https://nodejs.org/))
- **npm**: Version 9.x or later (comes with Node.js) OR
- **pnpm**: Version 8.x or later (recommended for faster installs)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with ESLint and Prettier extensions)

Verify installations:
```bash
node --version  # Should be v20.x or higher
npm --version   # Should be 9.x or higher
git --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd recipe-planer
```

### 2. Install Dependencies

Choose your package manager:

**Using npm:**
```bash
npm install
```

**Using pnpm (recommended):**
```bash
pnpm install
```

**Using yarn:**
```bash
yarn install
```

This will install:
- Next.js 14+
- React 18+
- TailwindCSS 3+
- TypeScript 5.3+
- date-fns
- zustand
- idb-keyval
- And development dependencies

---

## Project Structure

```
recipe-planer/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with navigation
│   │   ├── page.tsx         # Home page (dashboard)
│   │   ├── recipes/         # Recipe management pages
│   │   ├── ingredients/     # Ingredient management
│   │   ├── meal-plan/       # Meal planning calendar
│   │   └── grocery-list/    # Grocery list & statistics
│   ├── components/          # Reusable React components
│   │   ├── layout/          # Navigation, sidebar, etc.
│   │   ├── recipe/          # Recipe-specific components
│   │   ├── ingredient/      # Ingredient components
│   │   ├── meal-plan/       # Meal planning components
│   │   ├── grocery/         # Grocery list components
│   │   └── common/          # Shared UI components
│   ├── lib/                 # Business logic & utilities
│   │   ├── storage/         # localStorage/IndexedDB wrappers
│   │   ├── services/        # CRUD operations & business logic
│   │   ├── utils/           # Helper functions
│   │   └── hooks/           # Custom React hooks
│   ├── data/                # Mock data (embedded in source)
│   │   ├── mockRecipes.ts
│   │   ├── mockIngredients.ts
│   │   └── mockMealPlans.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── Recipe.ts
│   │   ├── Ingredient.ts
│   │   ├── MealPlan.ts
│   │   └── GroceryList.ts
│   └── styles/
│       └── globals.css      # Global styles & Tailwind
├── public/                  # Static assets
├── specs/                   # Feature specifications
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

---

## Development Commands

### Start Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

This starts the Next.js development server with:
- **Hot Reload**: Changes reflect immediately
- **Fast Refresh**: React component state preserved
- **URL**: http://localhost:3000

### Build for Production

```bash
npm run build
# or
pnpm build
# or
yarn build
```

This generates a static export in the `out/` directory with:
- Optimized JavaScript bundles
- Minified CSS
- Pre-rendered HTML pages
- Static assets

### Preview Production Build

```bash
npm run build
npx serve out
# or
pnpm build
npx serve out
```

Opens a local server to test the production build at http://localhost:3000

### Lint Code

```bash
npm run lint
# or
pnpm lint
```

Runs ESLint to check for code quality issues.

### Format Code

```bash
npm run format
# or
pnpm format
```

Runs Prettier to format code (if configured).

---

## Configuration

### Next.js Configuration

The `next.config.js` is pre-configured for static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Generate static HTML/CSS/JS
  images: {
    unoptimized: true,        // Required for static export
  },
  trailingSlash: true,        // Better static host compatibility
}
module.exports = nextConfig
```

### TailwindCSS Configuration

The `tailwind.config.js` includes mobile-first breakpoints:

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Custom colors, fonts, etc. can be added here
    },
  },
  plugins: [],
}
```

**Default Breakpoints:**
- Mobile: 0px+ (default, no prefix)
- `sm:` 640px+ (large phones)
- `md:` 768px+ (tablets)
- `lg:` 1024px+ (desktops)

### TypeScript Configuration

Strict mode enabled for type safety. Import aliases configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Use imports like: `import { Recipe } from '@/types/Recipe'`

---

## First Run

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Open in Browser

Navigate to: **http://localhost:3000**

### 3. Mock Data Initialization

On first load, the application will:
1. Check if data is already initialized (`localStorage.getItem('data-initialized')`)
2. If not, hydrate IndexedDB with mock data from `src/data/`
3. Set initialization flag to prevent re-hydration

You should see:
- Home page with today's meal plan (if any) and recipe list
- Sample recipes, ingredients, and meal plans from mock data

### 4. Verify Installation

Check that all pages load:
- ✅ Home (http://localhost:3000)
- ✅ Recipes (http://localhost:3000/recipes)
- ✅ Ingredients (http://localhost:3000/ingredients)
- ✅ Meal Plan (http://localhost:3000/meal-plan)
- ✅ Grocery List (http://localhost:3000/grocery-list)

---

## Testing

### Manual Testing (Mandatory)

This project uses manual testing as the primary QA approach:

1. **Cross-Device Testing**
   - Test on iPhone (Safari iOS)
   - Test on Android phone (Chrome Android)
   - Test on tablet (iPad or Android tablet)
   - Test on desktop (Chrome, Firefox, Safari)

2. **Responsive Testing**
   - Use browser DevTools to test viewports:
     - 320px (iPhone SE)
     - 375px (iPhone 12)
     - 768px (iPad)
     - 1024px (iPad Pro / laptop)
     - 1440px (desktop)

3. **Accessibility Testing**
   - Navigate using keyboard only (Tab, Enter, Escape)
   - Test with VoiceOver (macOS) or TalkBack (Android)
   - Check color contrast with browser tools

4. **Data Persistence Testing**
   - Add/edit/delete entities
   - Refresh page → verify data persists
   - Export data → verify JSON file
   - Clear browser storage → import data → verify restoration

### Optional Unit Testing

If you want to add unit tests:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create tests in `__tests__/` or co-located with files (`ComponentName.test.tsx`).

---

## Deployment

### Static Export

Build the static site:

```bash
npm run build
```

This generates the `out/` directory with all static files.

### Deploy to Static Hosts

**GitHub Pages:**
```bash
# After build, push out/ directory to gh-pages branch
npm install -g gh-pages
gh-pages -d out
```

**Netlify:**
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `out`

**Vercel:**
1. Connect repository to Vercel
2. Vercel auto-detects Next.js and handles build

**Other Static Hosts:**
Upload contents of `out/` directory to any static file host.

---

## Troubleshooting

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000
# or use different port
npm run dev -- -p 3001
```

### Issue: Module Not Found Errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P) → "TypeScript: Restart TS Server"
# or clear build cache
rm -rf .next
npm run dev
```

### Issue: Data Not Persisting

**Solution:**
1. Open Browser DevTools → Application → IndexedDB
2. Verify `keyvaluepairs` store exists
3. Check Console for quota errors
4. Clear IndexedDB and reload page to re-initialize

### Issue: Styles Not Loading

**Solution:**
```bash
# Rebuild CSS
rm -rf .next
npm run dev
```

---

## Development Workflow

### Adding a New Feature

1. **Specification**: Document in `specs/` directory
2. **Planning**: Review technical approach in plan.md
3. **Implementation**:
   - Create TypeScript interfaces in `src/types/`
   - Implement service layer in `src/lib/services/`
   - Build UI components in `src/components/`
   - Create page in `src/app/`
4. **Testing**: Manual testing on real devices
5. **Refinement**: Performance optimization, accessibility audit

### Code Style

- Use TypeScript strict mode
- Follow React best practices (hooks, functional components)
- Use TailwindCSS utility classes (avoid custom CSS when possible)
- Implement error boundaries for graceful error handling
- Add JSDoc comments for complex functions

---

## Environment Variables

No environment variables required for this static application.

If you need to add configuration:
1. Create `.env.local` file (gitignored)
2. Prefix with `NEXT_PUBLIC_` for client-side access
3. Reference via `process.env.NEXT_PUBLIC_VARIABLE_NAME`

---

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **TailwindCSS Documentation**: https://tailwindcss.com/docs
- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **date-fns Documentation**: https://date-fns.org/docs/
- **Zustand Documentation**: https://docs.pmnd.rs/zustand/

---

## Getting Help

- **Issues**: Check `specs/001-recipe-management-app/plan.md` for architecture decisions
- **Data Model**: Refer to `specs/001-recipe-management-app/data-model.md`
- **Contracts**: TypeScript interfaces in `specs/001-recipe-management-app/contracts/`

---

**Ready to Start**: You should now have a fully functional development environment. Happy coding! 🚀

<!--
SYNC IMPACT REPORT:
Version Change: [none] → 1.0.0
Initial constitution ratification for Recipe Planner project.

Principles Defined:
  - I. Client-Side First (Static Web Application)
  - II. Mobile-First Responsive Design (NON-NEGOTIABLE)
  - III. Local Data Privacy
  - IV. Modular Component Architecture
  - V. Progressive Enhancement

Templates Status:
  ✅ plan-template.md - Aligned with web static structure
  ✅ spec-template.md - User story format compatible
  ✅ tasks-template.md - Task organization compatible

Follow-up Actions:
  - None: All placeholders resolved
  - Constitution ready for initial ratification
-->

# Recipe Planner Constitution

## Core Principles

### I. Client-Side First (Static Web Application)
All functionality MUST run entirely in the browser without backend dependencies. No server-side processing, authentication, or data persistence beyond browser storage (localStorage, IndexedDB). This ensures the application can be hosted on any static file server (GitHub Pages, Netlify, Vercel) and guarantees user data privacy and offline capability.

**Rationale**: Static hosting is free, highly available, and eliminates infrastructure complexity for personal use. Users retain full control of their data without requiring accounts or cloud services.

### II. Mobile-First Responsive Design (NON-NEGOTIABLE)
All UI components MUST be designed mobile-first with responsive breakpoints for tablet and desktop. Touch targets MUST be minimum 44x44px. Navigation MUST work with one hand on mobile devices. CSS Grid and Flexbox MUST be used for layouts. No feature ships until mobile experience is validated.

**Rationale**: Personal recipe and meal planning primarily happens in the kitchen on mobile devices. Desktop support is secondary but required for recipe entry convenience.

### III. Local Data Privacy
All user data (recipes, meal plans, ingredient lists) MUST be stored locally in the browser (localStorage or IndexedDB). Export/import functionality MUST be provided for data portability (JSON format). No analytics, tracking, or external API calls without explicit user consent.

**Rationale**: Personal recipe data may contain sensitive information (dietary restrictions, allergies, preferences). Users must have complete control and ownership of their data.

### IV. Modular Component Architecture
Features MUST be built as independent, reusable components with clear separation of concerns:
- Data layer (models, storage interface)
- Business logic (recipe calculations, meal planning algorithms)
- UI components (view templates, event handlers)
- Utility functions (date helpers, formatting, validation)

Each component MUST be independently testable and documented.

**Rationale**: Modular architecture enables incremental development, easier testing, and future extensibility without creating technical debt.

### V. Progressive Enhancement
Core functionality (view recipes, create meal plans, generate shopping lists) MUST work with JavaScript disabled where feasible. Enhanced features (drag-and-drop, real-time search, animations) layer on top. Application MUST be accessible (WCAG 2.1 AA minimum) with keyboard navigation and screen reader support.

**Rationale**: Ensures broad device compatibility, accessibility for users with disabilities, and graceful degradation in constrained environments.

## Technical Requirements

### Technology Stack
- **HTML5**: Semantic markup, accessibility attributes (ARIA where needed)
- **CSS3**: Custom properties (CSS variables) for theming, Grid/Flexbox for layout, no CSS frameworks required
- **Vanilla JavaScript (ES6+)**: No framework dependencies initially (React/Vue can be introduced later if complexity demands)
- **Local Storage**: localStorage for simple data, IndexedDB for complex queries and large datasets
- **Build Tools**: Optional - Consider Vite or Parcel for development, but production bundle must be framework-free

### Performance Standards
- **First Contentful Paint**: <1.5s on 3G mobile connection
- **Time to Interactive**: <3s on mid-range mobile device
- **JavaScript Bundle**: <100KB gzipped total
- **Images**: WebP format with fallbacks, lazy loading for recipe photos
- **Lighthouse Score**: 90+ on Performance, Accessibility, Best Practices, SEO

### Browser Support
- **Mobile**: iOS Safari 13+, Chrome Android 90+
- **Desktop**: Chrome/Edge 90+, Firefox 88+, Safari 13+
- **Graceful Degradation**: Display warning for unsupported browsers with recommendation to upgrade

## Development Workflow

### Feature Development Process
1. **Specification**: Define user stories with acceptance criteria (use `.specify/templates/spec-template.md`)
2. **Planning**: Technical design, data model, component breakdown (use `.specify/templates/plan-template.md`)
3. **Implementation**: Build components incrementally, mobile-first
4. **Manual Testing**: Test on real mobile devices (iOS + Android), keyboard navigation, screen readers
5. **Refinement**: Performance optimization, accessibility audit

### Quality Gates
- **Mobile Responsiveness**: Every feature tested on viewport widths: 320px (mobile), 768px (tablet), 1024px (desktop)
- **Accessibility**: Keyboard navigation verified, color contrast checked (4.5:1 minimum for normal text)
- **Data Integrity**: Export/import tested, localStorage/IndexedDB operations validated
- **Performance**: Bundle size checked, Lighthouse audit run on production build

### Testing Approach
Testing is OPTIONAL but recommended for complex business logic (meal planning algorithms, ingredient calculations). When tests are included:
- Unit tests for utility functions and data models
- Integration tests for storage operations
- Manual testing MANDATORY for UI/UX validation on target devices

## Governance

This constitution establishes the architectural and quality standards for the Recipe Planner project. All features, designs, and implementations MUST comply with these principles.

### Amendment Process
- **Minor Updates** (clarifications, examples): Direct edit with changelog comment
- **Principle Changes** (new constraints, removed requirements): Requires version bump and impact analysis on existing features
- **Version Scheme**: Semantic versioning (MAJOR.MINOR.PATCH)
  - MAJOR: Backward-incompatible principle changes (e.g., introducing backend requirement)
  - MINOR: New principle additions or significant expansions
  - PATCH: Clarifications, wording improvements, non-semantic changes

### Compliance Review
- **Pre-Implementation**: Check `.specify/templates/plan-template.md` "Constitution Check" section before starting any feature
- **During Development**: Reference relevant principles when making architectural decisions
- **Complexity Justification**: Any deviation from principles MUST be documented with rationale in spec or plan documents

### Runtime Guidance
For day-to-day development workflows and command usage, refer to `.specify/templates/commands/*.md` files (not this constitution). This document defines **WHAT** must be built and to what standards; command files define **HOW** to execute the development process.

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04

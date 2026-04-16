# Recipe recommender

A small React app that recommends meals based on cuisine area and ingredients, powered by [TheMealDB](https://www.themealdb.com/api.php) API.

**Live app:** [https://reciperecommenderapp.netlify.app/](https://reciperecommenderapp.netlify.app/)

## Stack and libraries

### Vite

Vite is a modern, minimal build tool. It stays out of the way of how you structure the project—no opinionated folder layout—so it is a good fit for greenfield work where you want to own the architecture.

### TanStack Query (with `ky`)

HTTP calls use `ky` as the fetch client; TanStack Query wraps those calls. Query gives caching, background refetching, and request lifecycle handling out of the box, which keeps data-fetching logic predictable and avoids ad hoc loading/error state.

### TanStack Form

Form state and validation are handled with TanStack Form instead of hand-rolled validation logic.

### TanStack Router

A type-safe, file-friendly router that works well as an alternative to React Router or full-stack frameworks like Next.js: headless, modern, and strong TypeScript integration.

### Zustand

Global UI and app state use Zustand. It is lightweight, does not require wrapping the tree in providers for basic usage, and subscribers re-render only where the store is used—often simpler than Redux for small to medium apps.

### Zod

TypeScript helps at compile time; Zod validates at runtime at boundaries such as forms and HTTP responses so invalid data fails fast and predictably.

### shadcn/ui

UI is built on shadcn/ui: Radix primitives, Tailwind styling, and copy-paste components you can change in your own codebase. Components follow accessible patterns (including ARIA) and are a solid base to customize.

### Vitest

Unit and integration tests use Vitest—the tooling feels like a modern Jest-style stack (familiar APIs, fast runs) with first-class Vite integration.

## Testing

`pnpm test` / `pnpm test:run` executes the Vitest suite. Example output from a successful run:

```
 Test Files  14 passed (14)
      Tests  58 passed (58)
```

Coverage includes the multi-step recommendation form (steps 1–3, meals–ingredients sync), data hooks (`useHistory`, `useMealsIngredients`, `useRecommendedMeals`), recipe history views, the recommended-meal UI, shared components such as `image`, and an integration test that walks the full flow with HTTP-backed data.

## Technical decisions

### Working around TheMealDB’s API

The public API is limited. For example, there is no endpoint to list ingredients filtered by area. To fill the ingredient combobox, the app:

1. Loads all meals for the selected area.
2. For each meal, fetches full details via `lookup.php?i=<meal_id>`.
3. Collects ingredients from those responses and deduplicates them for the UI.

Meals for the selected area and the derived ingredient list are kept in memory for the rest of the flow.

### When data is fetched (step 1)

Step 1 performs:

1. One request for all areas.
2. One request for all meals in the selected area.
3. Requests for full meal records as needed to build the ingredient list.

TanStack Query caches these results with a long-lived (effectively infinite) policy while the app is in use, because this reference data does not change during a session. Queries run when their inputs (e.g. selected area) change, not on every render.

### Recommendation logic (step 3)

By the time the user reaches step 3, candidate meals for the selected area are already in memory—no extra round-trips for the ranking step.

From the API shape, ingredients appear in ordered fields `strIngredient1`, `strIngredient2`, … from more “primary” to more generic. The app treats lower indices as higher importance and ranks suggestions so meals that match more important ingredients surface first.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start dev server         |
| `pnpm build`   | Typecheck + production build |
| `pnpm preview` | Preview production build |
| `pnpm test`    | Run tests (Vitest)       |
| `pnpm test:cov`| Tests with coverage      |
| `pnpm lint`    | ESLint                   |

## Adding shadcn components

```bash
npx shadcn@latest add button
```

Components are added under `src/components` (e.g. `@/components/ui/button`).

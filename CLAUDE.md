# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npx nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Commands

```bash
# Serve the app locally
npx nx serve workshop

# Build
npx nx build workshop

# Lint a project
npx nx lint workshop
npx nx lint <lib-name>

# Run all tests
npx nx test workshop
npx nx run-many -t test

# Run a single test file
npx nx test <project-name> -- --testFile=<path-to-spec-file>

# Run affected projects only
npx nx affected -t build
npx nx affected -t test
npx nx affected -t lint
```

## Architecture

This is an **Nx monorepo** (`npm` package manager) for an Angular 21 workshop application — a plant catalogue with zoneless change detection.

### App

- `apps/workshop` — the single Angular application. Uses `provideZonelessChangeDetection()` and `provideRouter` with `withComponentInputBinding()`. Routes lazy-load feature shells from `libs/`.

### Library structure

Library directories follow the naming pattern `<scope>-<type>-<name>` (e.g. `catalogue-data-access`). Each lib exports only through its `index.ts` barrel file — never import from internal paths directly. Tag every new lib with `scope:<domain>` and `type:<feature|ui|data-access|util>`.

**Dependency direction:** feature libs may depend on `ui` and `data-access` libs — never the reverse.

Libraries are grouped by domain under `libs/`:

```
libs/
  catalogue/
    data-access/       — ProductsApi (HTTP), FavoritesState (global signal state)
    types/             — Shared interfaces: ProductsResponse, Comment
    feature-shell/     — Lazy route definitions for the catalogue domain
    feature-catalogue-list/    — CatalogueComponent + CatalogueLocalState
    feature-catalogue-details/ — ProductDetailsComponent + ProductDetailState
  home/
    feature-home/      — HomePageComponent
    feature-shell/     — Lazy route definitions for the home domain
  shared/
    types/             — Cross-domain types (PageableResponse, search types)
    ui/
      ui-header/       — HeaderComponent (toolbar with nav + favorites badge)
      ui-hero/         — HeroComponent
      ui-product-card/ — ProductCardComponent
```

### State management pattern

State is managed with Angular Signals — no NgRx or other state library. Prefer signals over RxJS for local component state; RxJS is used only at the data-access boundary (e.g. `rxResource`, `HttpClient`).

- **Global state** (`providedIn: 'root'`): `FavoritesState` — holds a `Set<string>` of favorite product IDs via a `signal`, with a `computed` count.
- **Local state** (provided in component): `CatalogueLocalState`, `ProductDetailState` — scoped to the feature component via `providers: [...]` in `@Component`. These use `rxResource` to load data reactively from `ProductsApi`, and `linkedSignal` to accumulate paginated results.

### Data access

`ProductsApi` calls a **Supabase REST API** directly via `HttpClient`. The API key and host are hardcoded in the service (with a TODO to move auth headers to an interceptor). Pagination uses the `Range` header; total count is parsed from the `Content-Range` response header.

### Import paths

All cross-library imports use path aliases defined in `tsconfig.base.json`. The pattern is `@workshop/<domain>-<type>`, e.g.:
- `@workshop/catalogue-data-access`
- `@workshop/catalogue-types`
- `@workshop/shared-ui-product-card`
- `@workshop/home-feature-shell`

### Angular conventions

- All components use `ChangeDetectionStrategy.OnPush`
- Standalone components only (no NgModules)
- `inject()` function instead of constructor injection
- `input()` signal-based inputs
- SCSS for styles
- Jest for unit tests (`jest-preset-angular`)

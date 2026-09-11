---
name: greenheaven-angular-ngxs
description: >
  GreenHeaven workspace conventions for Angular, NgXs, and Nx modulith.
  Apply this skill whenever generating, reviewing, creating specs before coding or planning code in the
  nx-signals-workshop repository.
---

# GreenHeaven Angular/NgXs Conventions

## Library boundary rules (Nx tags)

- `type:feature` may depend on `type:data-access`, `type:ui`, `type:util`
- `type:ui` may only depend on `type:ui` and `type:util`
- `type:data-access` may only depend on `type:util`
- Never import across scope boundaries (e.g. `scope:catalogue` must not
  import directly from `scope:home`)
- Verify with: `npx nx run-many -t lint` and `nx graph`

## NgXs state shape

Every state slice must follow this structure:

```
catalogue-data-access/
├── src/
│   ├── lib/
│   │   ├── actions/
│   │   │   └── feature-name.actions.ts      one file per state
│   │   ├── models/
│   │   │   └── feature-name.model.ts        plain interface, no class
│   │   ├── selectors/
│   │   │   └── feature-name.selectors.ts    one file per state
│   │   └── feature-name.state.ts            @State class only
│   └── index.ts                             all public exports here
```

- State model: plain interface, never a class
- Actions: in `actions/` subfolder, one file per state
- Selectors: in `selectors/` subfolder, one file per state (see **Selectors** section below)
- State class name: `FeatureNameState` (PascalCase, ends in `State`)

## Component conventions

- `type:ui` components: inputs only, no service injection, no store access
- `type:feature` components: inject the NgXs Store via `inject(Store)` — `private readonly store = inject(Store)`

## Naming conventions

- Library: `scope-type-name` (e.g. `catalogue-data-access`, `shared-ui-product-card`)
- Directory: `type-name` (e.g. `ui-header`, `ui-product-card`)
- Component selector: matches library leaf name (e.g. `ui-product-card`)
- State class: `FeatureState` (e.g. `ReviewsState`, `FavoritesState`)
- Action class: `VerbNoun` (e.g. `LoadReviews`, `AddReview`, `ToggleFavorite`)

## Additional conventions

- This repo uses NgXs (not NgRx)
- Feature libraries dispatch to state; UI libraries never touch the store

## Selectors

Selectors live in `selectors/feature-name.selectors.ts` — one file per state, never inside the `@State` class.

Never use the `@Selector` decorator. Use only `createPropertySelectors` and `createSelector` from `@ngxs/store`.

```ts
import { createPropertySelectors, createSelector } from '@ngxs/store';
import { ReviewsState } from '../reviews.state';
import { ReviewsStateModel } from '../models/reviews.model';

export namespace ReviewsSelectors {
  export const slices = createPropertySelectors<ReviewsStateModel>(ReviewsState);

  export const vm = createSelector([ReviewsSelectors.slices.items, ReviewsSelectors.slices.loading], (items, loading) => ({ items, loading }));
}
```

- `createPropertySelectors<StateModel>(StateClass)` returns a map of memoized selectors, one per model property
- `createSelector([...inputs], projector)` composes selectors without decorators
- Use `slices.<property>` directly in components via `store.selectSignal(ReviewsSelectors.slices.items)`
- Export the selectors class from the library's `index.ts`

## Testing

- The app is zoneless. Make sure the tests run in a zone-less environment.

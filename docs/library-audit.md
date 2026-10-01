# Library compliance audit — `libs/`

**Date:** 2026-10-01 · **Scope:** all 14 libraries under `libs/` · **Read-only** — no source file was changed.

**Rules audited against:**

- `CLAUDE.md` — architecture, library structure, state management, Angular conventions
- `.claude/skills/greenheaven-angular-ngxs/SKILL.md` — boundary rules, NgXs slice layout, naming, component rules
- `eslint.config.mjs` — `@nx/enforce-module-boundaries` `depConstraints` (the only machine-enforced rules)
- `tsconfig.base.json` — path-alias convention

Every finding below was produced by one auditor and then re-verified by an independent adversarial pass that reopened each cited file. Claims that did not survive verification are listed in [Refuted claims](#refuted-claims) so they are not re-reported later.

---

## Summary

| Library (nx project)                | Path                                       | Tags                                            | High | Med | Low |
| ----------------------------------- | ------------------------------------------ | ----------------------------------------------- | ---- | --- | --- |
| catalogue-data-access               | `libs/catalogue/data-access`               | `scope:catalogue`, `type:data-access`           | 1    | 3   | —   |
| catalogue-data-access-reviews       | `libs/catalogue/data-access-reviews`       | `scope:catalogue`, `type:data-access`           | —    | 2   | 1   |
| catalogue-types                     | `libs/catalogue/types`                     | `type:model`, `scope:catalogue`, `scope:shared` | —    | 3   | 2   |
| catalogue-feature-catalogue-list    | `libs/catalogue/feature-catalogue-list`    | `scope:catalogue`, `type:feature`               | —    | 3   | 3   |
| catalogue-feature-catalogue-details | `libs/catalogue/feature-catalogue-details` | `scope:catalogue`, `type:feature`               | —    | 3   | 3   |
| catalogue-feature-shell             | `libs/catalogue/feature-shell`             | `type:feature`, `scope:catalogue`               | —    | 1   | 1   |
| home-feature-home                   | `libs/home/feature-home`                   | `scope:home`, `type:feature`                    | —    | 1   | 4   |
| home-feature-shell                  | `libs/home/feature-shell`                  | `type:feature`, `scope:home`                    | —    | —   | 1   |
| shared-types                        | `libs/shared/types`                        | `scope:shared`, `type:model`                    | —    | —   | 3   |
| shared-ui-header                    | `libs/shared/ui/ui-header`                 | `scope:shared`, `type:ui`                       | —    | 1   | 3   |
| shared-ui-hero                      | `libs/shared/ui/ui-hero`                   | `scope:shared`, `type:ui`                       | —    | 1   | 3   |
| shared-ui-product-card              | `libs/shared/ui/ui-product-card`           | `scope:shared`, `type:ui`                       | —    | 3   | 1   |
| shared-ui-review-card               | `libs/shared/ui/ui-review-card`            | `scope:shared`, `type:ui`                       | —    | —   | 1   |
| shared-ui-star-rating               | `libs/shared/ui/ui-star-rating`            | `scope:shared`, `type:ui`                       | —    | —   | 2   |

**No library is fully compliant.** One finding is high severity (a committed API key). Nothing currently fails `nx lint` — every boundary violation found is either unenforced by the config or has been made invisible to it.

### Fix these first

1. **The Supabase key** in `catalogue-data-access` — the only finding with a security consequence.
2. **The dual `scope:` tag on `catalogue-types`** — one line that disables the `scope:shared → scope:shared` boundary workspace-wide and is the root cause of three other findings.
3. **The slash-form alias** `@workshop/catalogue/feature-catalogue-details` — one `tsconfig.base.json` entry and one import site.
4. **Reconcile the two rule sources** (next section). Until that is done, the NgXs findings cannot honestly be called violations, and ~11 selector findings have no correct answer.

---

## Workspace-level conflicts (not any one library's fault)

These are contradictions **between the rule documents**. They generate findings in many libraries, and no code change can satisfy both sides.

### C1 — Signals vs NgXs (affects every state file)

`CLAUDE.md` ("State management pattern"): _"State is managed with Angular Signals — no NgRx or other state library"_, and it documents `FavoritesState`, `CatalogueLocalState` and `ProductDetailState` by name as signal/`rxResource`/`linkedSignal` services.

`SKILL.md:58`: _"This repo uses NgXs (not NgRx)"_, with a mandatory slice layout.

The repo does both: `ReviewsState` is a real NgXs `@State`; the other three are hand-rolled signal services. Every R21/R14/R23 finding below is downstream of this. **Decide which document is authoritative before acting on them.**

### C2 — Component selector: skill vs ESLint (affects all 11 components)

`SKILL.md:52` wants the selector to equal the library leaf name (`ui-product-card`). Every per-lib `eslint.config.mjs` (e.g. `libs/shared/ui/ui-header/eslint.config.mjs:19-26`) enforces `@angular-eslint/component-selector` with `prefix: 'lib'`, and each `project.json:5` sets `"prefix": "lib"`. A selector cannot satisfy both. **Every component in the workspace satisfies ESLint and breaks the skill** — so this is a rule defect, not 11 coding mistakes. It is recorded per library below for completeness, always as _low_.

A secondary, genuine inconsistency exists _within_ the ESLint-satisfying convention: `lib-ui-header` / `lib-ui-hero` / `lib-ui-product-card` keep the `ui-` segment while `lib-review-card` / `lib-star-rating` drop it.

### C3 — `type:model` is undocumented in CLAUDE.md

`CLAUDE.md` says to tag libs `type:<feature|ui|data-access|util>`. Both type libraries use `type:model`, which the root ESLint config defines and constrains (`eslint.config.mjs:41-44`, the strictest entry in the file). Nothing is unenforced as a result — this is a one-line `CLAUDE.md` amendment, not a code change.

### C4 — `type:data-access` dependency breadth

`SKILL.md:15` allows `type:data-access → type:util` only; `eslint.config.mjs:33-40` also permits `type:model` and `type:data-access`. Both data-access libs import `type:model` libs (`products.api.ts:3,5`, and four files in `data-access-reviews`). A data-access lib with no access to shared models could not type its own responses, so the resolution is to widen `SKILL.md:15` — not to change the six imports. Same conflict shape for `type:ui → type:model` (`eslint.config.mjs` allows it, the skill does not).

### C5 — `scope:home` has no boundary constraint

`eslint.config.mjs` defines `depConstraints` for `scope:catalogue` and `scope:shared` but not `scope:home`, so both home libs are governed only by the `{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }` catch-all. No violating import exists today; the gap is that one could never be caught.

### C6 — The mandated NgXs layout has no reference implementation

`catalogue-data-access-reviews` is the only NgXs slice in the repo and it uses flat files under `src/lib/`. There is no correct example for the next slice to copy.

---

## catalogue-data-access — `libs/catalogue/data-access`

Depends on: `catalogue-types`, `shared-types`.

- **R33 · HIGH · Supabase API key and host hardcoded in library source.**
  `libs/catalogue/data-access/src/lib/products.api.ts:10` — `private readonly apiKey = 'sb_publishable_WRlSo4jZkMz1zR6aniTEkg_F3dsjnEj';` and `:11` `private readonly apiHost = 'https://rkvvclbngyupeexgnqou.supabase.co/rest/v1';`, used at `:21` and `:53`.
  Both are string literals in the lib and ship in the browser bundle. The in-file TODOs at `:20`/`:51` only propose moving the _headers_ to an interceptor — they do not address externalising the key and host into environment config or an injected token. This is the one finding in the audit that exposes a credential.

- **R21 · MED · `FavoritesState` is hand-rolled signal state, not an NgXs slice.**
  `src/lib/favorites.state.ts:3-6` `@Injectable({ providedIn: 'root' })` / `export class FavoritesState {`, `:8` `private favorites = signal<Set<string>>(new Set());`, `:11` `count = computed(...)`, `:19` `toggleFavorite(productId: string)`.
  No `@State`, no `@ngxs/store` import anywhere in the lib, no action class (the skill names `ToggleFavorite` as the expected one), no selectors. Consumers mutate it by calling methods directly (`catalogue.component.ts:13`, `apps/workshop/src/app/app.ts:3`) rather than dispatching. **Subject to [C1](#c1--signals-vs-ngxs-affects-every-state-file)** — this file satisfies `CLAUDE.md` and breaks `SKILL.md`.

- **R14 · MED · No NgXs slice layout.**
  `src/lib/` contains only `favorites.state.ts` and `products.api.ts` — no `actions/`, `models/` or `selectors/` directory anywhere in the lib. The favorites slice has no action file, no model interface (state is an inline `Set<string>` signal, so R15 has nothing to point at) and no selectors, so R20 has nothing to export. Same root cause as R21; fix together.

- **R30 · MED · Zero spec files.**
  No `*.spec.ts` in the lib, while a `test` target is wired (`project.json:9-16`). Untested: `toggleFavorite`'s add/remove branch and copy-on-write `Set` update (`favorites.state.ts:19-29`), `isFavorite` (`:14-16`), the `count` computed (`:11`); in `ProductsApi` the `Range` header arithmetic (`products.api.ts:22-24`), the `Content-Range` total parsing with its fallback to `0` (`:31-38`), and the _Product not found_ throw (`:58-61`). Because `nx.json:35-37` sets `passWithNoTests: true`, the target reports green on zero tests — the gap is silent in CI.

- _See also [C4](#c4--typedata-access-dependency-breadth):_ this lib's imports of `@workshop/catalogue-types` and `@workshop/shared-types` are permitted by the lint config and forbidden by the skill's text.

## catalogue-data-access-reviews — `libs/catalogue/data-access-reviews`

Depends on: `catalogue-types`. The workspace's only real NgXs slice.

- **R19 · MED · The forbidden `@Selector` decorator is used for all three selectors.**
  `src/lib/reviews.selectors.ts:1` `import { Selector } from '@ngxs/store';`, `:9` `export class ReviewsSelectors {`, with `@Selector([ReviewsState])` at `:10`, `:15`, `:20`.
  The skill forbids `@Selector` outright and permits only `createPropertySelectors` / `createSelector` — neither appears in the lib. The container is also a class of statics rather than the prescribed `export namespace ReviewsSelectors` holding `slices = createPropertySelectors<ReviewsStateModel>(ReviewsState)`. Migration is cheap: `slices.reviews` keeps the same `selectSignal` call shape, so the consumer at `product-reviews.component.ts:32-34` changes by name only, and `count` becomes a `createSelector` over `slices.reviews`.

- **R14 · MED · Flat slice layout, and the model lives inside the `@State` file.**
  `src/lib/` holds `current-user.ts`, `reviews.actions.ts`, `reviews.fixtures.ts`, `reviews.selectors.ts`, `reviews.state.spec.ts`, `reviews.state.ts` with no `actions/`, `models/` or `selectors/` directories. `reviews.state.ts:8` declares `export type ReviewSubmitStatus` and `:11-15` `export interface ReviewsStateModel` above the `@State` class at `:17-22`, breaking the _"`@State` class only"_ requirement. `reviews.fixtures.ts` and `current-user.ts` have no slot in the prescribed layout at all.

- **R18 · LOW · Selectors file is not under `selectors/`.**
  `src/lib/reviews.selectors.ts` should be `src/lib/selectors/reviews.selectors.ts`. The other half of R18 passes (selectors are outside the `@State` class), and R20 passes (`src/index.ts:3` exports them). Low because it is the same misplaced-file fact already counted under R14 and is fixed by the same `git mv`.

- _Passing, worth noting:_ this is the only lib with a state spec (`reviews.state.spec.ts`), and it runs zoneless.

## catalogue-types — `libs/catalogue/types`

Tags: `["type:model", "scope:catalogue", "scope:shared"]`. **The highest-leverage fix in the audit.**

- **R1 · MED · Two `scope:` tags on one library.**
  `project.json:6`. A lib in two domains has no single owner, so no scope boundary can be enforced on it. (Compare `libs/shared/types/project.json:7`, which carries one scope tag.) The `type:model` half of this finding is [C3](#c3--typemodel-is-undocumented-in-claudemd), not a coding mistake.

- **R9 · MED · The dual tag launders a `scope:shared → scope:catalogue` dependency.**
  Two `scope:shared` UI libs consume types that physically live under `libs/catalogue/`: `libs/shared/ui/ui-product-card/src/lib/product-card.component.ts:18` and `libs/shared/ui/ui-review-card/src/lib/review-card.component.ts:4` (plus its spec at `:2`). `@nx/enforce-module-boundaries` (`eslint.config.mjs:57-60`, `scope:shared → scope:shared` only) stays silent **only because the extra `scope:shared` tag was pinned onto a catalogue-owned lib**. The rule is not violated — it has been blinded. The lib's own `README.md:5-12` admits this, naming _"Solution A: Define the scope:shared in this library (not recommended)"_ against _"Solution B: Move this library in shared library (recommended)"_. Solution B removes this finding and both inherited ones in the UI libs.

- **R4 · MED · Empty `targets: {}` — no lint or test target.**
  `project.json:8`, with the hint comment at `:7`. The lib has no `jest.config.*`, no `tsconfig.spec.json` and no `src/test-setup.ts`. Consequence: `npx nx lint catalogue-types` and `npx nx test catalogue-types` from `CLAUDE.md`'s Commands section resolve to nothing, and `run-many -t lint` / `-t test` skip the project silently. No R30 finding is raised here — the lib holds only interfaces and a `Pick` alias, so there is nothing to unit-test — but it should still be linted.

- **R2 · LOW · Project name omits the type segment.** `project.json:2` `"name": "catalogue-types"` against tag `type:model`; `scope-type-name` would give `catalogue-model`. `shared-types` repeats this, so it reads as an undocumented workspace habit; renaming ripples into `tsconfig.base.json:22` and every import site.

- **R3 · LOW · Directory `types/` does not follow `type-name`.** Compare the type-named siblings `data-access/`, `feature-shell/`, `ui-header/`.

## catalogue-feature-catalogue-list — `libs/catalogue/feature-catalogue-list`

- **R21 · MED · `CatalogueLocalState` is hand-rolled signal state, not NgXs.**
  `src/lib/catalogue/catalogue.state.ts:13-14` `@Injectable()` / `export class CatalogueLocalState {`, `:31` `private productsResource = rxResource({`, `:38` `private combinedProducts = linkedSignal<`. No `@State`, no actions, no selectors. **Subject to [C1](#c1--signals-vs-ngxs-affects-every-state-file)** — `CLAUDE.md` documents this exact design by name.

- **R23 · MED · The feature component never injects the NgXs `Store`.**
  `src/lib/catalogue/catalogue.component.ts:33-34` injects `CatalogueLocalState` and `FavoritesState`; the lib contains no `@ngxs/store` import. The skill requires `private readonly store = inject(Store)` in a `type:feature` component. Downstream of [C1](#c1--signals-vs-ngxs-affects-every-state-file).

- **R30 · MED · The state class and the container component are untested.**
  The lib's only spec is `components/plant-filter/plant-filter.component.spec.ts`. Untested: `linkedSignal` page accumulation (`catalogue.state.ts:38-56`), the search filter (`:21-29`), `totalProducts` (`:17`), `productsWithFavourites` (`catalogue.component.ts:37-44`), `onToggleFavorite` (`:47-49`), `onSearchChange` (`:52-54`), `onLoadMore` (`:56-58`), and the `hasMorePages` expression (`catalogue.component.html:1-2`).

- **R13 · LOW · `CatalogueLocalState` is missing from the barrel.**
  `src/index.ts:1` is a single line exporting only the component, while `CLAUDE.md` documents the lib as _"CatalogueComponent + CatalogueLocalState"_. Nothing is broken today — the component provides the state itself (`catalogue.component.ts:30`) and no consumer imports it — so this is a documented-surface gap.

- **R29 · LOW · Inline CSS string instead of SCSS.**
  `components/plant-filter/plant-filter.component.ts:28-38` uses `styles: [ ... ]` with plain CSS. Every other styled component in the workspace uses `styleUrl: './*.component.scss'`.

- **R24 · LOW · Selector `lib-feature-catalogue`** (`catalogue.component.ts:17`) — [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components). It also drops `-list`, so it matches neither the project nor the directory name. The inner `lib-plant-filter` (`plant-filter.component.ts:13`) diverges the same way.

## catalogue-feature-catalogue-details — `libs/catalogue/feature-catalogue-details`

The only library that mixes both state styles — `product-reviews.component.ts:28` does `private readonly store = inject(Store);` while the sibling container uses a signal service.

- **R21 · MED · `ProductDetailState` is hand-rolled signal state, not NgXs.**
  `src/lib/product-details/product-detail.state.ts:6-12` — `@Injectable()`, `productId = signal<number | undefined>(undefined)`, `product = rxResource({`. Downstream of [C1](#c1--signals-vs-ngxs-affects-every-state-file).

- **R23 · MED · `ProductDetailsComponent` does not inject the `Store`.**
  `product-details.component.ts:35` `state = inject(ProductDetailState);` — no `inject(Store)` in the file. (The field is intentionally public; it is read from the template.)

- **R30 · MED · The detail container and its state are untested.**
  The two inner components have substantial specs; absent are `product-detail.state.spec.ts` and `product-details.component.spec.ts`. Untested: the missing-id guard (`product-detail.state.ts:15-17`) and the fetch (`:18`); `productId = computed(() => Number(this.id()))` (`product-details.component.ts:38`) and the effect pushing it into state (`:40-44`); `toggleFavorite` (`:50-52`).

- **R13 · LOW · `ProductDetailState` is missing from the barrel.**
  `src/index.ts:1` exports only the component; `CLAUDE.md` documents _"ProductDetailsComponent + ProductDetailState"_. Also `src/lib/components/index.ts:1-2` exports `ProductReviewsComponent` and `ReviewFormComponent` but is never re-exported from `src/index.ts`. Nothing is broken today — the only cross-lib consumer is the lazy import in `feature-shell`, which needs just the container.

- **R24 · LOW · Selectors `lib-product-details` (`:20`), `lib-product-reviews` (`product-reviews.component.ts:21`), `lib-review-form` (`review-form.component.ts:31`)** — [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components).

- **Correctness note (no rule covers it).** `product-details.component.ts:47` declares `private isFavorite = signal(false);` and toggles it at `:50-52`, but the template reads the API payload instead (`product-details.component.html:37` `product.isFavorite`, `:43` the icon expression), so neither the icon nor the `aria-label` at `:36-40` ever changes and the lib never touches `FavoritesState`. The price is hardcoded at `product-details.component.html:26` (`$123`). Worth a ticket even though it breaks no audited rule.

## catalogue-feature-shell — `libs/catalogue/feature-shell`

- **R12 · MED · Imports the slash-form alias.**
  `src/lib/lib.routes.ts:17` `import('@workshop/catalogue/feature-catalogue-details')`, defined at `tsconfig.base.json:23-25`. Of the 14 aliases in `tsconfig.base.json` this is the only slash form; the convention is `@workshop/<domain>-<type>`, all dashes. The sibling route at `:9` uses the correct `@workshop/catalogue-feature-catalogue-list`, so **the two routes in one file disagree**. Exactly one import site workspace-wide — a two-line fix.

- **R30 · LOW · Zero spec files.**
  Untested: path `''` lazy-loading `CatalogueComponent` (`lib.routes.ts:6-12`), path `':id'` (`:13-20`), and `providers: [provideStates([ReviewsState])]` (`:15`) — the single runtime wiring point for the NgXs reviews slice, asserted nowhere in the workspace. Low: a 21-line declarative route table.

## home-feature-home — `libs/home/feature-home`

- **R30 · MED · Zero spec files.**
  Test target and zoneless `test-setup.ts` are wired, but no spec exists. Untested: `onHeroCtaClick` / `onCategoryClick` / `onSubscribe` (`home-page.component.ts:46-61`), the `@for (category of categories; ...)` loop (`home-page.component.html:15-31`), and the `<lib-ui-hero>` input/output wiring (`:3-8`). With `passWithNoTests: true`, `nx test home-feature-home` reports green on zero executed tests.

- **R33 · LOW · Hardcoded external image host.**
  `home-page.component.ts:32`, `:37`, `:42` — three absolute `https://picsum.photos/...` URLs baked into component source, consumed at `home-page.component.html:17`. No credential is involved (no `apikey`, `supabase`, `Authorization` or `HttpClient` anywhere in the lib); placeholder imagery that belongs behind an `input()`.

- **R23 · LOW · The feature component never touches the store.**
  `home-page.component.ts` imports neither `Store` nor `inject`; view data is a plain mutable field (`:28-44`) and all three handlers are `console.log` / commented-out stubs (`:46-61`). Graded low deliberately: R23 governs the _form_ of the injection, and nothing in the rule set says a static landing page must own a state slice. **The weakest confirmed finding in this audit** — the reviewable defect is the stubbed behaviour, not a boundary break.

- **R13 · LOW · `CategoryCard` is in the public API but not exported.**
  `home-page.component.ts:8` `interface CategoryCard {` has no `export`, yet the barrel-exported `HomePage` exposes it in a public field (`:28`) and a public method parameter (`:52`). A consumer or spec cannot name the type of `homePage.categories` or construct an argument for `onCategoryClick`. Either export it through the barrel (a types lib, per `CLAUDE.md`) or make both members non-public.

- **R24 · LOW · Selector `lib-home-page`** (`:15`) — [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components); it encodes neither the leaf name nor the project name.

## home-feature-shell — `libs/home/feature-shell`

The cleanest library in the workspace: correct tags, name, directory, targets, barrel-only surface, dashed alias, zoneless setup.

- **R30 · LOW · Zero spec files.**
  Untested: that `homeRoutes` exposes path `''` and that the dynamic import resolves `HomePage` (`src/lib/lib.routes.ts:3-9`) — a rename of the barrel symbol would fail only at runtime. Low: one route array, and `passWithNoTests: true` makes the green test run vacuous.

## shared-types — `libs/shared/types`

- **R1 · LOW · `type:model` is outside `CLAUDE.md`'s documented set** (`project.json:7`) — [C3](#c3--typemodel-is-undocumented-in-claudemd). One scope tag only, so no boundary issue.
- **R2 · LOW · Project name `shared-types` omits its type segment** (`project.json:2`); `scope-type-name` would give `shared-model-types`. `tsconfig.base.json:38` and `CLAUDE.md` both document the current name, and consumers import through the alias (`products.api.ts:5`, `catalogue.state.ts:11`).
- **R3 · LOW · Directory `types/` does not follow `type-name`** — would be `model-types/`. `CLAUDE.md`'s documented tree also spells it `shared/types/`, so the convention and the committed docs disagree.
- **Content drift (no rule covers it).** `src/lib/search.types.ts` is named for search types but declares only `PageableResponse<T>`, while `CLAUDE.md` advertises this lib as holding _"PageableResponse, search types"_. Its jest target, `test-setup.ts` and `tsconfig.spec.json` exist for a lib with no executable code.

## shared-ui-header — `libs/shared/ui/ui-header`

- **R22 · MED · A `type:ui` component performs router navigation and owns the app's URL map.**
  `header.component.html:3`, `:13`, `:23`, `:32`, `:45` hardcode `routerLink="/"`, `/catalogue`, `/wishlist`, `/cart` plus `routerLinkActive` state, enabled by `RouterModule` at `header.component.ts:7`/`:16`. R22 requires `type:ui` components to be input-driven only. Nav targets should be inputs, or the component should emit navigation intents.

- **R22 · LOW · Mutable non-input state field.**
  `header.component.ts:27` `cartItemCount = 0;` beside `:28` `favoriteCount = input<number>(0);`. The cart badge (`header.component.html:49-50`) is permanently `0` and no consumer can feed it — the only consumer binds just the input (`apps/workshop/src/app/app.html:1`). Fixed by making it an `input<number>(0)`.

- **R30 · LOW · Zero spec files.** The badge wiring (`header.component.html:36-37`) and `routerLinkActive` are untested. Thin gap — two bindings and one dead field, no branching.

- **R24 · LOW · Selector `lib-ui-header`** (`:14`) — [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components).

## shared-ui-hero — `libs/shared/ui/ui-hero`

- **R25 · MED · Missing `ChangeDetectionStrategy.OnPush`.**
  `hero.component.ts:4-10` has no `changeDetection:` key and `:1` does not import `ChangeDetectionStrategy`. **The only component in the workspace missing it** — `header.component.ts:24`, `product-card.component.ts:39`, `review-card.component.ts:14` and `star-rating.component.ts:57` all set it. (Practical impact is limited because the app is zoneless, but `CLAUDE.md` states the rule for all components.)

- **R33 · LOW · Hardcoded external image host in library styles.**
  `hero.component.scss:7` `background-image: url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200');` — the asset cannot be themed or swapped per consumer, and the lib depends on a third-party host at runtime.

- **R30 · LOW · Zero spec files.** Untested: the title/subtitle/ctaText bindings (`hero.component.html:3-11`) and `ctaClick` emit (`hero.component.ts:16-20`), consumed at `home-page.component.html:7`.

- **R24 · LOW · Selector `lib-ui-hero`** (`:5`) — [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components).

- _Minor:_ `:6` is the only remaining explicit `standalone: true` in the workspace (redundant in Angular 21).

## shared-ui-product-card — `libs/shared/ui/ui-product-card`

- **R33 · MED · Cloudinary host and account id hardcoded in a provider.**
  `product-card.component.ts:29-36` provides `IMAGE_LOADER`, with `:33` returning `https://res.cloudinary.com/drrogxjes/image/fetch/w_${config.width},h_300,c_fill,f_auto,q_auto/${config.src}`. The host, the cloud name `drrogxjes` and a fixed transform are baked into a shared UI lib, so every consumer silently routes product images through one account. Belongs in an app-level `IMAGE_LOADER` provider or an injected token. Not high — a Cloudinary cloud name is public, not a secret.

- **R22 · MED · A `type:ui` component navigates via `routerLink`.**
  `product-card.component.html:1` `<mat-card [routerLink]="['/catalogue', product().id]">`, with `RouterLink` imported at `product-card.component.ts:17`/`:26`. The card knows the catalogue domain's URL structure — inconsistent with its own `toggleFavorite` output pattern (`:45`, `:52-55`). The consumer already wraps it (`catalogue.component.html:54`), so the feature lib could own navigation.

- **R9 (inherited) · MED · Imports catalogue-domain types from a `scope:shared` lib.**
  `product-card.component.ts:18` `import { ProductsResponse } from '@workshop/catalogue-types';`. Permitted by lint _only_ because `catalogue-types` carries a second `scope:shared` tag — see [`catalogue-types` R9](#catalogue-types--libscataloguetypes). Fix it there, not here.

- **R30 · MED · Zero spec files, despite being the one shared UI lib with real branching.**
  Untested: `isOnSale` boundaries (`product-card.component.ts:47-50` — undefined `salePrice`, equal, greater), the sale-badge / dual-price branch (`product-card.component.html:16-31`), and `onToggleFavorite`'s `event.stopPropagation()` (`:52-55`), which is load-bearing because the whole card is a `routerLink` — a leaked click navigates instead of toggling.

- **R24 · LOW · Selector `lib-ui-product-card`** (`:20`) — [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components); `SKILL.md:52` names this exact library as its example.

## shared-ui-review-card — `libs/shared/ui/ui-review-card`

Has a real spec (`review-card.component.spec.ts`), sets `OnPush`, barrel-only surface.

- **R24 · LOW · Selector `lib-review-card`** (`review-card.component.ts:10`) — beyond [C2](#c2--component-selector-skill-vs-eslint-affects-all-11-components), it also **drops the `ui-` segment**, so it is inconsistent with its own siblings `lib-ui-header` / `lib-ui-hero` / `lib-ui-product-card`. Consumed at `product-reviews.component.html:10`.

- **R9 (inherited) · see [`catalogue-types` R9](#catalogue-types--libscataloguetypes).** `review-card.component.ts:4` and its spec at `:2` import `@workshop/catalogue-types`.

- _Config drift (not a rule breach):_ this lib's `eslint.config.mjs:5-7` spreads `nx.configs['flat/angular']` **before** `baseConfig`, the reverse of every sibling, and it uses `jest.config.cts` with `module.exports` while eleven libs use `jest.config.ts` with `export default`. `tsconfig.spec.json`'s `include` array still names `jest.config.ts` (which does not exist here) — but that array is byte-identical in all five UI libs, so it is shared boilerplate, not per-lib drift.

## shared-ui-star-rating — `libs/shared/ui/ui-star-rating`

The best-tested library in the workspace (20 specs).

- **R24 · LOW · Selector `lib-star-rating`** (`star-rating.component.ts:17`) — like `review-card`, it carries the `lib-` prefix **and** drops `ui-`. Load-bearing in `review-form.component.html:9`, `review-card.component.html:16` and the spec host at `:48`.

- **R25 · LOW · The spec's host component omits `OnPush`.**
  `star-rating.component.spec.ts:45-51` declares a real `@Component` with no `changeDetection` key, so it runs on default CD while the component under test is `OnPush`. Test-only scaffolding, and the suite drives CD explicitly via `fixture.detectChanges()`.

- _Same `jest.config.cts` / stale `tsconfig.spec.json` include as `ui-review-card`._

---

## Rules that pass everywhere

Verified across all 14 libraries, not assumed:

- **R11 — no deep imports.** A grep for `@workshop/*/src/lib/...` and for relative cross-library paths (`from '../../..'`) across `libs/` and `apps/` returns nothing. Every cross-library import goes through a `tsconfig.base.json` alias and the target's `index.ts`.
- **R31 — zoneless tests.** All 13 libs with a test target have `src/test-setup.ts` calling `setupZonelessTestEnv` from `jest-preset-angular/setup-env/zoneless`; no spec imports `zone.js` or uses `provideZoneChangeDetection`.
- **R26/R27/R28 — standalone components, `inject()`, signal inputs.** No `NgModule`, no constructor injection, and no `@Input()`/`@Output()` decorator anywhere in `libs/`.
- **R5/R8/R10 — feature/model dependency direction.** No `ui → data-access`, no `ui → feature`, no reverse dependency, and `catalogue-types` / `shared-types` import nothing.
- **R32 — RxJS confined to the data-access boundary.** `products.api.ts` is the only `HttpClient`/operator use; `of(null)` in `product-detail.state.ts:16` is `rxResource`'s API-mandated empty case, which `CLAUDE.md` names as the boundary.
- **R12/R13 for 13 of 14 libs** — one malformed alias, three barrel gaps, all listed above.

## Refuted claims

Raised by an auditor and rejected on verification. Recorded so they are not re-litigated.

| Claim                                                                                         | Why it was rejected                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared-ui-product-card` / `shared-ui-review-card` violate R9                                 | R9 is a _tag_ rule, and `catalogue-types` carries `scope:shared`, so lint permits the import. The real defect is R1/R9 on `catalogue-types`; charging it to the consumers would misdirect the fix.                                                                                                                                                                                                          |
| `home-feature-home` violates R9                                                               | No cross-scope import exists. The real issue is the missing `scope:home` constraint — recorded as [C5](#c5--scopehome-has-no-boundary-constraint).                                                                                                                                                                                                                                                          |
| `shared-types` violates R14                                                                   | R14 governs NgXs slices; this lib has no state slice.                                                                                                                                                                                                                                                                                                                                                       |
| `ui-review-card` / `ui-star-rating` violate R4 (stale `tsconfig.spec.json` include)           | Both `lint` and `test` targets exist and resolve the jest config that is present; the suites run. The stale include is identical in all five UI libs — shared boilerplate, noted above.                                                                                                                                                                                                                     |
| `catalogue-feature-shell` violates R31 (spec tsconfig divergence)                             | Its `test-setup.ts` _is_ zoneless. And the `commonjs`/`node10` spec config is shared by four libs, one of which (`data-access-reviews`) runs a passing spec under it — not an outlier.                                                                                                                                                                                                                      |
| `catalogue-feature-catalogue-details` violates R25 (dead favourite state)                     | `OnPush` is set at `product-details.component.ts:31`. The underlying observation is real and is recorded as a correctness note instead.                                                                                                                                                                                                                                                                     |
| `catalogue-feature-catalogue-details` violates R32 (RxJS for local state)                     | `of(null)` is `rxResource`'s required return shape, which `CLAUDE.md` names as the data-access boundary. The hand-rolled state concern is already filed under R21.                                                                                                                                                                                                                                          |
| Leftover scaffolding in `catalogue-feature-catalogue-list` / `home-feature-home` violates R32 | Neither file imports RxJS. The artefacts are real — `catalogue.component.ts:36` TODO above implemented code, `plant-filter.component.ts:42` `// TODO: Add signal input` above an implemented `input<string>()`, a commented-out `<mat-form-field>` at `catalogue.component.html:29-39`, stub handlers at `home-page.component.ts:46-61` — but no audited rule covers leftover scaffolding or `console.log`. |

## Method

Four auditors each took a group of libraries, read every file in them (`project.json`, `tsconfig*`, `jest.config.*`, `eslint.config.mjs`, and all `.ts`/`.html`/`.scss`/`.spec.ts` under `src/`) plus the four rule sources, and graded 33 explicit rules per library. Each group's findings then went to an independent adversarial verifier that reopened every cited line, corrected or rejected the claim, re-graded severity, and swept the same files for violations the auditor had missed — three such misses are included above (`catalogue-types` R7 conflict, `home-feature-home` R13, `ui-star-rating` R25, plus the inner-selector cases). Two groups overlapped on several libraries, giving independent cross-checks on the dual-scope-tag and selector findings. Of 87 verdicts, 76 were confirmed and 11 refuted.

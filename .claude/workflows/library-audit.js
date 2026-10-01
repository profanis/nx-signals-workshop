export const meta = {
  name: 'library-audit',
  description:
    'Audit every lib/ library against workspace convention rules, then adversarially verify each finding',
  phases: [
    {
      title: 'Audit',
      detail:
        'one agent per library group, reads every file and checks all rules',
    },
    {
      title: 'Verify',
      detail:
        'per-group skeptic re-checks each claimed violation against the files',
    },
  ],
};

const RULES = `
# RULE SET (the only rules in force; cite by ID)

Sources: /CLAUDE.md (project instructions), /.claude/skills/greenheaven-angular-ngxs/SKILL.md (workspace conventions), /eslint.config.mjs (@nx/enforce-module-boundaries depConstraints), /tsconfig.base.json (path aliases).

## Tags & project config
R1  Every lib must be tagged with a scope:<domain> AND a type:<feature|ui|data-access|util> tag (CLAUDE.md). A type tag outside that set (e.g. type:model) or more than one scope: tag is a deviation from CLAUDE.md — report it.
R2  Library (nx project) name must follow scope-type-name (e.g. catalogue-data-access, shared-ui-product-card).
R3  Library DIRECTORY name must follow type-name (e.g. ui-header, data-access, feature-shell).
R4  A lib should have lint and test targets wired (compare against sibling libs; empty "targets": {} is a finding).

## Dependency / boundary rules
R5  type:feature may depend on type:ui, type:util, type:model, type:data-access, type:feature.
R6  type:ui may depend ONLY on type:ui, type:util, type:model. The skill states ui may depend only on ui and util. Any ui -> data-access or ui -> feature dependency is a violation.
R7  type:data-access may depend ONLY on type:util, type:model, type:data-access (skill: only util).
R8  type:model may depend only on type:model.
R9  No cross-scope imports: scope:catalogue may depend on scope:catalogue + scope:shared; scope:shared may depend ONLY on scope:shared; scope:home is constrained by the catch-all (sourceTag '*') only — note any scope:home -> scope:catalogue dependency as an architectural smell and as an unconfigured constraint.
R10 Dependency direction: feature -> ui/data-access only, never the reverse.

## Imports & public API
R11 Every lib exposes its public surface ONLY through src/index.ts; cross-library imports must never reach into internal paths (deep imports like '@workshop/x/src/lib/...' or relative '../../other-lib/...').
R12 Cross-library imports must use the tsconfig.base.json path alias of the form @workshop/<domain>-<type> (all dashes). An alias with a slash (e.g. @workshop/catalogue/feature-catalogue-details) breaks the convention — report both the alias definition and each import site.
R13 Everything a consumer needs (components, state, selectors, actions, models) must actually be exported from index.ts. Report symbols imported by other libs/app but not barrel-exported, and public things missing from the barrel.

## NgXs state conventions (greenheaven skill)
R14 State slice folder layout is mandatory: src/lib/actions/<feature>.actions.ts, src/lib/models/<feature>.model.ts, src/lib/selectors/<feature>.selectors.ts, src/lib/<feature>.state.ts (@State class only), src/index.ts. Flat files directly under src/lib/ violate this.
R15 State model must be a plain interface, never a class.
R16 State class name: PascalCase ending in State.
R17 Action class name: VerbNoun (LoadReviews, AddReview, ToggleFavorite).
R18 Selectors live in selectors/<feature>.selectors.ts, never inside the @State class.
R19 NEVER use the @Selector decorator. Only createPropertySelectors and createSelector from @ngxs/store.
R20 Selectors must be exported from index.ts.
R21 The repo uses NgXs, not NgRx and not hand-rolled signal state services. A state service built on plain signals / rxResource / linkedSignal inside a data-access or feature lib conflicts with the NgXs convention — report it (and note CLAUDE.md's contradicting "Signals only, no state library" instruction as a documentation conflict, exactly once, under the lib where you see it).

## Component conventions
R22 type:ui components: inputs only. No service injection, no store access, no HttpClient, no router navigation, no business logic.
R23 type:feature components inject the store as: private readonly store = inject(Store).
R24 Component selector must match the library leaf name (skill R: e.g. lib ui-product-card -> selector ui-product-card). NOTE the per-lib eslint config enforces an @angular-eslint/component-selector prefix of 'lib' instead — where a selector satisfies one rule and breaks the other, report it as a rule conflict with the actual selector value.
R25 All components must use ChangeDetectionStrategy.OnPush.
R26 Standalone components only; no NgModules.
R27 inject() instead of constructor injection.
R28 Signal-based input() (and output()/model()) instead of @Input()/@Output() decorators.
R29 SCSS for styles.

## Testing
R30 Jest unit tests must exist for the lib's meaningful logic (state classes, components with behaviour). A lib with zero spec files is a gap — say what is untested.
R31 Tests must run zoneless (the app uses provideZonelessChangeDetection; test setup / TestBed config must not rely on zone.js). Check src/test-setup.ts and each spec's TestBed providers.
R32 Prefer signals over RxJS for local component state; RxJS only at the data-access boundary (CLAUDE.md).

## Secrets / hygiene
R33 No hardcoded API keys, hosts, or credentials in library source (CLAUDE.md flags the Supabase key as a known TODO — still report it, with the exact file and line).
`;

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    libraries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          project: { type: 'string', description: 'nx project name' },
          path: { type: 'string', description: 'libs/... directory' },
          tags: { type: 'array', items: { type: 'string' } },
          dependsOn: {
            type: 'array',
            items: { type: 'string' },
            description: 'other workspace libs it imports',
          },
          compliant: {
            type: 'boolean',
            description: 'true only if zero violations',
          },
          violations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                rule: { type: 'string', description: 'rule ID, e.g. R14' },
                title: {
                  type: 'string',
                  description: 'short label, <=70 chars',
                },
                severity: { type: 'string', enum: ['high', 'medium', 'low'] },
                evidence: {
                  type: 'string',
                  description:
                    'exact file:line plus the offending code/config snippet',
                },
                detail: {
                  type: 'string',
                  description: 'what the rule requires vs what the code does',
                },
              },
              required: ['rule', 'title', 'severity', 'evidence', 'detail'],
            },
          },
        },
        required: [
          'project',
          'path',
          'tags',
          'dependsOn',
          'compliant',
          'violations',
        ],
      },
    },
    notes: {
      type: 'array',
      items: { type: 'string' },
      description: 'cross-cutting observations or rule conflicts',
    },
  },
  required: ['libraries'],
};

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          project: { type: 'string' },
          rule: { type: 'string' },
          title: { type: 'string' },
          confirmed: {
            type: 'boolean',
            description:
              'true only if you reopened the file and the violation is really there',
          },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          evidence: {
            type: 'string',
            description: 'corrected file:line + snippet',
          },
          detail: {
            type: 'string',
            description: 'corrected statement of required vs actual',
          },
          refutation: {
            type: 'string',
            description: 'if not confirmed, why the claim is wrong',
          },
        },
        required: [
          'project',
          'rule',
          'title',
          'confirmed',
          'severity',
          'evidence',
          'detail',
        ],
      },
    },
    missed: {
      type: 'array',
      description:
        'violations the auditor MISSED that you found while re-reading',
      items: {
        type: 'object',
        properties: {
          project: { type: 'string' },
          rule: { type: 'string' },
          title: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          evidence: { type: 'string' },
          detail: { type: 'string' },
        },
        required: [
          'project',
          'rule',
          'title',
          'severity',
          'evidence',
          'detail',
        ],
      },
    },
  },
  required: ['verdicts'],
};

const GROUPS = [
  {
    key: 'catalogue-data',
    libs: [
      'libs/catalogue/data-access (project catalogue-data-access)',
      'libs/catalogue/data-access-reviews (project catalogue-data-access-reviews)',
      'libs/catalogue/types (project catalogue-types)',
    ],
  },
  {
    key: 'catalogue-features',
    libs: [
      'libs/catalogue/feature-catalogue-list (project catalogue-feature-catalogue-list)',
      'libs/catalogue/feature-catalogue-details (project catalogue-feature-catalogue-details)',
      'libs/catalogue/feature-shell (project catalogue-feature-shell)',
    ],
  },
  {
    key: 'home-and-shared-types',
    libs: [
      'libs/home/feature-home (project home-feature-home)',
      'libs/home/feature-shell (project home-feature-shell)',
      'libs/shared/types (project shared-types)',
    ],
  },
  {
    key: 'shared-ui',
    libs: [
      'libs/shared/ui/ui-header (project shared-ui-header)',
      'libs/shared/ui/ui-hero (project shared-ui-hero)',
      'libs/shared/ui/ui-product-card (project shared-ui-product-card)',
      'libs/shared/ui/ui-review-card (project shared-ui-review-card)',
      'libs/shared/ui/ui-star-rating (project shared-ui-star-rating)',
    ],
  },
];

log(`Auditing 14 libraries in ${GROUPS.length} groups against 33 rules`);

const results = await pipeline(
  GROUPS,
  (g) =>
    agent(
      `You are auditing an Nx + Angular 21 workspace at /Users/profanis/projects/temp/angular.love/workshop.

READ-ONLY TASK. Do not modify, create, or delete any file. Do not run formatters, generators, or anything that writes.

Audit EXACTLY these libraries, and only these:
${g.libs.map((l) => '  - ' + l).join('\n')}

Method — be exhaustive, not sampled:
1. Read EVERY file in each of those library directories: project.json, tsconfig*.json, jest.config.*, eslint.config.mjs, src/index.ts, and every .ts / .html / .scss / .spec.ts under src/.
2. Read /tsconfig.base.json (path aliases), /eslint.config.mjs (depConstraints), /CLAUDE.md, and /.claude/skills/greenheaven-angular-ngxs/SKILL.md so you check the real rules, not remembered ones.
3. To find who imports what, grep across libs/ and apps/ (e.g. grep -rn "@workshop/" libs apps --include=*.ts --include=*.html). Needed for R11, R12, R13 and the dependency rules.
4. For each library, walk the ENTIRE rule set below rule-by-rule and decide pass/fail. Do not stop at the first few findings.

Every violation needs an exact file:line and the literal offending snippet — a reviewer must be able to jump straight there. If a rule genuinely passes, do not invent a finding. Set compliant=true only when a library breaks nothing.

${RULES}

Return the structured result for your ${g.libs.length} libraries only.`,
      { label: `audit:${g.key}`, phase: 'Audit', schema: FINDINGS_SCHEMA }
    ),
  (audit, g) =>
    agent(
      `You are an adversarial verifier in the same workspace: /Users/profanis/projects/temp/angular.love/workshop. READ-ONLY — change nothing.

Another agent audited these libraries:
${g.libs.map((l) => '  - ' + l).join('\n')}

Its claimed violations (JSON):
${JSON.stringify(audit && audit.libraries ? audit.libraries : [], null, 2)}

For EACH claimed violation:
- Reopen the cited file and the cited line. Confirm the snippet really exists there and really breaks the rule as written. Correct any wrong line number, wrong path, or garbled snippet.
- Default to confirmed=false when the evidence does not hold up, when the "rule" is the auditor's invention rather than one of the rules below, or when the cited code actually satisfies the rule. Write the refutation.
- Re-grade severity: high = breaks an enforced boundary/public-API rule or leaks a secret; medium = convention violation a reviewer would block on; low = cosmetic or doc-level.

Then do a completeness pass: re-read every file in those libraries and the rule set, and report in "missed" any real violation the auditor did not list (especially R13 barrel gaps, R14 NgXs layout, R19 @Selector usage, R22 ui-lib injection, R25 OnPush, R28 decorator inputs, R30/R31 test gaps, R33 hardcoded secrets). Same evidence standard: file:line + snippet.

${RULES}`,
      {
        label: `verify:${g.key}`,
        phase: 'Verify',
        schema: VERDICT_SCHEMA,
        effort: 'high',
      }
    ).then((v) => ({ group: g.key, libs: g.libs, audit, verdicts: v }))
);

const clean = results.filter(Boolean);
log(`Verified ${clean.length}/${GROUPS.length} groups`);
return { groups: clean };

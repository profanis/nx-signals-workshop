import { computed, inject, linkedSignal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FilterState } from '@workshop/catalogue-types';
import { deserializeQueryParamsToObject } from '@workshop/shared-util-router';

/**
 * Default filter state used when no filters are active
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  lightRequirements: [],
  plantProperty: null,
  plantType: null,
};

/**
 * Adapter that encapsulates URL-based filter state management.
 * Provides a centralized way to read and modify filter state from query params.
 *
 * The adapter maintains a local writable state that:
 * - Syncs FROM the URL when query params change (source of truth for reads)
 * - Gets updated IMMEDIATELY when patch is called (allows sequential updates)
 */
export interface FilterStateAdapter {
  /**
   * Signal containing the current filter state.
   * This is a linkedSignal that syncs from URL but can be locally updated.
   */
  filterState: Signal<FilterState>;

  /**
   * Get the currently selected light requirements
   */
  getLightRequirements: () => string[];

  /**
   * Get the currently selected plant property
   */
  getPlantProperty: () => string | null;

  /**
   * Get the currently selected plant type
   */
  getPlantType: () => string | null;

  /**
   * Create a new filter state by merging partial changes with current local state.
   * IMPORTANT: This also updates the local state immediately, allowing sequential
   * updates to see each other's changes without waiting for URL update.
   */
  patch: (partial: Partial<FilterState>) => FilterState;
}

/**
 * Creates a FilterStateAdapter that syncs with URL query parameters.
 *
 * The adapter uses a linkedSignal that:
 * - Initializes from URL query params
 * - Re-syncs when URL changes
 * - Can be locally updated via patch for immediate sequential access
 *
 * @param route - The ActivatedRoute to read query params from
 * @returns FilterStateAdapter instance
 *
 * @example
 * ```typescript
 * private readonly route = inject(ActivatedRoute);
 * private readonly filterAdapter = createFilterStateAdapter(this.route);
 *
 * // Use in controller config
 * selectedValues: computed(() =>
 *   this.filterAdapter.getLightRequirements().map(v => ({ value: v, label: v, count: 0 }))
 * ),
 * methods: {
 *   applyFilter: (values) => this.filtersChanged.emit(
 *     this.filterAdapter.patch({ lightRequirements: values.map(v => v.value) })
 *   ),
 * }
 * ```
 */
export function createFilterStateAdapter(
  route: ActivatedRoute,
): FilterStateAdapter {
  const queryParams = toSignal(route.queryParams, { initialValue: {} });

  // Derived signal from URL - this is the source of truth
  const urlFilterState = computed(() =>
    deserializeQueryParamsToObject(queryParams(), DEFAULT_FILTER_STATE),
  );

  // Local writable state that syncs from URL but can be updated locally
  // When URL changes, this re-syncs. When patch is called, this updates immediately.
  const localFilterState = linkedSignal(() => urlFilterState());

  return {
    filterState: localFilterState,

    getLightRequirements: () => localFilterState().lightRequirements,

    getPlantProperty: () => localFilterState().plantProperty,

    getPlantType: () => localFilterState().plantType,

    patch: (partial: Partial<FilterState>) => {
      const nextState: FilterState = {
        ...localFilterState(),
        ...partial,
      };
      // Update local state immediately so subsequent calls see this change
      localFilterState.set(nextState);
      return nextState;
    },
  };
}

/**
 * Injectable version of createFilterStateAdapter that uses Angular DI
 */
export function injectFilterStateAdapter(): FilterStateAdapter {
  const route = inject(ActivatedRoute);
  return createFilterStateAdapter(route);
}

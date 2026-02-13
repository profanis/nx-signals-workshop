import { computed, linkedSignal, untracked } from '@angular/core';

import {
  SelectAtomicFilterController,
  SelectAtomicFilterControllerProps,
  SelectFilterValue,
} from '@workshop/shared-types';
import {
  createHasFilters,
  createSingleValuePills,
  defaultPillLabelFormatter,
  singleValueEquals,
} from '@workshop/shared-util-filters';

export function injectSelectAtomicFilterController(
  props: SelectAtomicFilterControllerProps,
): SelectAtomicFilterController {
  const formatLabel = props.formatPillLabel ?? defaultPillLabelFormatter;

  const selectedFilter = linkedSignal<SelectFilterValue | null>(
    () => props.selectedValue?.() || null,
  );

  const selectedFilterEq = computed(() => selectedFilter(), {
    equal: singleValueEquals,
  });

  // Use utility function for pills
  const pills = createSingleValuePills(
    props.filterName,
    props.selectedValue,
    formatLabel,
  );

  const setFilter = (
    filter: SelectFilterValue | SelectFilterValue[] | null,
  ) => {
    if (Array.isArray(filter)) {
      selectedFilter.set(filter[0] || null);
    } else {
      selectedFilter.set(filter);
    }
    applyFilter();
  };

  const applyFilter = () => {
    untracked(() => props.methods.applyFilter(selectedFilter()));
  };

  const controller: SelectAtomicFilterController = {
    controllerName: props.filterName,
    data: {
      pills,
      options: props.options,
      selectedValue: selectedFilterEq,
      hasFilters: createHasFilters(pills),
    },
    methods: {
      setFilter,
      applyFilter,
      removeFilter: () => {
        selectedFilter.set(null);
        setFilter(null);
      },
    },
  };

  props.wrapperController.methods.register(controller);

  return controller;
}

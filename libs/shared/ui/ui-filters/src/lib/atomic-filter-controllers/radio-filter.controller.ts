import { computed, linkedSignal, untracked } from '@angular/core';

import {
  RadioAtomicFilterController,
  RadioAtomicFilterControllerProps,
  RadioFilterValue,
} from '@workshop/shared-types';
import {
  createHasFilters,
  createSingleValuePills,
  defaultPillLabelFormatter,
  singleValueEquals,
} from '@workshop/shared-util-filters';

export function injectRadioAtomicFilterController(
  props: RadioAtomicFilterControllerProps,
): RadioAtomicFilterController {
  const formatLabel = props.formatPillLabel ?? defaultPillLabelFormatter;

  const selectedFilter = linkedSignal<RadioFilterValue | null>(
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

  const setFilter = (filter: RadioFilterValue | RadioFilterValue[] | null) => {
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

  const controller: RadioAtomicFilterController = {
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
        setFilter(null);
      },
    },
  };

  props.wrapperController.methods.register(controller);

  return controller;
}

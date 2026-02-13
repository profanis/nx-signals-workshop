import { computed, linkedSignal, untracked } from '@angular/core';

import {
  CheckboxAtomicFilterController,
  CheckboxAtomicFilterControllerProps,
  CheckboxFilterValue,
} from '@workshop/shared-types';
import {
  createHasFilters,
  createMultiValuePills,
  defaultPillLabelFormatter,
  multiValueEquals,
} from '@workshop/shared-util-filters';
export function injectCheckboxAtomicFilterController(
  props: CheckboxAtomicFilterControllerProps,
): CheckboxAtomicFilterController {
  const formatLabel = props.formatPillLabel ?? defaultPillLabelFormatter;

  const selectedFilters = linkedSignal(() => props.selectedValues());

  const selectedFilterEq = computed(() => selectedFilters(), {
    equal: multiValueEquals,
  });

  // Use utility function for pills
  const pills = createMultiValuePills(
    props.filterName,
    props.selectedValues,
    formatLabel,
  );

  const setFilter = (
    filters: CheckboxFilterValue[] | CheckboxFilterValue | null,
  ) => {
    if (Array.isArray(filters)) {
      selectedFilters.set(filters);
    } else if (filters) {
      selectedFilters.set([filters]);
    } else {
      selectedFilters.set([]);
    }
    applyFilter();
  };

  const applyFilter = () => {
    untracked(() => props.methods.applyFilter(selectedFilters()));
  };

  const controller: CheckboxAtomicFilterController = {
    controllerName: props.filterName,
    data: {
      pills,
      options: props.options,
      selectedValues: selectedFilterEq,
      hasFilters: createHasFilters(pills),
    },
    methods: {
      setFilter,
      applyFilter,
      removeFilter: (value: CheckboxFilterValue | null) => {
        if (!value) {
          setFilter([]);
          return;
        }
        const newFilters = selectedFilters().filter(
          (filter) => filter.value !== value.value,
        );
        setFilter(newFilters);
      },
    },
  };

  props.wrapperController.methods.register(controller);

  return controller;
}

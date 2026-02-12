import { computed, linkedSignal, Signal, untracked } from '@angular/core';
import { WrapperAtomicFilterController } from './wrapper-filter.controller';
import {
  AtomicFilterController,
  AtomicFilterControllerBaseData,
  Pill,
} from '@workshop/shared-types';

export type RadioFilterValue = {
  value: string;
  label: string;
};

export interface RadioAtomicFilterControllerProps {
  filterName: string;
  options: RadioFilterValue[];
  selectedValue: Signal<RadioFilterValue | null>;
  wrapperController: WrapperAtomicFilterController;
  methods: {
    applyFilter: (selectedValues: RadioFilterValue | null) => void;
  };
}

export interface RadioAtomicFilterControllerData
  extends AtomicFilterControllerBaseData<RadioFilterValue> {
  pills: Signal<Pill[]>;
  options: RadioFilterValue[];
  selectedValue: Signal<RadioFilterValue | null>;
  hasFilters: Signal<boolean>;
}

export interface RadioAtomicFilterController
  extends AtomicFilterController<
    RadioFilterValue,
    RadioAtomicFilterControllerData
  > {
  controllerName: string;
  data: {
    pills: Signal<Pill[]>;
    options: RadioFilterValue[];
    selectedValue: Signal<RadioFilterValue | null>;
    hasFilters: Signal<boolean>;
  };
  methods: {
    setFilter: (value: RadioFilterValue | RadioFilterValue[] | null) => void;
    applyFilter: () => void;
    removeFilter: (value: RadioFilterValue | null) => void;
  };
}

export function injectRadioAtomicFilterController(
  props: RadioAtomicFilterControllerProps,
): RadioAtomicFilterController {
  // Construct Pills
  const pills: Signal<Pill[]> = computed(() => {
    return props.selectedValue()
      ? [
          {
            key: props.filterName,
            value: props.selectedValue()?.value || '',
            label: `${props.filterName}:${props.selectedValue()?.value || ''}`,
            controllerName: props.filterName,
          },
        ]
      : [];
  });

  const selectedFilter = linkedSignal<RadioFilterValue | null>(
    () => props.selectedValue?.() || null,
  );

  const selectedFilterEq = computed(() => selectedFilter(), {
    equal: (a, b) => a?.value === b?.value,
  });

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

  const controller = {
    controllerName: props.filterName,
    data: {
      pills: pills,
      options: props.options,
      selectedValue: selectedFilterEq,
      hasFilters: computed(() => pills().length > 0),
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

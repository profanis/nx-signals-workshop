import { computed, linkedSignal, Signal, untracked } from '@angular/core';
import { WrapperAtomicFilterController } from './wrapper-filter.controller';
import {
  AtomicFilterController,
  AtomicFilterControllerBaseData,
  Pill,
} from '@workshop/shared-types';

export type SelectFilterValue = {
  value: string;
  label: string;
  count: number;
};

export interface SelectAtomicFilterControllerProps {
  filterName: string;
  options: SelectFilterValue[];
  selectedValue: Signal<SelectFilterValue | null>;
  wrapperController: WrapperAtomicFilterController;
  methods: {
    applyFilter: (selectedValues: SelectFilterValue | null) => void;
  };
}

export interface SelectAtomicFilterControllerData
  extends AtomicFilterControllerBaseData<SelectFilterValue> {
  pills: Signal<Pill[]>;
  options: SelectFilterValue[];
  selectedValue: Signal<SelectFilterValue | null>;
  hasFilters: Signal<boolean>;
}

export interface SelectAtomicFilterController
  extends AtomicFilterController<
    SelectFilterValue,
    SelectAtomicFilterControllerData
  > {
  controllerName: string;
  data: {
    pills: Signal<Pill[]>;
    options: SelectFilterValue[];
    selectedValue: Signal<SelectFilterValue | null>;
    hasFilters: Signal<boolean>;
  };
  methods: {
    setFilter: (value: SelectFilterValue | SelectFilterValue[] | null) => void;
    applyFilter: () => void;
    removeFilter: (value: SelectFilterValue | null) => void;
  };
}

export function injectSelectAtomicFilterController(
  props: SelectAtomicFilterControllerProps,
): SelectAtomicFilterController {
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

  const selectedFilter = linkedSignal<SelectFilterValue | null>(
    () => props.selectedValue?.() || null,
  );

  const selectedFilterEq = computed(() => selectedFilter(), {
    equal: (a, b) => a?.value === b?.value,
  });

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

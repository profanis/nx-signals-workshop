import { computed, linkedSignal, Signal, untracked } from '@angular/core';
import { WrapperAtomicFilterController } from './wrapper-filter.controller';
import {
  AtomicFilterController,
  AtomicFilterControllerBaseData,
  Pill,
} from '@workshop/shared-types';

export type CheckboxFilterValue = {
  value: string;
  label: string;
  count: number;
};

export interface CheckboxAtomicFilterControllerData
  extends AtomicFilterControllerBaseData<CheckboxFilterValue> {
  pills: Signal<Pill[]>;
  options: CheckboxFilterValue[];
  selectedValues: Signal<CheckboxFilterValue[]>;
  hasFilters: Signal<boolean>;
}

export interface CheckboxAtomicFilterControllerProps {
  filterName: string;
  options: CheckboxFilterValue[];
  selectedValues: Signal<CheckboxFilterValue[]>;
  wrapperController: WrapperAtomicFilterController;
  methods: {
    applyFilter: (selectedValues: CheckboxFilterValue[]) => void;
    removeFilter?: (value: Pill) => void;
  };
}

export interface CheckboxAtomicFilterController
  extends AtomicFilterController<
    CheckboxFilterValue,
    CheckboxAtomicFilterControllerData
  > {
  controllerName: string;
  data: {
    pills: Signal<Pill[]>;
    options: CheckboxFilterValue[];
    selectedValues: Signal<CheckboxFilterValue[]>;
    hasFilters: Signal<boolean>;
  };
  methods: {
    setFilter: (
      value: CheckboxFilterValue[] | CheckboxFilterValue | null,
    ) => void;
    applyFilter: () => void;
    removeFilter: (value: CheckboxFilterValue | null) => void;
  };
}

export function injectCheckboxAtomicFilterController(
  props: CheckboxAtomicFilterControllerProps,
): CheckboxAtomicFilterController {
  // Construct Pills
  const pills: Signal<Pill[]> = computed(() => {
    return props.selectedValues().map(({ value }) => ({
      key: props.filterName,
      value,
      label: `${props.filterName}:${value}`,
      controllerName: props.filterName,
    }));
  });

  const selectedFilters = linkedSignal(() => props.selectedValues());
  const selectedFilterEq = computed(() => selectedFilters(), {
    // TODO: don't use JSON.stringify for equality check in production code, this is just for demo purposes
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

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
      pills: pills,
      options: props.options,
      selectedValues: selectedFilterEq,
      hasFilters: computed(() => pills().length > 0),
    },
    methods: {
      setFilter,
      applyFilter,
      removeFilter: (value: CheckboxFilterValue | null) => {
        if (!value) {
          return;
        }
        const newFilters = selectedFilters().filter(
          (filter) => filter.value !== value.value,
        );
        setFilter(newFilters);
        if (typeof props.methods.removeFilter === 'function') {
          props.methods.removeFilter({
            key: props.filterName,
            value: value.value,
            label: `${props.filterName}:${value.value}`,
            controllerName: props.filterName,
          });
        }
      },
    },
  };

  props.wrapperController.methods.register(controller);

  return controller;
}

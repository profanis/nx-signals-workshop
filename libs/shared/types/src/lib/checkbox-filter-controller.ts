import { Signal } from '@angular/core';
import {
  AtomicFilterController,
  AtomicFilterControllerBaseData,
} from './filter-controller';
import { Pill } from './pill';
import { WrapperAtomicFilterController } from './wrapper-filter-controller';
import { PillLabelFormatter } from '@workshop/shared-util-filters';

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
  formatPillLabel?: PillLabelFormatter;
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

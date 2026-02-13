import { Signal } from '@angular/core';
import {
  AtomicFilterControllerBaseData,
  AtomicFilterController,
} from './filter-controller';
import { Pill } from './pill';
import { WrapperAtomicFilterController } from './wrapper-filter-controller';
import { PillLabelFormatter } from '@workshop/shared-util-filters';

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
  formatPillLabel?: PillLabelFormatter;
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

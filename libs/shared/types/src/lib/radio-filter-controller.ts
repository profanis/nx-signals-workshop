import { Signal } from '@angular/core';
import {
  AtomicFilterController,
  AtomicFilterControllerBaseData,
} from './filter-controller';
import { Pill } from './pill';
import { WrapperAtomicFilterController } from './wrapper-filter-controller';
import { PillLabelFormatter } from '@workshop/shared-util-filters';
export type RadioFilterValue = {
  value: string;
  label: string;
};

export interface RadioAtomicFilterControllerProps {
  filterName: string;
  options: RadioFilterValue[];
  selectedValue: Signal<RadioFilterValue | null>;
  wrapperController: WrapperAtomicFilterController;
  formatPillLabel?: PillLabelFormatter;
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

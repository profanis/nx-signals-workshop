import { Signal } from '@angular/core';
import { Pill } from './pill';

export interface AtomicFilterControllerBaseData<T> {
  pills: Signal<Pill[]>;
  options: T[];
  hasFilters: Signal<boolean>;
}

export interface AtomicFilterController<
  T,
  ControllerData extends AtomicFilterControllerBaseData<T>,
> {
  controllerName: string;
  data: ControllerData;
  methods: {
    setFilter: (value: T[] | T | null) => void;
    applyFilter: () => void;
    removeFilter: (value: T | null) => void;
  };
}

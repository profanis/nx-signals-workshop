import { Signal, InjectionToken, inject } from '@angular/core';
import { Pill } from './pill';

export interface WrapperAtomicFilterController {
  data: {
    pills: Signal<Pill[]>;
    hasFilters: Signal<boolean>;
  };
  methods: {
    applyFilters: () => void;
    removeFilter: (event: Pill | 'all') => void;
    register: (controller: any) => void;
  };
}

export const WRAPPER_CONTROLLER =
  new InjectionToken<WrapperAtomicFilterController>(
    ngDevMode ? 'wrapper controller' : '',
  );

export function injectWrapperController() {
  return inject(WRAPPER_CONTROLLER);
}

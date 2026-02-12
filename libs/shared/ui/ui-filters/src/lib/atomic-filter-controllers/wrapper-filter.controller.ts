import { computed, inject, InjectionToken, Signal } from '@angular/core';
import {
  AtomicFilterController,
  AtomicFilterControllerBaseData,
  Pill,
} from '@workshop/shared-types';
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

export function createWrapperAtomicFilterController(): WrapperAtomicFilterController {
  const controllers: AtomicFilterController<
    unknown,
    AtomicFilterControllerBaseData<unknown>
  >[] = [];

  const pills = computed(() =>
    controllers.reduce<any[]>((acc, cur) => {
      const pills = cur.data.pills() || [];
      return [...acc, ...pills];
    }, []),
  );

  const hasFilters = computed(() => {
    return controllers.some((controller) => {
      return controller.data.hasFilters();
    });
  });

  return {
    data: {
      pills,
      hasFilters,
    },
    methods: {
      applyFilters: () => {
        controllers.forEach((controller) => {
          controller.methods.applyFilter();
        });
      },
      removeFilter(event: Pill | 'all') {
        if (event === 'all') {
          controllers.forEach((controller) => {
            controller.methods.removeFilter(null);
          });
          return;
        }
        controllers
          .find((it) => it.controllerName === event.controllerName)
          ?.methods.removeFilter(event);
      },
      register: (controller: any) => {
        controllers.push(controller);
      },
    },
  };
}

import { computed, Signal } from '@angular/core';
import { Pill } from '@workshop/shared-types';

/**
 * Default pill label formatter
 * Creates labels in the format "filterName:value"
 */
export function defaultPillLabelFormatter(
  filterName: string,
  value: string
): string {
  return `${filterName}:${value}`;
}

/**
 * Type for custom pill label formatter function
 */
export type PillLabelFormatter = (filterName: string, value: string) => string;

/**
 * Creates a Pill object with consistent structure
 */
export function createPill(
  filterName: string,
  value: string,
  formatLabel: PillLabelFormatter = defaultPillLabelFormatter
): Pill {
  return {
    key: filterName,
    value,
    label: formatLabel(filterName, value),
    controllerName: filterName,
  };
}

/**
 * Creates a computed signal for pills from a single value signal
 * Used by select and radio filter controllers
 */
export function createSingleValuePills<T extends { value: string } | null>(
  filterName: string,
  selectedValue: Signal<T>,
  formatLabel: PillLabelFormatter = defaultPillLabelFormatter
): Signal<Pill[]> {
  return computed(() => {
    const value = selectedValue();
    return value ? [createPill(filterName, value.value, formatLabel)] : [];
  });
}

/**
 * Creates a computed signal for pills from a multi-value signal
 * Used by checkbox filter controller
 */
export function createMultiValuePills<T extends { value: string }>(
  filterName: string,
  selectedValues: Signal<T[]>,
  formatLabel: PillLabelFormatter = defaultPillLabelFormatter
): Signal<Pill[]> {
  return computed(() => {
    return selectedValues().map(({ value }) =>
      createPill(filterName, value, formatLabel)
    );
  });
}

/**
 * Creates a computed signal that checks if any filters are active
 */
export function createHasFilters(pills: Signal<Pill[]>): Signal<boolean> {
  return computed(() => pills().length > 0);
}

/**
 * Simple equality check for single value filters
 */
export function singleValueEquals<T extends { value: string } | null>(
  a: T,
  b: T
): boolean {
  return a?.value === b?.value;
}

/**
 * Simple equality check for multi-value filters
 * Note: Uses JSON.stringify for demo purposes. Consider a more robust solution for production.
 */
export function multiValueEquals<T>(a: T[], b: T[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { output } from '@angular/core';
import { FilterState } from '@workshop/catalogue-types';
import {
  CheckboxFilterComponent,
  RadioFilterComponent,
  SelectFilterComponent,
} from '@workshop/shared-ui-filters';
import { injectFilterStateAdapter } from './filter-state-adapter';

export interface LightRequirement {
  value: string;
  label: string;
  count: number;
}

export interface PlantProperty {
  value: string;
  label: string;
  count: number;
}

export interface PlantType {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-product-filters',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    CheckboxFilterComponent,
    RadioFilterComponent,
    SelectFilterComponent,
  ],
  templateUrl: './catalogue-feature-catalogue-filters.html',
  styleUrl: './catalogue-feature-catalogue-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueFeatureCatalogueFilters {
  private readonly fb = new FormBuilder();
  private readonly filterAdapter = injectFilterStateAdapter();

  filtersChanged = output<FilterState>();

  // Light Requirements data
  readonly lightRequirements = signal<LightRequirement[]>([
    { value: 'semi-shade', label: 'Semi-Shade', count: 50 },
    { value: 'shade', label: 'Shade', count: 24 },
    { value: 'sun', label: 'Sun', count: 29 },
  ]);

  // Plant Properties data
  readonly plantProperties = signal<PlantProperty[]>([
    { value: 'acidic-soil', label: 'Acidic Soil Plants', count: 7 },
    { value: 'ground-cover', label: 'Ground Cover Plants', count: 8 },
    { value: 'hedge', label: 'Hedge Plants', count: 2 },
    { value: 'mediterranean', label: 'Mediterranean Plants', count: 34 },
    { value: 'rock-garden', label: 'Rock-Garden Plants', count: 3 },
  ]);

  // Plant Type data
  readonly plantTypes = signal<PlantType[]>([
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
  ]);

  // Reactive Form
  readonly filterForm: FormGroup = this.fb.group({
    lightRequirements: this.fb.control<boolean[]>([]),
    plantProperty: this.fb.control<string | null>(null),
    plantType: this.fb.control<string | null>(null),
  });

  // Writable signal to track form value - updated from both valueChanges and adapter population
  private readonly formValues = signal(this.filterForm.value);

  // Computed state for active filters using the form values
  readonly hasActiveFilters = computed(() => {
    const formValue = this.formValues();
    if (!formValue) {
      return false;
    }
    const hasLightReqs =
      formValue.lightRequirements?.some((val: boolean) => val) ?? false;
    const hasProperty = !!formValue.plantProperty;
    const hasType = !!formValue.plantType;
    return hasLightReqs || hasProperty || hasType;
  });

  constructor() {
    // Subscribe to form changes and emit filter state using the adapter
    this.filterForm.valueChanges.subscribe((value) => {
      this.formValues.set(value);
      this.emitFilterState();
    });

    // React to adapter's filter state changes and populate the form
    effect(() => {
      this.populateFormFromAdapter();
    });
  }

  private emitFilterState(): void {
    const formValue = this.filterForm.value;
    const selectedLightReqs = this.lightRequirements()
      .filter((_, index) => formValue.lightRequirements[index])
      .map((req) => req.value);

    // Use adapter's patch to create the new filter state
    const filterState = this.filterAdapter.patch({
      lightRequirements: selectedLightReqs,
      plantProperty: formValue.plantProperty,
      plantType: formValue.plantType,
    });

    this.filtersChanged.emit(filterState);
  }

  clearFilters(): void {
    this.filterForm.reset({
      lightRequirements: this.lightRequirements().map(() => false),
      plantProperty: null,
      plantType: null,
    });
  }

  /**
   * Reads the filter state from the adapter and populates the form.
   * The adapter handles URL query params deserialization internally.
   */
  private populateFormFromAdapter(): void {
    const filterState = this.filterAdapter.filterState();

    // Convert lightRequirements array of values to boolean array for the form
    const lightRequirementsBooleans = this.lightRequirements().map((req) =>
      filterState.lightRequirements.includes(req.value),
    );

    const formValue = {
      lightRequirements: lightRequirementsBooleans,
      plantProperty: filterState.plantProperty,
      plantType: filterState.plantType,
    };

    // Update the form without emitting valueChanges to avoid circular updates
    this.filterForm.setValue(formValue, { emitEvent: false });

    // Also update the formValues signal since emitEvent: false won't trigger valueChanges
    this.formValues.set(formValue);
  }
}

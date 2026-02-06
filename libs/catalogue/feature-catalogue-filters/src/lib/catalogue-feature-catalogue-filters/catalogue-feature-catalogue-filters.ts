import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FilterState } from '@workshop/catalogue-types';
import { deserializeQueryParamsToObject } from '@workshop/shared-util-router';
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
  ],
  templateUrl: './catalogue-feature-catalogue-filters.html',
  styleUrl: './catalogue-feature-catalogue-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueFeatureCatalogueFilters {
  private readonly fb = new FormBuilder();
  private readonly route = inject(ActivatedRoute);

  // Convert queryParams observable to signal for reactive updates
  private readonly queryParams = toSignal(this.route.queryParams, {
    initialValue: {},
  });

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
  readonly filterForm: FormGroup;

  // Computed state for active filters
  readonly hasActiveFilters = computed(() => {
    const formValue = this.currentFormValue();
    const hasLightReqs =
      formValue.lightRequirements?.some((val: boolean) => val) ?? false;
    const hasProperty = !!formValue.plantProperty;
    const hasType = !!formValue.plantType;
    return hasLightReqs || hasProperty || hasType;
  });

  // Signal to track form value changes
  private readonly currentFormValue = signal(this.getInitialFormValue());

  constructor() {
    this.filterForm = this.fb.group({
      lightRequirements: this.fb.array(
        this.lightRequirements().map(() => this.fb.control(false)),
      ),
      plantProperty: this.fb.control<string | null>(null),
      plantType: this.fb.control<string | null>(null),
    });

    // Subscribe to form changes and emit filter state
    this.filterForm.valueChanges.subscribe(() => {
      this.currentFormValue.set(this.filterForm.value);
      this.emitFilterState();
    });

    // React to query params changes and populate the form
    effect(() => {
      const queryParams = this.queryParams();
      this.populateFiltersFromQueryParams(queryParams);
    });
  }

  get lightRequirementsArray(): FormArray {
    return this.filterForm.get('lightRequirements') as FormArray;
  }

  private getInitialFormValue() {
    return {
      lightRequirements: this.lightRequirements().map(() => false),
      plantProperty: null,
      plantType: null,
    };
  }

  private emitFilterState(): void {
    const formValue = this.filterForm.value;
    const selectedLightReqs = this.lightRequirements()
      .filter((_, index) => formValue.lightRequirements[index])
      .map((req) => req.value);

    const filterState: FilterState = {
      lightRequirements: selectedLightReqs,
      plantProperty: formValue.plantProperty,
      plantType: formValue.plantType,
    };

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
   * Reads the query params from the URL and populates the form with the filter values.
   * This method deserializes query params that were serialized by the searchProducts method
   * in CatalogueComponent using serializeObjectToQueryParams.
   */
  private populateFiltersFromQueryParams(
    queryParams: Record<string, string | string[] | null | undefined>,
  ): void {
    const defaultFilterState: FilterState = {
      lightRequirements: [],
      plantProperty: null,
      plantType: null,
    };

    const filterState = deserializeQueryParamsToObject(
      queryParams,
      defaultFilterState,
    );

    // Convert lightRequirements array of values to boolean array for the form
    const lightRequirementsBooleans = this.lightRequirements().map((req) =>
      filterState.lightRequirements.includes(req.value),
    );

    // Update the form without emitting valueChanges to avoid circular updates
    this.filterForm.setValue(
      {
        lightRequirements: lightRequirementsBooleans,
        plantProperty: filterState.plantProperty,
        plantType: filterState.plantType,
      },
      { emitEvent: false },
    );

    // Update the current form value signal
    this.currentFormValue.set(this.filterForm.value);
  }
}

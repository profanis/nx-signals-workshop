import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
import {
  CheckboxAtomicFilterComponent,
  CheckboxFilterValue,
  injectCheckboxAtomicFilterController,
  injectRadioAtomicFilterController,
  injectSelectAtomicFilterController,
  RadioAtomicFilterComponent,
  RadioFilterValue,
  SelectAtomicFilterComponent,
  SelectFilterValue,
  WRAPPER_CONTROLLER,
} from '@workshop/shared-ui-filters';

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

    // New approach
    CheckboxAtomicFilterComponent,
    SelectAtomicFilterComponent,
    RadioAtomicFilterComponent,
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

  readonly wrapperController = inject(WRAPPER_CONTROLLER);

  checkboxFilterController = injectCheckboxAtomicFilterController({
    filterName: 'lightRequirements',
    wrapperController: this.wrapperController,
    options: this.lightRequirements(),
    selectedValues: computed(() => {
      const defaultFilterState: FilterState = {
        lightRequirements: [],
        plantProperty: null,
        plantType: null,
      };

      const filterState = deserializeQueryParamsToObject(
        this.queryParams(),
        defaultFilterState,
      );

      return filterState.lightRequirements.map((value) => {
        return {
          value,
          label: value,
          count: 0,
        } as CheckboxFilterValue;
      });
    }),
    methods: {
      applyFilter: (selectedValues: CheckboxFilterValue[]) => {
        const defaultFilterState: FilterState = {
          lightRequirements: [],
          plantProperty: null,
          plantType: null,
        };

        const filterState = deserializeQueryParamsToObject(
          this.queryParams(),
          defaultFilterState,
        );

        const newFilters = {
          ...filterState,
          lightRequirements: selectedValues.map((val) => val.value),
        };

        this.filtersChanged.emit(newFilters);
      },
    },
  });

  selectFilterController = injectSelectAtomicFilterController({
    filterName: 'plantProperty',
    wrapperController: this.wrapperController,
    options: this.plantProperties(),
    selectedValue: computed(() => {
      const defaultFilterState: FilterState = {
        lightRequirements: [],
        plantProperty: null,
        plantType: null,
      };

      const filterState = deserializeQueryParamsToObject(
        this.queryParams(),
        defaultFilterState,
      );

      return filterState.plantProperty
        ? ({
            value: filterState.plantProperty,
            label: filterState.plantProperty,
            count: 0,
          } as SelectFilterValue)
        : null;
    }),
    methods: {
      applyFilter: (selectedValue: SelectFilterValue | null) => {
        const defaultFilterState: FilterState = {
          lightRequirements: [],
          plantProperty: null,
          plantType: null,
        };

        const filterState = deserializeQueryParamsToObject(
          this.queryParams(),
          defaultFilterState,
        );

        const newFilters = {
          ...filterState,
          plantProperty: selectedValue ? selectedValue.value : null,
        };

        this.filtersChanged.emit(newFilters);
      },
    },
  });

  radioController = injectRadioAtomicFilterController({
    filterName: 'plantType',
    wrapperController: this.wrapperController,
    options: this.plantTypes(),
    selectedValue: computed(() => {
      const defaultFilterState: FilterState = {
        lightRequirements: [],
        plantProperty: null,
        plantType: null,
      };

      const filterState = deserializeQueryParamsToObject(
        this.queryParams(),
        defaultFilterState,
      );

      return filterState.plantType
        ? ({
            value: filterState.plantType,
            label: filterState.plantType,
          } as RadioFilterValue)
        : null;
    }),
    methods: {
      applyFilter: (selectedValue: RadioFilterValue | null) => {
        const defaultFilterState: FilterState = {
          lightRequirements: [],
          plantProperty: null,
          plantType: null,
        };

        const filterState = deserializeQueryParamsToObject(
          this.queryParams(),
          defaultFilterState,
        );

        const newFilters = {
          ...filterState,
          plantType: selectedValue ? selectedValue.value : null,
        };

        this.filtersChanged.emit(newFilters);
      },
    },
  });

  clearFilters(): void {
    this.wrapperController.methods.removeFilter('all');
  }
}

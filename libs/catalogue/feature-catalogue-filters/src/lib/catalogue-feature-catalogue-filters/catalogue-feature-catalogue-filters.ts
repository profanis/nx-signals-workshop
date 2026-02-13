import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { output } from '@angular/core';
import { FilterState } from '@workshop/catalogue-types';
import {
  CheckboxAtomicFilterComponent,
  injectCheckboxAtomicFilterController,
  injectRadioAtomicFilterController,
  injectSelectAtomicFilterController,
  RadioAtomicFilterComponent,
  SelectAtomicFilterComponent,
} from '@workshop/shared-ui-filters';
import { injectFilterStateAdapter } from './filter-state-adapter';
import {
  CheckboxFilterValue,
  RadioFilterValue,
  SelectFilterValue,
  WRAPPER_CONTROLLER,
} from '@workshop/shared-types';

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
  // Filter state adapter - centralized URL state management
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

  readonly wrapperController = inject(WRAPPER_CONTROLLER);

  checkboxFilterController = injectCheckboxAtomicFilterController({
    filterName: 'lightRequirements',
    wrapperController: this.wrapperController,
    options: this.lightRequirements(),
    selectedValues: computed(() =>
      this.filterAdapter.getLightRequirements().map(
        (value) =>
          ({
            value,
            label: value,
            count: 0,
          }) as CheckboxFilterValue,
      ),
    ),
    methods: {
      applyFilter: (selectedValues: CheckboxFilterValue[]) => {
        this.filtersChanged.emit(
          this.filterAdapter.patch({
            lightRequirements: selectedValues.map((val) => val.value),
          }),
        );
      },
    },
  });

  selectFilterController = injectSelectAtomicFilterController({
    filterName: 'plantProperty',
    wrapperController: this.wrapperController,
    options: this.plantProperties(),
    selectedValue: computed(() => {
      const plantProperty = this.filterAdapter.getPlantProperty();
      return plantProperty
        ? ({
            value: plantProperty,
            label: plantProperty,
            count: 0,
          } as SelectFilterValue)
        : null;
    }),
    methods: {
      applyFilter: (selectedValue: SelectFilterValue | null) => {
        this.filtersChanged.emit(
          this.filterAdapter.patch({
            plantProperty: selectedValue ? selectedValue.value : null,
          }),
        );
      },
    },
  });

  radioController = injectRadioAtomicFilterController({
    filterName: 'plantType',
    wrapperController: this.wrapperController,
    options: this.plantTypes(),
    selectedValue: computed(() => {
      const plantType = this.filterAdapter.getPlantType();
      return plantType
        ? ({
            value: plantType,
            label: plantType,
          } as RadioFilterValue)
        : null;
    }),
    methods: {
      applyFilter: (selectedValue: RadioFilterValue | null) => {
        this.filtersChanged.emit(
          this.filterAdapter.patch({
            plantType: selectedValue ? selectedValue.value : null,
          }),
        );
      },
    },
  });

  clearFilters(): void {
    this.wrapperController.methods.removeFilter('all');
  }
}

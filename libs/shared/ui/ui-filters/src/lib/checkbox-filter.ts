import {
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

export type CheckboxOption = {
  value: string;
  label: string;
  count: number;
};

@Component({
  selector: 'lib-checkbox-filter',
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxFilterComponent),
      multi: true,
    },
  ],
  styles: `
    .checkbox-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 1rem;
    }

    .filter-checkbox {
      flex: 1;
      font-size: 1rem;
    }

    .count {
      min-width: 2.5rem;
      padding: 0.25rem 0.5rem;
      background-color: #2d6a4f;
      color: white;
      border-radius: 4px;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      flex-shrink: 0;
    }
  `,
  template: ` <section class="filter-section">
    <h3 class="filter-title">{{ title() }}</h3>
    <div class="filter-content">
      @for (requirement of options(); track requirement.value; let i = $index) {
        <div class="checkbox-row">
          <mat-checkbox
            [checked]="selectedValuesSet().has(requirement.value)"
            (change)="checkboxChange($event, requirement)"
            class="filter-checkbox"
          >
            {{ requirement.label }}
          </mat-checkbox>
          <span class="count">{{ requirement.count }}</span>
        </div>
      }
    </div>
  </section>`,
})
export class CheckboxFilterComponent implements ControlValueAccessor {
  options = input<CheckboxOption[]>([]);
  title = input.required<string>();

  filterApply = output<CheckboxOption[]>();

  private _checkboxFilterFormValue = linkedSignal<CheckboxOption[]>(() => []);

  selectedValuesSet = computed(
    () => new Set(this._checkboxFilterFormValue().map((item) => item.value)),
  );

  // ControlValueAccessor callbacks
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: boolean[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  checkboxChange($event: MatCheckboxChange, requirement: CheckboxOption) {
    const currentValue = this._checkboxFilterFormValue();
    let newValue: CheckboxOption[];
    if ($event.checked) {
      newValue = [...currentValue, requirement];
    } else {
      newValue = currentValue.filter(
        (item) => item.value !== requirement.value,
      );
    }
    this._checkboxFilterFormValue.set(newValue);
    this.filterApply.emit(newValue);

    // Notify the parent form of the change (as boolean[])
    this.onChange(this.toBooleanArray(newValue));
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean[]): void {
    if (value) {
      // Convert boolean[] to CheckboxOption[]
      const opts = this.options() ?? [];
      const selectedOptions = opts.filter((_, index) => value[index]);
      this._checkboxFilterFormValue.set(selectedOptions);
    } else {
      this._checkboxFilterFormValue.set([]);
    }
  }

  registerOnChange(fn: (value: boolean[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Helper to convert CheckboxOption[] to boolean[]
  private toBooleanArray(selected: CheckboxOption[]): boolean[] {
    const opts = this.options() ?? [];
    const selectedValues = new Set(selected.map((item) => item.value));
    return opts.map((opt) => selectedValues.has(opt.value));
  }
}

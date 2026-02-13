import { Component, forwardRef, input, linkedSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

export type SelectOption = {
  value: string;
  label: string;
  count?: number;
};

@Component({
  selector: 'lib-select-filter',
  imports: [MatFormFieldModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFilterComponent),
      multi: true,
    },
  ],
  styles: `
    .full-width {
      width: 100%;
    }
  `,
  template: `
    <section class="filter-section">
      <h3 class="filter-title">{{ title() }}</h3>
      <div class="filter-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ placeholder() }}</mat-label>
          <mat-select [value]="selectedValue()" (selectionChange)="selectChange($event)">
            <mat-option [value]="null">None</mat-option>
            @for (option of options(); track option.value) {
              <mat-option [value]="option.value">
                {{ option.label }}@if (option.count !== undefined) { ({{ option.count }})}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
    </section>
  `,
})
export class SelectFilterComponent implements ControlValueAccessor {
  options = input<SelectOption[]>([]);
  title = input.required<string>();
  placeholder = input<string>('Select');

  selectedValue = linkedSignal<string | null>(() => null);

  // ControlValueAccessor callbacks
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  selectChange($event: MatSelectChange) {
    this.selectedValue.set($event.value);
    this.onChange($event.value);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

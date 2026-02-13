import {
  Component,
  forwardRef,
  input,
  linkedSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

export type RadioOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'lib-radio-filter',
  imports: [MatRadioModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioFilterComponent),
      multi: true,
    },
  ],
  styles: `
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .radio-button {
      font-size: 1rem;
    }
  `,
  template: `
    <section class="filter-section">
      <h3 class="filter-title">{{ title() }}</h3>
      <div class="filter-content">
        <mat-radio-group
          [value]="selectedValue()"
          (change)="radioChange($event)"
          class="radio-group"
        >
          @for (option of options(); track option.value) {
            <mat-radio-button [value]="option.value" class="radio-button">
              {{ option.label }}
            </mat-radio-button>
          }
        </mat-radio-group>
      </div>
    </section>
  `,
})
export class RadioFilterComponent implements ControlValueAccessor {
  options = input<RadioOption[]>([]);
  title = input.required<string>();

  selectedValue = linkedSignal<string | null>(() => null);

  // ControlValueAccessor callbacks
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  radioChange($event: MatRadioChange) {
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

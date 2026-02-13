import { Component, effect, input, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { form, FormField } from '@angular/forms/signals';
import {
  SelectAtomicFilterController,
  SelectFilterValue,
} from '@workshop/shared-types';

@Component({
  selector: 'lib-select-atomic-filter',
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    FormField,
  ],
  styles: `
    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    .filter-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `,
  template: `
    @let _controller = controller();

    <section class="filter-section">
      <h3 class="filter-title">{{ title() }}</h3>
      <div class="filter-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ placeholder() }}</mat-label>
          <mat-select [formField]="selectedItemForm">
            <mat-option [value]="null">None</mat-option>
            @for (property of _controller.data.options; track property.value) {
              <mat-option [value]="property">
                {{ property.label }} ({{ property.count }})
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
    </section>
  `,
})
export class SelectAtomicFilterComponent {
  controller = input.required<SelectAtomicFilterController>();
  title = input.required<string>();
  placeholder = input<string>('Select an option');

  selectedItemForm = form<SelectFilterValue | null>(signal(null));

  constructor() {
    effect(() => {
      const selectedValue = this.controller().data.selectedValue();
      // find selected item in the options list
      const selectedOption = this.controller().data.options.find(
        (option) => option.value === selectedValue?.value,
      );
      if (selectedOption) {
        this.selectedItemForm().value.set(selectedOption);
      } else {
        this.selectedItemForm().value.set(null);
      }
    });

    effect(() => {
      const selectedValue = this.selectedItemForm().value();
      untracked(() => this.controller().methods.setFilter(selectedValue));
    });
  }
}

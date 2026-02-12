import { Component, effect, input, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { form, FormField } from '@angular/forms/signals';
import {
  RadioAtomicFilterController,
  RadioFilterValue,
} from '../atomic-filter-controllers';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'lib-radio-atomic-filter',
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    FormField,
    JsonPipe,
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
      <h3 class="filter-title">Plant Type</h3>
      <div class="filter-content">
        <mat-radio-group [formField]="selectedItemForm">
          @for (type of _controller.data.options; track type.value) {
            <mat-radio-button [value]="type" class="plant-type-radio">
              {{ type.label }}
            </mat-radio-button>
          }
        </mat-radio-group>
      </div>
    </section>
  `,
})
export class RadioAtomicFilterComponent {
  controller = input.required<RadioAtomicFilterController>();

  selectedItemForm = form<RadioFilterValue | null>(signal(null));

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

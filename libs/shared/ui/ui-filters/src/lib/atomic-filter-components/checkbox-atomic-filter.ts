import { Component, computed, input, linkedSignal } from '@angular/core';
import {
  CheckboxAtomicFilterController,
  CheckboxFilterValue,
} from '../atomic-filter-controllers/chekbox-filter.controller';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'lib-checkbox-atomic-filter',
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
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
  template: ` @let _controller = controller();

    <section class="filter-section">
      <h3 class="filter-title">Light Requirements</h3>
      <div class="filter-content">
        @for (
          requirement of _controller.data.options;
          track requirement.value;
          let i = $index
        ) {
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
export class CheckboxAtomicFilterComponent {
  controller = input.required<CheckboxAtomicFilterController>();

  private _checkboxFilterFormValue = linkedSignal<CheckboxFilterValue[]>(() =>
    this.controller().data.selectedValues(),
  );

  selectedValuesSet = computed(
    () => new Set(this._checkboxFilterFormValue().map((item) => item.value)),
  );

  checkboxChange($event: MatCheckboxChange, requirement: CheckboxFilterValue) {
    const currentValue = this._checkboxFilterFormValue();
    let newValue: CheckboxFilterValue[];
    if ($event.checked) {
      newValue = [...currentValue, requirement];
    } else {
      newValue = currentValue.filter(
        (item) => item.value !== requirement.value,
      );
    }
    this._checkboxFilterFormValue.set(newValue);
    this.controller().methods.setFilter(newValue);
  }
}

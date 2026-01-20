import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-plant-filter',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-label>Search plants</mat-label>
      <input
        matInput
        type="text"
        [value]="searchTerm()"
        (input)="emitAnEvent($event.target.value)"
        placeholder="Search by plant name..."
        aria-label="Search for plants by name"
      />
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .search-field {
        width: 100%;
        min-width: 600px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFilterComponent {
  // TODO: Add signal input
  searchTerm = signal<string>('');
  // TODO: Add output for search term changes

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitAnEvent(value: string) {
    /* empty */
  }
}

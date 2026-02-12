import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { WRAPPER_CONTROLLER } from '@workshop/shared-ui-filters';

@Component({
  selector: 'lib-search-pills',
  imports: [MatChipsModule, MatIconModule],
  template: `
    @if (wrapperController.data.pills().length) {
      <mat-chip-set aria-label="Active filters" class="chip-set">
        @for (
          chip of wrapperController.data.pills();
          track chip.key + ':' + chip.value
        ) {
          <mat-chip>
            {{ chip.label }}
            <button
              matChipRemove
              type="button"
              aria-label="Remove {{ chip.label }}"
              (click)="wrapperController.methods.removeFilter(chip)"
            >
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip>
        }
      </mat-chip-set>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .chip-set {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPillsComponent {
  readonly wrapperController = inject(WRAPPER_CONTROLLER);
}

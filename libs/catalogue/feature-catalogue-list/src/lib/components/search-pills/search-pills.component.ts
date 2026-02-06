import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FilterState } from '@workshop/catalogue-types';
import {
  deserializeQueryParamsToObject,
  serializeObjectToQueryParams,
} from '@workshop/shared-util-router';

interface SearchChip {
  key: 'lightRequirements' | 'plantProperty' | 'plantType';
  value: string;
  label: string;
}

@Component({
  selector: 'lib-search-pills',
  imports: [MatChipsModule, MatIconModule],
  template: `
    @if (chips().length) {
      <mat-chip-set aria-label="Active filters" class="chip-set">
        @for (chip of chips(); track chip.key + ':' + chip.value) {
          <mat-chip>
            {{ chip.label }}
            <button
              matChipRemove
              type="button"
              aria-label="Remove {{ chip.label }}"
              (click)="removeChip(chip)"
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly defaultFilterState: FilterState = {
    lightRequirements: [],
    plantProperty: null,
    plantType: null,
  };

  private readonly queryParams = toSignal(this.route.queryParams, {
    initialValue: {},
  });

  private readonly filterState = computed(() =>
    deserializeQueryParamsToObject(this.queryParams(), this.defaultFilterState),
  );

  readonly chips = computed<SearchChip[]>(() => {
    const state = this.filterState();
    const result: SearchChip[] = [];

    for (const value of state.lightRequirements) {
      result.push({
        key: 'lightRequirements',
        value,
        label: `lightRequirement:${value}`,
      });
    }

    if (state.plantProperty) {
      result.push({
        key: 'plantProperty',
        value: state.plantProperty,
        label: `plantProperty:${state.plantProperty}`,
      });
    }

    if (state.plantType) {
      result.push({
        key: 'plantType',
        value: state.plantType,
        label: `plantType:${state.plantType}`,
      });
    }

    return result;
  });

  removeChip(chip: SearchChip): void {
    const state = this.filterState();
    const nextState: FilterState = {
      lightRequirements: [...state.lightRequirements],
      plantProperty: state.plantProperty,
      plantType: state.plantType,
    };

    switch (chip.key) {
      case 'lightRequirements':
        nextState.lightRequirements = nextState.lightRequirements.filter(
          (value) => value !== chip.value,
        );
        break;
      case 'plantProperty':
        nextState.plantProperty = null;
        break;
      case 'plantType':
        nextState.plantType = null;
        break;
      default:
        break;
    }

    const queryParams = serializeObjectToQueryParams(nextState);

    this.router.navigate([], {
      queryParams,
    });
  }
}

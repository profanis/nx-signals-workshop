import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  viewChildren,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';

const MAX_STARS = 5;

@Component({
  selector: 'lib-star-rating',
  imports: [MatIconModule],
  template: `
    @if (interactive()) {
      <span
        class="stars interactive"
        [class.invalid]="showInvalid()"
        role="radiogroup"
        aria-label="Rating"
        (focusout)="onFocusout($event)"
      >
        @for (radio of radios(); track radio.value) {
          <button
            #radio
            type="button"
            class="radio"
            role="radio"
            [attr.aria-checked]="radio.checked"
            [attr.aria-label]="radio.label"
            [tabIndex]="radio.tabIndex"
            (click)="select(radio.value)"
            (keydown)="onKeydown($event)"
          >
            <mat-icon
              class="star"
              [class.filled]="radio.filled"
              aria-hidden="true"
            >
              {{ radio.filled ? 'star' : 'star_border' }}
            </mat-icon>
          </button>
        }
      </span>
    } @else {
      <span class="stars" role="img" [attr.aria-label]="label()">
        @for (filled of stars(); track $index) {
          <mat-icon class="star" [class.filled]="filled" aria-hidden="true">
            {{ filled ? 'star' : 'star_border' }}
          </mat-icon>
        }
      </span>
    }
  `,
  styleUrl: './star-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent implements FormValueControl<number> {
  value = model(0);
  touched = model(false);
  invalid = input(false);
  interactive = input(false, { transform: booleanAttribute });

  private radioButtons = viewChildren<ElementRef<HTMLButtonElement>>('radio');

  stars = computed(() =>
    Array.from({ length: MAX_STARS }, (_, i) => i < this.value()),
  );
  showInvalid = computed(() => this.invalid() && this.touched());
  label = computed(() => `${this.value()} out of ${MAX_STARS} stars`);
  radios = computed(() => {
    const value = this.value();
    const focusable = value >= 1 ? value : 1;
    return this.stars().map((filled, i) => ({
      value: i + 1,
      filled,
      checked: i + 1 === value,
      tabIndex: i + 1 === focusable ? 0 : -1,
      label: `${i + 1} ${i === 0 ? 'star' : 'stars'}`,
    }));
  });

  select(value: number) {
    this.value.set(value);
  }

  onKeydown(event: KeyboardEvent) {
    const current = this.value();
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(MAX_STARS, current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(1, current - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(next);
    this.radioButtons()[next - 1]?.nativeElement.focus();
  }

  onFocusout(event: FocusEvent) {
    const group = event.currentTarget as HTMLElement | null;
    if (!group?.contains(event.relatedTarget as Node | null)) {
      this.touched.set(true);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Review } from '@workshop/catalogue-types';
import { StarRatingComponent } from '@workshop/shared-ui-star-rating';

const AVATAR_COLOURS = ['#5c6bc0', '#e67e22', '#16a085', '#8e24aa', '#43a047'];

@Component({
  selector: 'lib-review-card',
  imports: [DatePipe, MatCardModule, StarRatingComponent],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
  review = input.required<Review>();

  initials = computed(() =>
    this.review()
      .author.split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('')
  );

  // Derived from the author name so the same author always gets the same colour.
  avatarColour = computed(() => {
    const hash = [...this.review().author].reduce(
      (sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0,
      0
    );
    return AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
  });
}

import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Review } from '@workshop/catalogue-types';
import { ReviewCardComponent } from '@workshop/shared-ui-review-card';

const VERIFIED_PURCHASE_WEIGHT = 1.2;

@Component({
  selector: 'lib-review-list',
  imports: [DecimalPipe, ReviewCardComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  reviews = input.required<Review[]>();

  // Weighted mean rounded to one decimal; verified purchases weigh 1.2x.
  averageRating = computed(() => {
    const reviews = this.reviews();
    // if (reviews.length === 0) {
    //   return null;
    // }

    let weightedSum = 0;
    let totalWeight = 0;
    for (const review of reviews) {
      const weight = review.verifiedPurchase ? VERIFIED_PURCHASE_WEIGHT : 1;
      weightedSum += review.rating * weight;
      totalWeight += weight;
    }

    const ss = Math.round((weightedSum / totalWeight) * 10) / 10;
    console.log('Weighted average rating:', ss);
    return ss;
  });
}

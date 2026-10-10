import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import {
  AddReview,
  LoadReviews,
  ReviewsSelectors,
} from '@workshop/catalogue-data-access-reviews';
import { ReviewListComponent } from '@workshop/shared-ui-review-list';
import {
  ReviewFormComponent,
  ReviewFormValue,
} from '../review-form/review-form.component';

@Component({
  selector: 'lib-product-reviews',
  imports: [MatIconModule, ReviewListComponent, ReviewFormComponent],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent {
  private readonly store = inject(Store);

  productId = input.required<number>();

  reviews = this.store.selectSignal(ReviewsSelectors.reviews);
  count = this.store.selectSignal(ReviewsSelectors.count);
  submitStatus = this.store.selectSignal(ReviewsSelectors.submitStatus);

  private readonly successBanner =
    viewChild<ElementRef<HTMLElement>>('successBanner');

  constructor() {
    effect(() => {
      this.store.dispatch(new LoadReviews(this.productId()));
    });

    // The submitted form is removed from the DOM, so keep keyboard focus on the confirmation.
    effect(() => {
      this.successBanner()?.nativeElement.focus();
    });
  }

  onReviewSubmitted(review: ReviewFormValue) {
    this.store.dispatch(
      new AddReview({ ...review, productId: this.productId() }),
    );
  }
}

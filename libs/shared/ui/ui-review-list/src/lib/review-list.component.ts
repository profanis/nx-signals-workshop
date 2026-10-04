import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Review } from '@workshop/catalogue-types';
import { ReviewCardComponent } from '@workshop/shared-ui-review-card';

@Component({
  selector: 'lib-review-list',
  imports: [ReviewCardComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  reviews = input.required<Review[]>();
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
} from '@angular/core';
import {
  form,
  FormField,
  maxLength,
  min,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '@workshop/catalogue-types';
import { StarRatingComponent } from '@workshop/shared-ui-star-rating';

const MIN_TEXT_LENGTH = 20;
const MAX_TEXT_LENGTH = 500;

export interface ReviewFormValue {
  rating: Review['rating'];
  text: string;
}

@Component({
  selector: 'lib-review-form',
  imports: [
    FormField,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    StarRatingComponent,
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  readonly minTextLength = MIN_TEXT_LENGTH;
  readonly maxTextLength = MAX_TEXT_LENGTH;

  submitted = output<ReviewFormValue>();

  private readonly model = signal({ rating: 0, text: '' });

  reviewForm = form(this.model, (path) => {
    min(path.rating, 1, { message: 'Please select a star rating' });
    validate(path.text, ({ value }) =>
      value().trim().length < MIN_TEXT_LENGTH
        ? {
            kind: 'tooShort',
            message: `Review is too short (min ${MIN_TEXT_LENGTH} characters)`,
          }
        : undefined,
    );
    maxLength(path.text, MAX_TEXT_LENGTH);
  });

  ratingError = computed(() => {
    const rating = this.reviewForm.rating();
    return rating.touched() ? rating.errors()[0]?.message : undefined;
  });
  textError = computed(() => {
    const text = this.reviewForm.text();
    return text.touched() ? text.errors()[0]?.message : undefined;
  });
  textLength = computed(() => this.model().text.length);

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.reviewForm, async () => {
      const { rating, text } = this.model();
      this.submitted.emit({
        rating: rating as Review['rating'],
        text: text.trim(),
      });
      return undefined;
    });
  }
}

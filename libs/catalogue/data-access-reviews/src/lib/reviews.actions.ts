import { NewReview } from '@workshop/catalogue-types';

export class LoadReviews {
  static readonly type = '[Reviews] Load';
  constructor(public readonly productId: number) {}
}

export class AddReview {
  static readonly type = '[Reviews] Add';
  constructor(public readonly review: NewReview) {}
}

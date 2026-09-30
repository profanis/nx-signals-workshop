import { Selector } from '@ngxs/store';
import { Review } from '@workshop/catalogue-types';
import {
  ReviewsState,
  ReviewsStateModel,
  ReviewSubmitStatus,
} from './reviews.state';

export class ReviewsSelectors {
  @Selector([ReviewsState])
  static reviews(state: ReviewsStateModel): Review[] {
    return state.reviews;
  }

  @Selector([ReviewsState])
  static count(state: ReviewsStateModel): number {
    return state.reviews.length;
  }

  @Selector([ReviewsState])
  static submitStatus(state: ReviewsStateModel): ReviewSubmitStatus {
    return state.submitStatus;
  }
}

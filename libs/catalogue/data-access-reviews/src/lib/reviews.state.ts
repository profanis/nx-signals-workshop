import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Review } from '@workshop/catalogue-types';
import { CURRENT_USER } from './current-user';
import { AddReview, LoadReviews } from './reviews.actions';
import { seedReviews } from './reviews.fixtures';

export type ReviewSubmitStatus = 'idle' | 'success';

// Holds the reviews of the product that is currently open, newest first.
export interface ReviewsStateModel {
  productId: number | null;
  reviews: Review[];
  submitStatus: ReviewSubmitStatus;
}

@State<ReviewsStateModel>({
  name: 'reviews',
  defaults: { productId: null, reviews: [], submitStatus: 'idle' },
})
@Injectable()
export class ReviewsState {
  @Action(LoadReviews)
  loadReviews(ctx: StateContext<ReviewsStateModel>, { productId }: LoadReviews) {
    ctx.setState({
      productId,
      reviews: seedReviews(productId),
      submitStatus: 'idle',
    });
  }

  @Action(AddReview)
  addReview(ctx: StateContext<ReviewsStateModel>, { review }: AddReview) {
    const added: Review = {
      ...review,
      id: crypto.randomUUID(),
      author: CURRENT_USER.name,
      createdAt: new Date().toISOString(),
    };
    ctx.patchState({
      reviews: [added, ...ctx.getState().reviews],
      submitStatus: 'success',
    });
  }
}

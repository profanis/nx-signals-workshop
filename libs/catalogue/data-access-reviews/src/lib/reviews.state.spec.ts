import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { Review } from '@workshop/catalogue-types';
import { AddReview, LoadReviews } from './reviews.actions';
import { CURRENT_USER } from './current-user';
import { ReviewsSelectors } from './reviews.selectors';
import { ReviewsState } from './reviews.state';

describe('ReviewsState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([ReviewsState])],
    });
    store = TestBed.inject(Store);
  });

  describe('LoadReviews', () => {
    it('seeds 3 fixture reviews for the product', () => {
      store.dispatch(new LoadReviews(1));

      const reviews = store.selectSnapshot(ReviewsSelectors.reviews);
      expect(reviews).toHaveLength(3);
      expect(reviews.every((review) => review.productId === 1)).toBe(true);
    });

    it('orders seeded reviews newest first', () => {
      store.dispatch(new LoadReviews(1));

      const authors = store
        .selectSnapshot(ReviewsSelectors.reviews)
        .map((review) => review.author);
      expect(authors).toEqual(['Alex M.', 'Sofia K.', 'Jamie P.']);
    });

    it('sets the submit status to idle', () => {
      store.reset({
        ...store.snapshot(),
        reviews: { productId: 1, reviews: [], submitStatus: 'success' },
      });

      store.dispatch(new LoadReviews(1));

      expect(store.selectSnapshot(ReviewsSelectors.submitStatus)).toBe('idle');
    });

    it('replaces the reviews of the previously opened product', () => {
      const previous: Review = {
        id: 'r-1',
        productId: 1,
        author: 'You',
        rating: 4,
        text: 'A review of the product that was open before.',
        createdAt: '2026-09-01T10:00:00.000Z',
      };
      store.reset({
        ...store.snapshot(),
        reviews: { productId: 1, reviews: [previous], submitStatus: 'idle' },
      });

      store.dispatch(new LoadReviews(2));

      const reviews = store.selectSnapshot(ReviewsSelectors.reviews);
      expect(reviews).not.toContainEqual(previous);
      expect(reviews.every((review) => review.productId === 2)).toBe(true);
    });
  });

  describe('AddReview', () => {
    const newReview = {
      productId: 1,
      rating: 4 as const,
      text: 'Healthy plant, arrived well packed and on time.',
    };

    it('adds the review to the front of the list', () => {
      store.dispatch(new LoadReviews(1));

      store.dispatch(new AddReview(newReview));

      const reviews = store.selectSnapshot(ReviewsSelectors.reviews);
      expect(reviews).toHaveLength(4);
      expect(reviews[0]).toMatchObject(newReview);
    });

    it('attributes the review to the current user', () => {
      store.dispatch(new LoadReviews(1));

      store.dispatch(new AddReview(newReview));

      const [added] = store.selectSnapshot(ReviewsSelectors.reviews);
      expect(added.author).toBe(CURRENT_USER.name);
    });

    it('gives the review a unique id and the current date', () => {
      store.dispatch(new LoadReviews(1));
      const before = Date.now();

      store.dispatch(new AddReview(newReview));
      store.dispatch(new AddReview(newReview));

      const reviews = store.selectSnapshot(ReviewsSelectors.reviews);
      const ids = new Set(reviews.map((review) => review.id));
      expect(ids.size).toBe(reviews.length);
      const createdAt = Date.parse(reviews[0].createdAt);
      expect(createdAt).toBeGreaterThanOrEqual(before);
      expect(createdAt).toBeLessThanOrEqual(Date.now());
    });

    it('sets the submit status to success', () => {
      store.dispatch(new LoadReviews(1));

      store.dispatch(new AddReview(newReview));

      expect(store.selectSnapshot(ReviewsSelectors.submitStatus)).toBe('success');
    });
  });

  describe('selectors', () => {
    it('return no reviews, zero count and idle status before any product is loaded', () => {
      expect(store.selectSnapshot(ReviewsSelectors.reviews)).toEqual([]);
      expect(store.selectSnapshot(ReviewsSelectors.count)).toBe(0);
      expect(store.selectSnapshot(ReviewsSelectors.submitStatus)).toBe('idle');
    });

    it('count returns the number of reviews', () => {
      store.dispatch(new LoadReviews(1));

      expect(store.selectSnapshot(ReviewsSelectors.count)).toBe(3);
    });
  });
});

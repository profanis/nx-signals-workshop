import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Review } from '@workshop/catalogue-types';
import { ReviewListComponent } from './review-list.component';

describe('ReviewListComponent', () => {
  let fixture: ComponentFixture<ReviewListComponent>;

  const review: Review = {
    id: 'r-1',
    productId: 1,
    author: 'Alex M.',
    rating: 5,
    text: 'Arrived in perfect condition, leaves were lush and healthy.',
    createdAt: '2025-03-14T09:00:00.000Z',
  };

  function render(reviews: Review[]) {
    fixture = TestBed.createComponent(ReviewListComponent);
    fixture.componentRef.setInput('reviews', reviews);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function authors(element: HTMLElement) {
    return [...element.querySelectorAll('lib-review-card .review-author')].map(
      (author) => author.textContent?.trim(),
    );
  }

  it('renders a review card per review, in the given order', () => {
    const element = render([
      review,
      { ...review, id: 'r-2', author: 'Sofia K.' },
      { ...review, id: 'r-3', author: 'Jamie P.' },
    ]);

    expect(element.querySelectorAll('li')).toHaveLength(3);
    expect(authors(element)).toEqual(['Alex M.', 'Sofia K.', 'Jamie P.']);
  });

  it('renders an empty list when there are no reviews', () => {
    const element = render([]);

    expect(element.querySelector('ul')).not.toBeNull();
    expect(element.querySelectorAll('li')).toHaveLength(0);
  });

  describe('average rating', () => {
    function average(element: HTMLElement) {
      return element
        .querySelector('.reviews-average strong')
        ?.textContent?.trim();
    }

    function withRatings(...entries: [Review['rating'], boolean?][]): Review[] {
      return entries.map(([rating, verifiedPurchase], index) => ({
        ...review,
        id: `r-${index}`,
        rating,
        verifiedPurchase,
      }));
    }

    it('shows the plain mean when no review is a verified purchase', () => {
      const element = render(withRatings([5], [3], [4]));

      expect(average(element)).toBe('4.0');
    });

    it('weighs verified purchases 1.2x', () => {
      // (5 * 1.2 + 1 * 1) / 2.2 = 3.18…; the unweighted mean would be 3.0
      const element = render(withRatings([5, true], [1, false]));

      expect(average(element)).toBe('3.2');
    });

    it('matches the plain mean when every review is a verified purchase', () => {
      const element = render(withRatings([5, true], [4, true]));

      expect(average(element)).toBe('4.5');
    });

    it('rounds to one decimal place', () => {
      // 13 / 3 = 4.333…
      expect(average(render(withRatings([4], [4], [5])))).toBe('4.3');
      // (4 * 1.2 + 5) / 2.2 = 4.4545…
      expect(average(render(withRatings([4, true], [5])))).toBe('4.5');
    });

    it('is shown above the list', () => {
      const element = render(withRatings([5]));
      const children = [...element.children].map((child) => child.tagName);

      expect(children).toEqual(['P', 'UL']);
    });

    it('is not shown when there are no reviews', () => {
      const element = render([]);

      expect(element.querySelector('.reviews-average')).toBeNull();
    });
  });
});

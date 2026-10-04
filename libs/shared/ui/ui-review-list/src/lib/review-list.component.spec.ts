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
      (author) => author.textContent?.trim()
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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Review } from '@workshop/catalogue-types';
import { ReviewCardComponent } from './review-card.component';

describe('ReviewCardComponent', () => {
  let fixture: ComponentFixture<ReviewCardComponent>;

  const alex: Review = {
    id: 'r-1',
    productId: 1,
    author: 'Alex M.',
    rating: 5,
    text: 'Arrived in perfect condition, leaves were lush and healthy.',
    createdAt: '2025-03-14T09:00:00.000Z',
  };

  function render(review: Review) {
    fixture = TestBed.createComponent(ReviewCardComponent);
    fixture.componentRef.setInput('review', review);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function text(element: HTMLElement, selector: string) {
    return element.querySelector(selector)?.textContent?.trim();
  }

  it('shows the initials of the author in the avatar', () => {
    const element = render(alex);

    expect(text(element, '.review-avatar')).toBe('AM');
  });

  it('uses the first letter for a single-word author name', () => {
    const element = render({ ...alex, author: 'You' });

    expect(text(element, '.review-avatar')).toBe('Y');
  });

  it('shows the author name', () => {
    const element = render(alex);

    expect(text(element, '.review-author')).toBe('Alex M.');
  });

  it('formats the date as short month and year', () => {
    const element = render(alex);

    expect(text(element, '.review-date')).toBe('Mar 2025');
  });

  it('shows the review text', () => {
    const element = render(alex);

    expect(text(element, '.review-text')).toBe(alex.text);
  });

  it('shows the rating as stars', () => {
    const element = render({ ...alex, rating: 3 });

    expect(
      element.querySelector('lib-star-rating [role="img"]')?.getAttribute('aria-label')
    ).toBe('3 out of 5 stars');
  });

  it('gives the same author the same avatar colour', () => {
    const first = render(alex);
    const firstColour = (first.querySelector('.review-avatar') as HTMLElement).style.backgroundColor;

    const second = render({ ...alex, id: 'r-2', text: 'Another review by the same author.' });
    const secondColour = (second.querySelector('.review-avatar') as HTMLElement).style.backgroundColor;

    expect(firstColour).not.toBe('');
    expect(secondColour).toBe(firstColour);
  });
});

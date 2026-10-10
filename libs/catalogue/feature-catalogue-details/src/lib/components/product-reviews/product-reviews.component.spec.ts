import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngxs/store';
import { ReviewsState } from '@workshop/catalogue-data-access-reviews';
import { ProductReviewsComponent } from './product-reviews.component';

describe('ProductReviewsComponent', () => {
  let fixture: ComponentFixture<ProductReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([ReviewsState])],
    });
  });

  async function render(productId: number) {
    fixture = TestBed.createComponent(ProductReviewsComponent);
    fixture.componentRef.setInput('productId', productId);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  function authors(element: HTMLElement) {
    return [...element.querySelectorAll('lib-review-card .review-author')].map(
      (author) => author.textContent?.trim(),
    );
  }

  it('shows the review count in the heading', async () => {
    const element = await render(1);

    expect(element.querySelector('h2')?.textContent?.trim()).toBe(
      'Reviews (3)',
    );
  });

  it('shows the subtitle', async () => {
    const element = await render(1);

    expect(
      element.querySelector('.reviews-subtitle')?.textContent?.trim(),
    ).toBe('What our customers are saying');
  });

  it('renders the seeded reviews newest first', async () => {
    const element = await render(1);

    expect(authors(element)).toEqual(['Alex M.', 'Sofia K.', 'Jamie P.']);
  });

  it('loads the reviews of the new product when the product changes', async () => {
    await render(1);

    fixture.componentRef.setInput('productId', 2);
    await fixture.whenStable();

    const reviews = fixture.componentInstance.reviews();
    expect(reviews).toHaveLength(3);
    expect(reviews.every((review) => review.productId === 2)).toBe(true);
  });

  describe('writing a review', () => {
    async function submitReview(element: HTMLElement) {
      element.querySelectorAll<HTMLElement>('[role="radio"]')[3].click();
      const textarea = element.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'Healthy plant, arrived well packed and on time.';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      (
        element.querySelector('button[type="submit"]') as HTMLButtonElement
      ).click();
      await fixture.whenStable();
    }

    it('shows the form under "Share your experience" and no banner at first', async () => {
      const element = await render(1);

      expect(element.textContent).toContain('Share your experience');
      expect(element.querySelector('lib-review-form')).not.toBeNull();
      expect(element.querySelector('[role="status"]')).toBeNull();
    });

    it('replaces the form with the success banner after a valid submission', async () => {
      const element = await render(1);

      await submitReview(element);

      expect(element.querySelector('lib-review-form')).toBeNull();
      expect(
        element.querySelector('[role="status"]')?.textContent?.trim(),
      ).toContain('Thank you! Your review has been submitted.');
    });

    it('moves keyboard focus to the success banner', async () => {
      const element = await render(1);

      await submitReview(element);

      expect(document.activeElement).toBe(
        element.querySelector('[role="status"]'),
      );
    });

    it('puts the new review first and updates the count', async () => {
      const element = await render(1);

      await submitReview(element);

      expect(element.querySelector('h2')?.textContent?.trim()).toBe(
        'Reviews (4)',
      );
      expect(authors(element)[0]).toBe('You');
    });

    it('shows the form again with the seeded reviews after moving to another product', async () => {
      const element = await render(1);
      await submitReview(element);

      fixture.componentRef.setInput('productId', 2);
      await fixture.whenStable();

      expect(element.querySelector('lib-review-form')).not.toBeNull();
      expect(element.querySelector('[role="status"]')).toBeNull();
      expect(element.querySelector('h2')?.textContent?.trim()).toBe(
        'Reviews (3)',
      );
    });
  });
});

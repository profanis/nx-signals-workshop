import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, FormField, min } from '@angular/forms/signals';
import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent (read-only)', () => {
  let fixture: ComponentFixture<StarRatingComponent>;

  function render(value: number) {
    fixture = TestBed.createComponent(StarRatingComponent);
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders 3 filled and 2 empty stars for a rating of 3', () => {
    const element = render(3);

    const stars = Array.from(element.querySelectorAll('mat-icon'));
    expect(stars.map((star) => star.textContent?.trim())).toEqual([
      'star',
      'star',
      'star',
      'star_border',
      'star_border',
    ]);
    expect(element.querySelectorAll('mat-icon.filled')).toHaveLength(3);
  });

  it('has an accessible label with the rating', () => {
    const element = render(3);

    const group = element.querySelector('[role="img"]');
    expect(group?.getAttribute('aria-label')).toBe('3 out of 5 stars');
  });

  it('hides the individual star icons from assistive technology', () => {
    const element = render(5);

    const icons = Array.from(element.querySelectorAll('mat-icon'));
    expect(
      icons.every((icon) => icon.getAttribute('aria-hidden') === 'true'),
    ).toBe(true);
  });
});

@Component({
  imports: [FormField, StarRatingComponent],
  template: `
    <lib-star-rating interactive [formField]="reviewForm.rating" />
    <button id="outside">outside</button>
  `,
})
class HostComponent {
  model = signal({ rating: 0 });
  reviewForm = form(this.model, (path) => {
    min(path.rating, 1);
  });
}

describe('StarRatingComponent (interactive, signal forms)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  function radios() {
    return Array.from(element.querySelectorAll<HTMLElement>('[role="radio"]'));
  }

  function press(key: string) {
    const target =
      radios().find((radio) => radio.tabIndex === 0) ?? radios()[0];
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  }

  function setRating(rating: number) {
    host.model.set({ rating });
    fixture.detectChanges();
  }

  function blur() {
    radios()[0].dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: element.querySelector('#outside'),
      }),
    );
    fixture.detectChanges();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders a radiogroup with 5 labelled radios', () => {
    expect(element.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(radios().map((radio) => radio.getAttribute('aria-label'))).toEqual([
      '1 star',
      '2 stars',
      '3 stars',
      '4 stars',
      '5 stars',
    ]);
  });

  it('sets the field value to 4 when star 4 is clicked', () => {
    radios()[3].click();
    fixture.detectChanges();

    expect(host.reviewForm.rating().value()).toBe(4);
    expect(radios().map((radio) => radio.getAttribute('aria-checked'))).toEqual(
      ['false', 'false', 'false', 'true', 'false'],
    );
  });

  it('reflects a value set on the form model', () => {
    setRating(2);

    expect(radios()[1].getAttribute('aria-checked')).toBe('true');
    expect(element.querySelectorAll('mat-icon.filled')).toHaveLength(2);
  });

  it('only the checked star (or the first when empty) is in the tab order', () => {
    expect(radios().map((radio) => radio.tabIndex)).toEqual([
      0, -1, -1, -1, -1,
    ]);

    setRating(3);

    expect(radios().map((radio) => radio.tabIndex)).toEqual([
      -1, -1, 0, -1, -1,
    ]);
  });

  it('ArrowRight increases and ArrowLeft decreases the value within 1–5', () => {
    press('ArrowRight');
    expect(host.model().rating).toBe(1);

    setRating(5);
    press('ArrowRight');
    expect(host.model().rating).toBe(5);

    press('ArrowLeft');
    expect(host.model().rating).toBe(4);

    setRating(1);
    press('ArrowLeft');
    expect(host.model().rating).toBe(1);
  });

  it('marks the field touched when focus leaves the stars', () => {
    expect(host.reviewForm.rating().touched()).toBe(false);

    blur();

    expect(host.reviewForm.rating().touched()).toBe(true);
  });

  it('shows the invalid style only once an invalid field is touched', () => {
    expect(host.reviewForm.rating().invalid()).toBe(true);
    expect(element.querySelector('.stars.invalid')).toBeNull();

    blur();

    expect(element.querySelector('.stars.invalid')).not.toBeNull();
  });

  it('clears the invalid style once a star is chosen', () => {
    blur();
    radios()[2].click();
    fixture.detectChanges();

    expect(element.querySelector('.stars.invalid')).toBeNull();
  });
});

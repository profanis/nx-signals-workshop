import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewFormComponent, ReviewFormValue } from './review-form.component';

describe('ReviewFormComponent', () => {
  let fixture: ComponentFixture<ReviewFormComponent>;
  let element: HTMLElement;
  let emitted: ReviewFormValue[];

  function textarea() {
    return element.querySelector('textarea') as HTMLTextAreaElement;
  }

  function submitButton() {
    return element.querySelector('button[type="submit"]') as HTMLButtonElement;
  }

  function counter() {
    return element.querySelector('.counter') as HTMLElement;
  }

  function errors() {
    return Array.from(element.querySelectorAll('.field-error')).map((error) =>
      error.textContent?.replace('error_outline', '').trim(),
    );
  }

  function type(text: string) {
    textarea().value = text;
    textarea().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function blurTextarea() {
    textarea().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function clickStar(n: number) {
    element.querySelectorAll<HTMLElement>('[role="radio"]')[n - 1].click();
    fixture.detectChanges();
  }

  function blurStars() {
    element.querySelector('[role="radio"]')?.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: textarea(),
      }),
    );
    fixture.detectChanges();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFormComponent);
    element = fixture.nativeElement;
    emitted = [];
    fixture.componentInstance.submitted.subscribe((value) =>
      emitted.push(value),
    );
    fixture.detectChanges();
  });

  it('starts in the Default state: no errors, a 0 / 500 counter and Submit disabled', () => {
    expect(errors()).toEqual([]);
    expect(counter().textContent?.trim()).toBe('0 / 500');
    expect(counter().classList).not.toContain('invalid');
    expect(submitButton().disabled).toBe(true);
  });

  it('shows the rating error once the stars are touched without a choice', () => {
    blurStars();

    expect(errors()).toEqual(['Please select a star rating']);
  });

  it('shows the too-short error and a red counter after typing 2 characters and blurring', () => {
    type('Hi');
    blurTextarea();

    expect(errors()).toEqual(['Review is too short (min 20 characters)']);
    expect(counter().textContent?.trim()).toBe(
      '2 / 500 — minimum 20 characters',
    );
    expect(counter().classList).toContain('invalid');
  });

  it('updates the counter as the user types', () => {
    type('Lovely plant');

    expect(counter().textContent?.trim()).toBe('12 / 500');
  });

  it('treats 20 spaces as too short', () => {
    clickStar(4);
    type(' '.repeat(20));
    blurTextarea();

    expect(errors()).toEqual(['Review is too short (min 20 characters)']);
    expect(submitButton().disabled).toBe(true);
  });

  it('stops the review input at 500 characters', () => {
    expect(textarea().getAttribute('maxlength')).toBe('500');
  });

  it('enables Submit for a valid form and emits the trimmed payload once', async () => {
    clickStar(4);
    type('   A healthy plant that arrived well packed.   ');

    expect(submitButton().disabled).toBe(false);

    submitButton().click();
    await fixture.whenStable();

    expect(emitted).toEqual([
      { rating: 4, text: 'A healthy plant that arrived well packed.' },
    ]);
  });
});

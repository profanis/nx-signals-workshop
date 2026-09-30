import { TestBed } from '@angular/core/testing';
import { PlantFilterComponent } from './plant-filter.component';

describe('PlantFilterComponent', () => {
  it('emits the typed text through searchChange', async () => {
    const fixture = TestBed.createComponent(PlantFilterComponent);
    const emitted: string[] = [];
    fixture.componentInstance.searchChange.subscribe((term) => emitted.push(term));
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'monstera';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['monstera']);
  });
});

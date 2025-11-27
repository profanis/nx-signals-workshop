import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureCatalogue } from './feature-catalogue';

describe('FeatureCatalogue', () => {
  let component: FeatureCatalogue;
  let fixture: ComponentFixture<FeatureCatalogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCatalogue],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureCatalogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

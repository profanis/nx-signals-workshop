import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogueFeatureCatalogueFilters } from './catalogue-feature-catalogue-filters';

describe('CatalogueFeatureCatalogueFilters', () => {
  let component: CatalogueFeatureCatalogueFilters;
  let fixture: ComponentFixture<CatalogueFeatureCatalogueFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueFeatureCatalogueFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogueFeatureCatalogueFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

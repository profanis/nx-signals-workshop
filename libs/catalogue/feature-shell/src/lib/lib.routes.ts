import { Route } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { ReviewsState } from '@workshop/catalogue-data-access-reviews';

export const catalogueRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@workshop/catalogue-feature-catalogue-list').then(
        (m) => m.CatalogueComponent,
      ),
  },
  {
    path: ':id',
    providers: [provideStates([ReviewsState])],
    loadComponent: () =>
      import('@workshop/catalogue/feature-catalogue-details').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
];

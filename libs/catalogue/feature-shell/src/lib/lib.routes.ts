import { Route } from '@angular/router';

export const catalogueRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@workshop/catalogue-feature-catalogue-list').then(
        (m) => m.CatalogueComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@workshop/catalogue/feature-catalogue-details').then(
        (m) => m.ProductDetailsComponent
      ),
  },
];

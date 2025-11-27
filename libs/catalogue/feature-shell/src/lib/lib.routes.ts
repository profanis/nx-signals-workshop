import { Route } from '@angular/router';

export const catalogueRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@workspace/catalogue/feature-catalogue-list').then(
        (m) => m.CatalogueComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@workspace/catalogue/feature-catalogue-details').then(
        (m) => m.ProductDetailsComponent
      ),
  },
];

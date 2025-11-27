import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('@workspace/feature-home').then((m) => m.HomePage),
  },
  {
    path: 'catalogue',
    loadComponent: () =>
      import('@workspace/feature-catalogue').then((m) => m.CatalogueComponent),
  },
  {
    path: 'catalogue/:id',
    loadComponent: () =>
      import('@workspace/feature-catalogue').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

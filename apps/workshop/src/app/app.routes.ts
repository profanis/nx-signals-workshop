import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    loadComponent: () =>
      import('@workshop/home-feature-home').then((m) => m.HomePage),
    pathMatch: 'full',
  },
  {
    path: 'catalogue',
    loadComponent: () =>
      import('@workshop/catalogue-feature-catalogue-list').then(
        (m) => m.CatalogueComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

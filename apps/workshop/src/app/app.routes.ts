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
      import('@workshop/home-feature-home').then((m) => m.HomePage),
  },
  {
    path: 'catalogue',
    loadChildren: () =>
      import('@workshop/catalogue-feature-shell').then(
        (m) => m.catalogueRoutes
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

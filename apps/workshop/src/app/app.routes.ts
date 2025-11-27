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
    loadChildren: () =>
      import('@workspace/catalogue/feature-shell').then(
        (m) => m.catalogueRoutes
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

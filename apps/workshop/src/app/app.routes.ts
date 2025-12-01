import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('@workshop/home-feature-shell').then((m) => m.homeRoutes),
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

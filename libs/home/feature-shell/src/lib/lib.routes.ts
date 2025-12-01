import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@workshop/home-feature-home').then((m) => m.HomePage),
  },
];

import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./components/user-page/user-page.component').then((m) => m.UserPageComponent)
  }
];

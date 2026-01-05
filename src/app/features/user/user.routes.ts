import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: ':username',
    loadComponent: () => import('./components/user-page/user-page.component').then((m) => m.UserPageComponent)
  },
  // potegni.me/u/ - 404
  {
    path: '**',
    loadComponent: () => import('@shared/components/error/error.component').then((m) => m.ErrorComponent),
    canActivate: [AuthGuard]
  }
];

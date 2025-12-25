import { Routes } from '@angular/router';

export const ABOUT_ROUTES: Routes = [
  {
    path: 'o-nas',
    loadComponent: () => import('./components/about-page/about-page.component').then((m) => m.AboutPageComponent),
    pathMatch: 'full'
  },
  {
    path: 'donacije',
    loadComponent: () => import('./components/donate-page/donate-page.component').then((m) => m.DonatePageComponent),
    pathMatch: 'full'
  },
  { path: 'donate', redirectTo: 'donacije', pathMatch: 'full' },
  { path: 'doniraj', redirectTo: 'donacije', pathMatch: 'full' },
  {
    path: 'pogoji',
    loadComponent: () => import('./components/terms-page/terms-page.component').then((m) => m.TermsPageComponent),
    pathMatch: 'full'
  },
  { path: 'terms', redirectTo: 'pogoji', pathMatch: 'full' }
];

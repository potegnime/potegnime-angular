import { Routes } from '@angular/router';

export const ABOUT_ROUTES: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./components/about-page/about-page.component').then((m) => m.AboutPageComponent),
    pathMatch: 'full'
  },
  {
    path: 'donate',
    loadComponent: () => import('./components/donate-page/donate-page.component').then((m) => m.DonatePageComponent),
    pathMatch: 'full'
  },
  {
    path: 'terms',
    loadComponent: () => import('./components/terms-page/terms-page.component').then((m) => m.TermsPageComponent),
    pathMatch: 'full'
  }
];

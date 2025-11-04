import { Routes } from '@angular/router';


export const HOME_ROUTES: Routes = [
    { path: '', loadComponent: () => import('./components/home-page/home-page.component').then(m => m.HomePageComponent) }
];
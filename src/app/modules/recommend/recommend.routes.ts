import { Routes } from "@angular/router";


export const RECOMMEND_ROUTES: Routes = [
    { path: '', loadComponent: () => import('./components/recommend-page/recommend-page.component').then(m => m.RecommendPageComponent) }
];
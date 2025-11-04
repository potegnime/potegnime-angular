import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { LoggedInAuthGuard } from '@core/guards/logged-in-guard.guard';

export const routes: Routes = [
    // Home module - needs to be defined before Auth module
    { path: '', loadChildren: () => import('@features/home/home.routes').then(m => m.HOME_ROUTES), canActivate: [AuthGuard] },

    // Auth module
    {
        path: '',
        loadComponent: () => import('@features/auth/components/auth-page/auth-page.component').then(m => m.AuthPageComponent),
        children: [
            { path: 'prijava', loadComponent: () => import('@features/auth/components/login-form/login-form.component').then(m => m.LoginFormComponent), canActivate: [LoggedInAuthGuard] },
            { path: 'login', redirectTo: 'prijava', pathMatch: 'full' },
            { path: 'registracija', loadComponent: () => import('@features/auth/components/register-form/register-form.component').then(m => m.RegisterFormComponent), canActivate: [LoggedInAuthGuard] },
            { path: 'register', redirectTo: 'registracija', pathMatch: 'full' },
            { path: 'pozabljeno-geslo', loadComponent: () => import('@features/auth/components/forgot-password-form/forgot-password-form.component').then(m => m.ForgotPasswordFormComponent), canActivate: [LoggedInAuthGuard] },
            { path: 'ponastavi-geslo', loadComponent: () => import('@features/auth/components/reset-password-form/reset-password-form.component').then(m => m.ResetPasswordFormComponent), canActivate: [LoggedInAuthGuard] },
        ],
    },

    // Search module
    { path: 'iskanje', loadChildren: () => import('@features/search/search.routes').then(m => m.SEARCH_ROUTES), canActivate: [AuthGuard] },

    // User module
    { path: 'u', loadChildren: () => import('@features/user/user.routes').then(m => m.USER_ROUTES), canActivate: [AuthGuard] },

    // Recommend module
    { path: 'razisci', loadChildren: () => import('@features/recommend/recommend.routes').then(m => m.RECOMMEND_ROUTES), canActivate: [AuthGuard] },

    // Sudo module - guards defined in the module
    { path: '', loadChildren: () => import('@features/sudo/sudo.routes').then(m => m.SUDO_ROUTES) },

    // About module
    { path: '', loadChildren: () => import('@features/about/about.routes').then(m => m.ABOUT_ROUTES) },

    // 404 error page
    { path: '**', loadComponent: () => import('@shared/components/error/error.component').then(m => m.ErrorComponent), canActivate: [AuthGuard] }
];


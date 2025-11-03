import { Routes } from '@angular/router';
import { AuthGuard } from './app/modules/auth/guards/auth/auth.guard';
import { LoggedInAuthGuard } from './app/modules/auth/guards/logged-in/logged-in-guard.guard';
import { ErrorComponent } from './app/modules/shared/components/error/error.component';
import { AuthPageComponent } from './app/modules/auth/components/auth-page/auth-page.component';
import { LoginFormComponent } from './app/modules/auth/components/login-form/login-form.component';
import { RegisterFormComponent } from './app/modules/auth/components/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './app/modules/auth/components/forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './app/modules/auth/components/reset-password-form/reset-password-form.component';

export const routes: Routes = [
    // Home module - needs to be defined before Auth module
    { path: '', loadChildren: () => import('./app/modules/home/home.routes').then(m => m.HOME_ROUTES), canActivate: [AuthGuard] },

    // Auth module
    {
        path: '',
        component: AuthPageComponent,
        children: [
            { path: 'prijava', component: LoginFormComponent, canActivate: [LoggedInAuthGuard] },
            { path: 'login', redirectTo: 'prijava', pathMatch: 'full' },
            { path: 'registracija', component: RegisterFormComponent, canActivate: [LoggedInAuthGuard] },
            { path: 'register', redirectTo: 'registracija', pathMatch: 'full' },
            { path: 'pozabljeno-geslo', component: ForgotPasswordFormComponent, canActivate: [LoggedInAuthGuard] },
            { path: 'ponastavi-geslo', component: ResetPasswordFormComponent, canActivate: [LoggedInAuthGuard] },
        ],
    },

    // Search module
    { path: 'iskanje', loadChildren: () => import('./app/modules/search/search.routes').then(m => m.SEARCH_ROUTES), canActivate: [AuthGuard] },

    // User module
    { path: 'u', loadChildren: () => import('./app/modules/user/user.routes').then(m => m.USER_ROUTES), canActivate: [AuthGuard] },

    // Recommend module
    { path: 'razisci', loadChildren: () => import('./app/modules/recommend/recommend.routes').then(m => m.RECOMMEND_ROUTES), canActivate: [AuthGuard] },

    // Sudo module - guards defined in the module
    { path: '', loadChildren: () => import('./app/modules/sudo/sudo.routes').then(m => m.SUDO_ROUTES) },

    // About module
    { path: '', loadChildren: () => import('./app/modules/about/about.routes').then(m => m.ABOUT_ROUTES) },

    // 404 error page
    { path: '**', component: ErrorComponent, canActivate: [AuthGuard] }
];


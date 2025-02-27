import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth/auth.guard';
import { LoggedInAuthGuard } from './modules/auth/guards/logged-in/logged-in-guard.guard';
import { AdminGuard } from './modules/sudo/guards/admin-guard/admin.guard';
import { ErrorComponent } from './modules/shared/components/error/error.component';
import { AuthPageComponent } from './modules/auth/components/auth-page/auth-page.component';
import { LoginFormComponent } from './modules/auth/components/login-form/login-form.component';
import { RegisterFormComponent } from './modules/auth/components/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './modules/auth/components/forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './modules/auth/components/reset-password-form/reset-password-form.component';

const routes: Routes = [
    // Home module
    // Needs to be defined before Auth module
    { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },

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
    { path: 'iskanje', loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule), canActivate: [AuthGuard] },

    // User module
    { path: 'u', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },

    // Recommned module
    { path: 'razisci', loadChildren: () => import('./modules/recommend/recommend.module').then(m => m.RecommendModule), canActivate: [AuthGuard] },

    // Sudo module - guards defined in the module
    { path: '', loadChildren: () => import('./modules/sudo/sudo.module').then(m => m.SudoModule) },

    // About module
    { path: '', loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule) },

    // 404 error page
    { path: '**', component: ErrorComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        AuthGuard,
        LoggedInAuthGuard,
        AdminGuard
    ]
})
export class AppRoutingModule { }

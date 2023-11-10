import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth/auth.guard';
import { ErrorComponent } from './modules/shared/components/error/error.component';
import { LoggedInAuthGuard } from './modules/auth/guards/logged-in/logged-in-guard.guard';
import { LoginPageComponent } from './modules/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './modules/auth/components/register-page/register-page.component';

const routes: Routes = [

  // Auth module - not lazy loaded
  { path: 'prijava', component: LoginPageComponent, canActivate: [LoggedInAuthGuard]},
  { path: 'login', redirectTo: 'prijava', pathMatch: 'full' },
  { path: 'registracija', component: RegisterPageComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'register', redirectTo: 'registracija', pathMatch: 'full' },

  // Home module
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },

  // User module
  { path: 'uporabnik', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },

  // Search module
  { path: 'iskanje', loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule), canActivate: [AuthGuard] },
  
  // Sudo module
  { path: 'profil', loadChildren: () => import('./modules/sudo/sudo.module').then(m => m.SudoModule), canActivate: [AuthGuard] },

  // About module
  { path: '', loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule), canActivate: [AuthGuard] },
  
  // 404 error page
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    LoggedInAuthGuard
  ]
})
export class AppRoutingModule { }

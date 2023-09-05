import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './modules/auth/guards/auth/auth.guard';
import { NotFoundComponent } from './modules/shared/components/not-found/not-found.component';
import { HomePageComponent } from './modules/home/components/home-page/home-page.component';
import { LoginPageComponent } from './modules/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './modules/auth/components/register-page/register-page.component';
import { SearchPageComponent } from './modules/search/components/search-page/search-page.component';
import { TermsPageComponent } from './modules/auth/components/terms-page/terms-page.component';
import { AboutPageComponent } from './modules/about/components/about-page/about-page.component';
import { DonatePageComponent } from './modules/about/components/donate-page/donate-page.component';
import { LoggedInAuthGuard } from './modules/auth/guards/logged-in/logged-in-guard.guard';


const routes: Routes = [
  // public routes
  { path: 'prijava', component: LoginPageComponent, canActivate: [LoggedInAuthGuard]},
  { path: 'login', redirectTo: 'prijava', pathMatch: 'full' },
  { path: 'registracija', component: RegisterPageComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'register', redirectTo: 'registracija', pathMatch: 'full' },
  { path: 'pogoji', component: TermsPageComponent },
  { path: 'terms', redirectTo: 'pogoji' },

  // private routes, auth needed
  { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'iskanje', component: SearchPageComponent, canActivate: [AuthGuard] },

  { path: 'o-nas', component: AboutPageComponent, canActivate: [AuthGuard] },
  { path: 'donacije', component: DonatePageComponent, canActivate: [AuthGuard] },
  { path: 'donate', redirectTo: 'donacije', pathMatch: 'full' },
  { path: 'doniraj', redirectTo: 'donacije', pathMatch: 'full' },

  // Lazy loaded modules
  // Sudo module
  { path: 'profil', loadChildren: () => import('./modules/sudo/sudo.module').then(m => m.SudoModule), canActivate: [AuthGuard] },

  // 404 error page
  { path: '**', component: NotFoundComponent }
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

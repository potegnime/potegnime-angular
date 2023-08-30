import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './modules/shared/guards/auth.guard';
import { NotFoundComponent } from './modules/shared/components/not-found/not-found.component';
import { HomePageComponent } from './modules/home/components/home-page/home-page.component';
import { LoginPageComponent } from './modules/auth/components/login-page/login-page.component';
import { RegisterPageComponent } from './modules/auth/components/register-page/register-page.component';
import { SearchPageComponent } from './modules/search/components/search-page/search-page.component';
import { TermsPageComponent } from './modules/auth/components/terms-page/terms-page.component';
import { MyProfilePageComponent } from './modules/profile/components/my-profile-page/my-profile-page.component';
import { UploadTorrentPageComponent } from './modules/profile/components/upload-torrent-page/upload-torrent-page.component';
import { SettingsPageComponent } from './modules/profile/components/settings-page/settings-page.component';
import { AboutPageComponent } from './modules/about/components/about-page/about-page.component';
import { DonatePageComponent } from './modules/about/components/donate-page/donate-page.component';


const routes: Routes = [
  // public routes
  { path: 'prijava', component: LoginPageComponent },
  { path: 'login', redirectTo: 'prijava', pathMatch: 'full' },
  { path: 'registracija', component: RegisterPageComponent },
  { path: 'register', redirectTo: 'registracija', pathMatch: 'full' },
  { path: 'pogoji', component: TermsPageComponent },
  { path: 'terms', redirectTo: 'pogoji' },

  // private routes, auth needed
  { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'iskanje', component: SearchPageComponent, canActivate: [AuthGuard] },

  { path: 'profil/moj-profil', component: MyProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'profil', redirectTo: 'profil/moj-profil', pathMatch: 'full' },
  { path: 'profil/nastavitve', component: SettingsPageComponent },
  { path: 'profil/ustvari', component: UploadTorrentPageComponent },

  { path: 'o-nas', component: AboutPageComponent },
  { path: 'donacije', component: DonatePageComponent },


  // 404 error page
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

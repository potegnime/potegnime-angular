// about-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { UploadTorrentPageComponent } from './components/upload-torrent-page/upload-torrent-page.component'
import { AuthGuard } from '../auth/guards/auth/auth.guard';

const routes: Routes = [
  { path: 'moj-profil', component: MyProfilePageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'profil/moj-profil', pathMatch: 'full' },
  { path: 'nastavitve', component: SettingsPageComponent, canActivate: [AuthGuard] },
  { path: 'ustvari', component: UploadTorrentPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class SudoRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { AdministrationPageComponent } from './components/administration-page/administration-page.component';
import { AuthGuard } from '../auth/guards/auth/auth.guard';
import { UploadTorrentPageComponent } from './components/upload-torrent-page/upload-torrent-page.component';
import { AdminGuard } from './guards/admin-guard/admin.guard';
import { UploaderGuard } from './guards/uploader-guard/uploader.guard';

const routes: Routes = [
    { path: 'nastavitve', component: SettingsPageComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdministrationPageComponent, canActivate: [AdminGuard] },
    { path: 'ustvari', component: UploadTorrentPageComponent, canActivate: [UploaderGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        AuthGuard,
        AdminGuard,
        UploaderGuard
    ]
})
export class SudoRoutingModule { }
import { Routes } from "@angular/router";
import { AdminGuard } from "src/app/core/guards/admin.guard";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { UploaderGuard } from "src/app/core/guards/uploader.guard";

export const SUDO_ROUTES: Routes = [
    { path: 'nastavitve', loadComponent: () => import('./components/settings-page/settings-page.component').then(m => m.SettingsPageComponent), canActivate: [AuthGuard] },
    { path: 'admin', loadComponent: () => import('./components/administration-page/administration-page.component').then(m => m.AdministrationPageComponent), canActivate: [AdminGuard] },
    { path: 'ustvari', loadComponent: () => import('./components/upload-torrent-page/upload-torrent-page.component').then(m => m.UploadTorrentPageComponent), canActivate: [UploaderGuard] },
];

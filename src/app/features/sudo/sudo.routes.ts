import { Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { UploaderGuard } from '@core/guards/uploader.guard';

export const SUDO_ROUTES: Routes = [
  {
    path: 'settings',
    loadComponent: () => import('./components/settings-page/settings-page.component').then((m) => m.SettingsPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/administration-page/administration-page.component').then((m) => m.AdministrationPageComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./components/upload-torrent-page/upload-torrent-page.component').then((m) => m.UploadTorrentPageComponent),
    canActivate: [UploaderGuard]
  }
];

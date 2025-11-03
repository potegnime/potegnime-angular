import { Routes } from "@angular/router";
import { SettingsPageComponent } from "./components/settings-page/settings-page.component";
import { AdministrationPageComponent } from "./components/administration-page/administration-page.component";
import { UploadTorrentPageComponent } from "./components/upload-torrent-page/upload-torrent-page.component";
import { UploaderGuard } from "./guards/uploader-guard/uploader.guard";
import { AdminGuard } from "./guards/admin-guard/admin.guard";
import { AuthGuard } from "../auth/guards/auth/auth.guard";

export const SUDO_ROUTES: Routes = [
    { path: 'nastavitve', component: SettingsPageComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdministrationPageComponent, canActivate: [AdminGuard] },
    { path: 'ustvari', component: UploadTorrentPageComponent, canActivate: [UploaderGuard] },
];

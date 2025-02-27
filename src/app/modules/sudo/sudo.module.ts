import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { SudoNavComponent } from './components/sudo-nav/sudo-nav.component';
import { SharedModule } from '../shared/shared.module';
import { AdministrationPageComponent } from './components/administration-page/administration-page.component';
import { UploadTorrentPageComponent } from './components/upload-torrent-page/upload-torrent-page.component';
import { SudoRoutingModule } from './sudo-routing.module';

@NgModule({
    declarations: [
        SettingsPageComponent,
        SudoNavComponent,
        AdministrationPageComponent,
        UploadTorrentPageComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SudoRoutingModule
    ], exports: [
        SudoNavComponent
    ]
})
export class SudoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { UploadTorrentPageComponent } from './components/upload-torrent-page/upload-torrent-page.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SudoNavComponent } from './components/sudo-nav/sudo-nav.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
    declarations: [
        SettingsPageComponent,
        UploadTorrentPageComponent,
        SudoNavComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()
    ], exports: [
        SudoNavComponent
    ]
})
export class SudoModule { }

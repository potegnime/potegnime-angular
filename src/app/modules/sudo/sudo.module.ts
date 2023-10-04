import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudoRoutingModule } from './sudo-routing.module';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { UploadTorrentPageComponent } from './components/upload-torrent-page/upload-torrent-page.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SudoNavComponent } from './components/sudo-nav/sudo-nav.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MyProfilePageComponent,
    SettingsPageComponent,
    UploadTorrentPageComponent,
    SudoNavComponent
  ],
  imports: [
    SudoRoutingModule,
    CommonModule,
    SharedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ]
})
export class SudoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { NavComponent } from 'src/app/layout/nav/nav.component';
import { RatioComponent } from './components/ratio/ratio.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TinyTorrentComponent } from './components/tiny-torrent/tiny-torrent.component';
import { TorrentComponent } from './components/torrent/torrent.component';
import { UploadedTorrentComponent } from './components/uploaded-torrent/uploaded-torrent.component';
import { LikedTorrentComponent } from './components/liked-torrent/liked-torrent.component';
import { LoginPageComponent } from '../auth/components/login-page/login-page.component';
import { RegisterPageComponent } from '../auth/components/register-page/register-page.component';
import { TermsPageComponent } from '../auth/components/terms-page/terms-page.component';


@NgModule({
  declarations: [
    HeaderComponent,
    NavComponent,
    FooterComponent,
    RatioComponent,
    NotificationsComponent,
    SearchBarComponent,
    NotFoundComponent,
    TinyTorrentComponent,
    TorrentComponent,
    UploadedTorrentComponent,
    LikedTorrentComponent,
    LoginPageComponent,
    RegisterPageComponent,
    TermsPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    RouterModule,
    HeaderComponent,
    SearchBarComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
    TorrentComponent,
    LoginPageComponent,
    RegisterPageComponent,
    TermsPageComponent]
})
export class SharedModule { }

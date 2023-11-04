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
import { UploadedTorrentComponent } from './components/uploaded-torrent/uploaded-torrent.component';
import { LikedTorrentComponent } from './components/liked-torrent/liked-torrent.component';
import { TermsPageComponent } from '../auth/components/terms-page/terms-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProfileTorrentsComponent } from './components/profile-torrents/profile-torrents.component';
import { Date1337xPipe } from './pipes/date-1337.pipe';
import { TorrentSourcePipe } from './pipes/torrent-source.pipe';

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
    UploadedTorrentComponent,
    LikedTorrentComponent,
    TermsPageComponent,
    LoadingSpinnerComponent,
    ProfileTorrentsComponent,
    Date1337xPipe,
    TorrentSourcePipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderComponent,
    SearchBarComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
    TermsPageComponent,
    LoadingSpinnerComponent,
    ProfileTorrentsComponent,
    Date1337xPipe,
    TorrentSourcePipe
  ]
})
export class SharedModule { }

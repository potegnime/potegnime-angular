import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { HomeTorrentComponent } from './components/home-torrent/home-torrent.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        HomePageComponent,
        HomeHeaderComponent,
        HomeTorrentComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        HomeRoutingModule
    ],
    providers: []
})
export class HomeModule { }

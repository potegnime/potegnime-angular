import { Component } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    headerLoading = false;
    torrentLoading = false;

    get isLoading(): boolean {
        return this.headerLoading || this.torrentLoading;
    }

    onHeaderLoadingChange(isLoading: boolean): void {
        this.headerLoading = isLoading;
    }

    onTorrentLoadingChange(isLoading: boolean): void {
        this.torrentLoading = isLoading;
    }
}

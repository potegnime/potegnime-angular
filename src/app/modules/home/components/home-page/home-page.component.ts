import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/modules/search/services/search-service/search.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    standalone: false
})
export class HomePageComponent implements OnInit {
    headerLoading = false;
    torrentLoading = false;

    constructor(
        private readonly searchService: SearchService
    ) { }

    ngOnInit(): void {
        this.searchService.ping().subscribe({
            next: (response: any) => {
                console.log('Ping successful:', response);
            },
            error: (error: any) => {
                console.error('Ping failed:', error);
            }
        });
    }

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

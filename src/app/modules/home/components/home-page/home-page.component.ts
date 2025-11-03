import { Component, OnInit, inject } from '@angular/core';
import { SearchService } from 'src/app/modules/search/services/search-service/search.service';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { HomeTorrentComponent } from '../home-torrent/home-torrent.component';
import { LoadingSpinnerComponent } from 'src/app/modules/shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [HomeHeaderComponent, HomeTorrentComponent, LoadingSpinnerComponent,],
    standalone: true
})
export class HomePageComponent implements OnInit {
    private readonly searchService = inject(SearchService);

    protected headerLoading: boolean = false;
    protected torrentLoading: boolean = false;

    ngOnInit(): void {
        this.searchService.ping().subscribe({
            next: (response: any) => {
                // console.log('Ping successful:', response);
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

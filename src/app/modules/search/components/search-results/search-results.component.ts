import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/modules/search/services/search.service';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';
import { SearchRequestDto } from '../../models/search-request.interface';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Torrent } from 'src/app/modules/torrent/models/torrent.interface';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
    // Params gathered from URL
    private searchQuery: string = '';
    private category: string | null = null;
    private source: string | null = null;
    private sort: string = 'default';

    searchResults: any[] = [];
    displayLoadingSpinner: boolean = true;
    noResults: boolean = false;
    missingQuery: boolean = false;

    copyText: string = 'Magnet link';
    copyHighlightText: string = 'Kopirano!';
    downloadText: string = 'Potegni ga!';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly searchService: SearchService,
        private readonly toastr: ToastrService,
        private readonly authService: AuthService
    ) { }

    ngOnInit(): void {
        // onInit, get search query from URL and fetch search results
        this.noResults = false;
        this.route.queryParams.subscribe((params) => {
            // Set params from URL - only q, category and source are used
            // Limit is set to null - backend handles this
            // Sorting is done on frontend
            this.searchQuery = params['q'];
            this.category = params['category'];
            this.source = params['source'];

            if (this.searchQuery) {
                // Empty search results on new search
                this.searchResults = [];
                this.missingQuery = false;

                // Build search request DTO and fetch search results
                const searchRequestDto: SearchRequestDto = {
                    query: this.searchQuery,
                    category: this.category || null,
                    source: this.source || null,
                    limit: null
                };
                this.fetchSearchResults(searchRequestDto);
            } else {
                this.missingQuery = true;
                this.displayLoadingSpinner = false;
                this.noResults = false;
            }
        });
    }

    private fetchSearchResults(searchRequestDto: SearchRequestDto): void {
        this.displayLoadingSpinner = true;
        this.noResults = false;
        this.searchService.searchTorrents(searchRequestDto).subscribe({
            next: (results) => {
                // Convert response from JSON to array of objects
                let torrents: Torrent[] = [];
                for (const provider in results) {
                    if (results.hasOwnProperty(provider)) {
                        const providerTorrents = results[provider];
                        for (const torrent of providerTorrents) {
                            torrents.push({
                                source: provider,
                                title: torrent.title,
                                time: torrent.time,
                                size: torrent.size,
                                url: torrent.url,
                                seeds: torrent.seeds,
                                peers: torrent.peers,
                                imdb: torrent.imdb
                            });
                        }
                    }
                }

                // console.log(`Search results: ${JSON.stringify(torrents)}`);
                this.displayLoadingSpinner = false;
                this.noResults = false;
                this.searchResults = torrents;
            },
            error: (error) => {
                switch (error.status) {
                    case 400:
                        // Check if message is present and can be displayed
                        if (error.error.message && error.error.errorCode == 1) {
                            this.toastr.error(`Napaka pri iskanju torrentov: ${error.error.message}`, '', { timeOut: 5000 });
                            break;
                        } else {
                            this.toastr.error('Napaka pri iskanju torrentov', '', { timeOut: 5000 });
                            break;
                        }
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 404:
                        // No results
                        this.handle404();
                        break;
                    default:
                        this.toastr.error('Napaka pri iskanju torrentov', '', { timeOut: 5000 });
                        break;
                }
                this.displayLoadingSpinner = false;
                this.noResults = true;
            }
        });
    }

    protected toggleRow(torrent: any) {
        torrent.expanded = !torrent.expanded;
    }

    protected handle404() {
        this.displayLoadingSpinner = false;
        this.noResults = true;
        this.searchResults = [];
    }

    protected getUploaderUrl(torrent: any): string {
        switch (torrent.source) {
            case 'Native':
                // TODO
                return urlConst.appBase;
            case 'thePirateBay':
                return 'https://thepiratebay.org/';
            case '_1337x':
                return 'https://1337x.to/';
            case 'yts':
                return 'https://yts.mx/';
            default:
                return urlConst.appBase;
        }
    }

    protected copy(event: any, copyButton: HTMLButtonElement, torrentUrl: string): void {
        event.stopPropagation();
        // Copy torrent URL to clipboard
        navigator.clipboard.writeText(torrentUrl);
        // Change button color to blue and text to "Kopirano!" for 750ms
        const buttonParagraph = copyButton.querySelector('p');
        copyButton.style.backgroundColor = '#639bc3';

        if (buttonParagraph) {
            buttonParagraph.textContent = this.copyText;
            buttonParagraph.textContent = this.copyHighlightText;
            setTimeout(() => {
                copyButton.style.backgroundColor = '';
                buttonParagraph.textContent = this.copyText;
            }, 750);
        } else {
            // Cannot find button paragraph, only change color
            setTimeout(() => {
                copyButton.style.backgroundColor = '';
            }, 750);
        }
    }

    protected download(event: any, torrentUrl: string): void {
        event.stopPropagation();
        // Open torrent URL in new tab
        window.open(torrentUrl, '_blank');
        // TODO - convert to .torrent file and download it
    }
}
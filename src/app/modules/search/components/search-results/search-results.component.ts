import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/modules/search/services/search-service/search.service';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';
import { SearchRequestDto } from '../../models/search-request.interface';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { Torrent } from 'src/app/modules/search/models/torrent.interface';
import { DatePipe } from '@angular/common';
import { SortService } from '../../services/sort-service/sort.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
    private searchQuery: string = '';
    private category: string | null = null;
    private source: string | null = null;
    private sort: string = 'default';

    protected searchResults: any[] = [];
    protected displayLoadingSpinner: boolean = true;
    protected noResults: boolean = false;
    protected missingQuery: boolean = false;

    protected copyText: string = 'Magnet link';
    protected copyHighlightText: string = 'Kopirano';
    protected downloadText: string = 'Potegni ga';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly searchService: SearchService,
        private readonly toastr: ToastrService,
        private readonly authService: AuthService,
        private readonly sortService: SortService,
        private readonly datePipe: DatePipe
    ) { }

    public ngOnInit(): void {
        this.noResults = false;
        this.route.queryParams.subscribe((params) => {
            this.searchQuery = params['q'];
            this.category = params['category'];
            this.source = params['source'];
            this.sort = params['sort'] ?? 'default';

            if (this.searchQuery) {
                this.searchResults = [];
                this.missingQuery = false;

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
                this.displayLoadingSpinner = false;
                this.noResults = false;
                this.searchResults = torrents;
                this.sortResults(this.sort);
            },
            error: (error) => {
                switch (error.status) {
                    case 400:
                        // Check if message is present and can be displayed
                        if (error.error.message && error.error.errorCode == 1) {
                            this.toastr.error('', `Napaka pri iskanju torrentov: ${error.error.message}`, { timeOut: timingConst.error });
                            break;
                        } else {
                            this.toastr.error('', 'Napaka pri iskanju torrentov', { timeOut: timingConst.error });
                            break;
                        }

                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 404:
                        // No results
                        this.handle404();
                        break;
                    case 503:
                        // TODO
                        // Cannot use potegnime-scraper - display native only
                        this.toastr.error('', 'Storitev trenutno ni na voljo', { timeOut: timingConst.error });
                        break;
                    default:
                        this.toastr.error('', 'Napaka pri iskanju torrentov', { timeOut: timingConst.error });
                        break;
                }
                this.displayLoadingSpinner = false;
                this.noResults = true;
            }
        });
    }

    protected handle404() {
        this.displayLoadingSpinner = false;
        this.noResults = true;
        this.searchResults = [];
    }

    protected sortResults(sort: string): void {
        switch (sort) {
            case 'default':
                break;
            case 'name-asc':
                try {
                    this.searchResults.sort((a, b) => a.title.localeCompare(b.title));
                } catch {
                    this.toastr.info('', 'Sortiranje po imenu naraščajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'name-desc':
                try {
                    this.searchResults.sort((a, b) => b.title.localeCompare(a.title));
                } catch {
                    this.toastr.info('', 'Sortiranje po imenu padajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'uploader-asc':
                try {
                    this.searchResults.sort((a, b) => a.source.localeCompare(b.source));
                } catch {
                    this.toastr.info('', 'Sortiranje po uploaderju naraščajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'uploader-desc':
                try {
                    this.searchResults.sort((a, b) => b.source.localeCompare(a.source));
                } catch {
                    this.toastr.info('', 'Sortiranje po uploaderju padajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'date-asc':
                try {
                    this.searchResults.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                } catch {
                    this.toastr.info('', 'Sortiranje po datumu naraščajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'date-desc':
                try {
                    this.searchResults.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                } catch {
                    this.toastr.info('', 'Sortiranje po datumu padajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'seed-asc':
                try {
                    this.searchResults.sort((a, b) => a.seeds - b.seeds);
                } catch {
                    this.toastr.info('', 'Sortiranje po sejalcih naraščajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'seed-desc':
                try {
                    this.searchResults.sort((a, b) => b.seeds - a.seeds);
                } catch {
                    this.toastr.info('', 'Sortiranje po sejalcih padajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'peer-asc':
                try {
                    this.searchResults.sort((a, b) => a.peers - b.peers);
                } catch {
                    this.toastr.info('', 'Sortiranje po peer naraščajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'peer-desc':
                try {
                    this.searchResults.sort((a, b) => b.peers - a.peers);
                } catch {
                    this.toastr.info('', 'Sortiranje po peer padajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'size-asc':
                try {
                    this.searchResults.sort((a, b) => {
                        const sizeA = this.parseSize(a.size);
                        const sizeB = this.parseSize(b.size);
                        return sizeA - sizeB;
                    });
                } catch {
                    this.toastr.info('', 'Sortiranje po velikosti naraščajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            case 'size-desc':
                try {
                    this.searchResults.sort((a, b) => {
                        const sizeA = this.parseSize(a.size);
                        const sizeB = this.parseSize(b.size);
                        return sizeB - sizeA;
                    });
                } catch {
                    this.toastr.info('', 'Sortiranje po velikosti padajoče ni uspelo', { timeOut: timingConst.info });
                }
                break;
            default:
                break;
        }
    }

    protected sortRowColumnClick(columnName: 'name' | 'uploader' | 'size' | 'se' | 'pe') {
        this.sortService.changeSort(this.sort);
        switch (columnName) {
            case 'name':
                if (this.sort == 'name-asc') this.sort = 'name-desc';
                else this.sort = 'name-asc';
                this.sortResults(this.sort);
                break;
            case 'uploader':
                if (this.sort == 'uploader-asc') this.sort = 'uploader-desc';
                else this.sort = 'uploader-asc';
                this.sortResults(this.sort);
                break;
            case 'size':
                if (this.sort == 'size-asc') this.sort = 'size-desc';
                else this.sort = 'size-asc';
                this.sortResults(this.sort);
                break;
            case 'se':
                if (this.sort == 'seed-asc') this.sort = 'seed-desc';
                else this.sort = 'seed-asc';
                this.sortResults(this.sort);
                break;
            case 'pe':
                if (this.sort == 'peer-asc') this.sort = 'peer-desc';
                else this.sort = 'peer-asc';
                this.sortResults(this.sort);
                break;
        }
    }

    protected toggleRow(torrent: any) {
        torrent.expanded = !torrent.expanded;
    }

    protected getUploaderUrl(torrent: any): string {
        switch (torrent.source) {
            case 'thePirateBay':
                return 'https://thepiratebay.org/';
            case 'yts':
                return 'https://yts.mx/';
            case 'torrentProject':
                return 'https://en.wikipedia.org/wiki/Torrent_Project';
            default:
                return urlConst.appBase;
        }
    }

    protected displaySePe(value: any): string {
        if (!value ||
            value == '-' ||
            value == '/' ||
            isNaN(parseInt(value))
        ) {
            return '?';
        }
        return value;
    }

    protected displayTime(value: any): string {
        try {
            const formattedTime = this.datePipe.transform(value, 'd.M.y');
            return formattedTime || '?';
        } catch {
            return '?';
        }
    }

    protected copy(event: any, copyButton: HTMLButtonElement, torrentUrl: string): void {
        event.stopPropagation();
        navigator.clipboard.writeText(torrentUrl);
        const buttonParagraph = copyButton.querySelector('p');
        copyButton.style.backgroundColor = '#639bc3';

        if (buttonParagraph) {
            buttonParagraph.textContent = this.copyText;
            buttonParagraph.textContent = this.copyHighlightText;
            setTimeout(() => {
                copyButton.style.backgroundColor = '';
                buttonParagraph.textContent = this.copyText;
            }, 1000);
        } else {
            setTimeout(() => {
                copyButton.style.backgroundColor = '';
            }, 1000);
        }
    }

    protected download(event: any, torrentUrl: string): void {
        event.stopPropagation();
        window.open(torrentUrl, '_blank');
    }

    private parseSize(size: string): number {
        const sizeParts = size.split(' ');
        const value = parseFloat(sizeParts[0]);
        const unit = sizeParts[1].toUpperCase();
        let multiplier = 1;
        switch (unit) {
            case 'KB':
                multiplier = 1024;
                break;
            case 'MB':
                multiplier = 1024 * 1024;
                break;
            case 'GB':
                multiplier = 1024 * 1024 * 1024;
                break;
            case 'TB':
                multiplier = 1024 * 1024 * 1024 * 1024;
                break;
            case 'PB':
                multiplier = 1024 * 1024 * 1024 * 1024 * 1024;
                break;
        }

        return value * multiplier;
    }
}
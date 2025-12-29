import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { SearchService } from '@features/search/services/search/search.service';
import { SearchRequestDto } from '@features/search/models/search-request.interface';
import { Torrent } from '@features/search/models/torrent.interface';
import { SortService } from '@features/search/services/sort/sort.service';
import { TorrentFileDownloadService } from '@features/search/services/torrent-file-download/torrent-file-download.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { TorrentSourcePipe } from '@shared/pipes/torrent-source.pipe';
import { AboutResultsComponent } from '@features/search/components/about-results/about-results.component';
import { SearchBarSearchComponent } from '@features/search/components/search-bar-search/search-bar-search.component';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  imports: [
    SearchBarSearchComponent,
    AboutResultsComponent,
    LoadingSpinnerComponent,
    TorrentSourcePipe,
    NgClass
  ],
  providers: [DatePipe],
  standalone: true
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly searchService = inject(SearchService);
  private readonly toastService = inject(ToastService);
  private readonly torrentFileDownloadService = inject(TorrentFileDownloadService);
  private readonly sortService = inject(SortService);
  private readonly datePipe = inject(DatePipe);

  private sortSubscription!: Subscription;

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
  protected downloadText: string = 'Potegni me';
  protected isDownloadingTorrentFile: boolean = false;

  public ngOnInit(): void {
    this.noResults = false;

    // Subscribe to sort changes from the search bar dropdown
    this.sortSubscription = this.sortService.currentSort.subscribe((sort) => {
      if (this.searchResults.length > 0 && sort !== this.sort) {
        this.sort = sort;
        this.sortResults(this.sort);
      }
    });

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

  public ngOnDestroy(): void {
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
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
              this.toastService.showError(`Napaka pri iskanju torrentov: ${error.error.message}`);
              break;
            } else {
              this.toastService.showError('Napaka pri iskanju torrentov');
              break;
            }
          case 404:
            // No results
            this.handle404();
            break;
          case 503:
            // TODO
            // Cannot use potegnime-scraper - display native only
            this.toastService.showError('Storitev trenutno ni na voljo');
            break;
          default:
            this.toastService.showError('Napaka pri iskanju torrentov');
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
          this.toastService.showInfo('Sortiranje po imenu naraščajoče ni uspelo');
        }
        break;
      case 'name-desc':
        try {
          this.searchResults.sort((a, b) => b.title.localeCompare(a.title));
        } catch {
          this.toastService.showInfo('Sortiranje po imenu padajoče ni uspelo');
        }
        break;
      case 'uploader-asc':
        try {
          this.searchResults.sort((a, b) => a.source.localeCompare(b.source));
        } catch {
          this.toastService.showInfo('Sortiranje po uploaderju naraščajoče ni uspelo');
        }
        break;
      case 'uploader-desc':
        try {
          this.searchResults.sort((a, b) => b.source.localeCompare(a.source));
        } catch {
          this.toastService.showInfo('Sortiranje po uploaderju padajoče ni uspelo');
        }
        break;
      case 'date-asc':
        try {
          this.searchResults.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );
        } catch {
          this.toastService.showInfo('Sortiranje po datumu naraščajoče ni uspelo');
        }
        break;
      case 'date-desc':
        try {
          this.searchResults.sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          );
        } catch {
          this.toastService.showInfo('Sortiranje po datumu padajoče ni uspelo');
        }
        break;
      case 'seed-asc':
        try {
          this.searchResults.sort((a, b) => a.seeds - b.seeds);
        } catch {
          this.toastService.showInfo('Sortiranje po sejalcih naraščajoče ni uspelo');
        }
        break;
      case 'seed-desc':
        try {
          this.searchResults.sort((a, b) => b.seeds - a.seeds);
        } catch {
          this.toastService.showInfo('Sortiranje po sejalcih padajoče ni uspelo');
        }
        break;
      case 'peer-asc':
        try {
          this.searchResults.sort((a, b) => a.peers - b.peers);
        } catch {
          this.toastService.showInfo('Sortiranje po peer naraščajoče ni uspelo');
        }
        break;
      case 'peer-desc':
        try {
          this.searchResults.sort((a, b) => b.peers - a.peers);
        } catch {
          this.toastService.showInfo('Sortiranje po peer padajoče ni uspelo');
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
          this.toastService.showInfo('Sortiranje po velikosti naraščajoče ni uspelo');
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
          this.toastService.showInfo('Sortiranje po velikosti padajoče ni uspelo');
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
    switch (torrent.source.toLowerCase()) {
      case 'thepiratebay':
        return 'https://thepiratebay.org/';
      case 'yts':
        return 'https://yts.mx/';
      case 'eztv':
        return 'https://eztv.re/';
      case 'torrentProject':
        return 'https://en.wikipedia.org/wiki/Torrent_Project';
      default:
        return '#';
    }
  }

  protected displaySePe(value: any): string {
    if (!value || value == '-' || value == '/' || isNaN(parseInt(value))) {
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

  protected displayProviderName(value: string): string {
    switch (value) {
      case 'thePirateBay':
        return 'The Pirate Bay';
      case 'yts':
        return 'YTS';
      case 'eztv':
        return 'EZTV';
      case 'torrentProject':
        return 'Torrent Project';
      default:
        return value;
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

  protected download(event: any, magnetLink: string, fileName: string): void {
    event.stopPropagation();
    if (this.isDownloadingTorrentFile) return;
    this.isDownloadingTorrentFile = true;
    this.torrentFileDownloadService.downloadTorrentFile(magnetLink).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.torrent`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isDownloadingTorrentFile = false;
      },
      error: (error) => {
        this.isDownloadingTorrentFile = false;
        this.toastService.showError('Prosimo uporabite magnet link', 'Prenos .torrent datoteke ni uspel');
      }
    });
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

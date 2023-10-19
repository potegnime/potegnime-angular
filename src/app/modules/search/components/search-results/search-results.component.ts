import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/modules/shared/services/search-service/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  // Fields
  searchQuery = '';
  searchResults: any[] = [];
  displayLoadingSpinner: boolean = true;
  noResults: boolean = false;

  copyText: string = 'Magnet link';
  copyHighlightText: string = 'Kopirano!';
  downloadText: string = 'Potegni ga!';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly searchService: SearchService
  ) { }

  ngOnInit(): void {
    console.log('INIT')
    this.noResults = false;
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'];
      if (this.searchQuery) {
        // Empty search results on new search
        this.searchResults =  [];
        this.fetchSearchResults(this.searchQuery);
      }
    });
  }

  protected fetchSearchResults(query: string): void {
    this.displayLoadingSpinner = true;
    this.noResults = false;
    this.searchService.searchTorrents(query).subscribe({
      next: (results) => {
        console.log('NEXT')
        if (results.length === 0) {
          // 404
          this.displayLoadingSpinner = false;
          this.noResults = true;
          this.searchResults = [];
        } else {
          this.displayLoadingSpinner = false;
          this.noResults = false;
          this.searchResults = results;
        }

      },
      error: (err) => {
        // TODO
        console.log('ERROR')
      }
    });
  }

  protected toggleRow(torrent: any) {
    torrent.expanded = !torrent.expanded;
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
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'];
      if (this.searchQuery) {
        console.log("ngOnInit searchResults");
        this.fetchSearchResults(this.searchQuery);
      }
    });
  }

  protected fetchSearchResults(query: string): void {
    this.searchService.searchTorrents(query).subscribe({
      next: (results) => {
        this.searchResults = results;
      }
    });
  }
}

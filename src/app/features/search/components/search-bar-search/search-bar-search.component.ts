import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { SearchService } from '@features/search/services/search/search.service';
import { RecommendService } from '@shared/services/recommend/recommend.service';
import { SortService } from '@features/search/services/sort/sort.service';
import { Subscription } from 'rxjs';
import { TorrentCategories } from '@features/search/models/torrent-categories.interface';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-search-bar-search',
  templateUrl: './search-bar-search.component.html',
  styleUrls: ['./search-bar-search.component.scss'],
  imports: [ReactiveFormsModule],
  standalone: true
})
export class SearchBarSearchComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly searchService = inject(SearchService);
  private readonly recommendService = inject(RecommendService);
  private readonly sortService = inject(SortService);

  protected searchForm!: FormGroup;

  protected torrentCategories: TorrentCategories = {} as TorrentCategories;
  protected categories: string[] = [];
  protected providers: string[] = [];
  protected selectedProvider: string = 'All';
  protected selectedCategory: string = 'All';
  protected sort: string = 'default';

  private sortSubscription!: Subscription;

  public ngOnInit(): void {
    this.sortSubscription = this.sortService.currentSort.subscribe((sort) => {
      this.sort = sort;
    });

    // Default values for search form
    this.searchForm = this.formBuilder.group({
      query: [
        this.route.snapshot.queryParamMap.get('q') || '',
        [Validators.required, this.notOnlyWhitespaceValidator]
      ],
      category: ['All'],
      source: ['All'],
      sort: ['default']
    });

    // Get torrent categories
    this.searchService.getCategories().subscribe({
      next: (data: TorrentCategories) => {
        data['All'] = ['All'];
        this.torrentCategories = data;
        this.providers = Object.keys(data);
        // Sort providers
        this.providers.sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : 0));

        this.onProviderChange(this.selectedProvider);
      },
      error: (error) => {
        switch (error.status) {
          case 503:
            // TODO
            // Cannot use potegnime-scraper - display native only
            this.toastService.showError('Storitev trenutno ni na voljo');
            break;
        }
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('q') || '';
      this.searchForm.patchValue({ query });
    });
  }

  public ngOnDestroy(): void {
    this.sortSubscription.unsubscribe();
  }

  private notOnlyWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  protected onSearch(): void {
    if (!this.searchForm.valid) {
      this.toastService.showWarning('Vnesite izraz za iskanje');
      return;
    }

    // Use search service onSearch method
    this.searchService.onSearchComponent(
      this.searchForm.value.query,
      this.selectedCategory === 'All' ? null : this.selectedCategory,
      this.selectedProvider === 'All' ? null : this.selectedProvider,
      null,
      this.searchForm.value.sort == 'default' ? null : this.searchForm.value.sort
    );
  }

  protected searchRandomTitle(): void {
    this.recommendService.getRandomRecommendation().subscribe({
      next: (response) => {
        this.searchForm.patchValue({
          query: response.name
        });
        this.onSearch();
      }
    });
  }

  protected onProviderChange(selectedProvider: string): void {
    this.selectedProvider = selectedProvider;

    this.categories = this.torrentCategories[selectedProvider];
    this.selectedCategory = 'All';

    this.searchForm.patchValue({
      source: this.selectedProvider,
      category: this.selectedCategory
    });

    // Search
    this.onSearch();
  }

  protected onCategoryChange(): void {
    this.selectedCategory = this.searchForm.value.category;
    this.onSearch();
  }

  protected onSortChange(sort: any): void {
    this.sort = this.searchForm.value.sort;
    this.sortService.changeSort(this.sort);
  }

  protected translate(string: string): string {
    switch (string) {
      case 'All':
        return 'Vsi';
      case 'Movies':
        return 'Filmi';
      case 'Audio':
        return 'Avdio';
      case 'Video':
        return 'Video';
      case 'Apps':
      case 'App':
      case 'Applications':
        return 'Aplikacije';
      case 'Games':
        return 'Igre';
      case 'Music':
        return 'Glasba';
      case 'Books':
        return 'Knjige';
      case 'Documentaries':
        return 'Dokumentarci';
      case 'XXX':
      case 'Adult':
      case 'Porn':
        return 'XXX';
      case 'Other':
        return 'Ostalo';
      default:
        return string;
    }
  }
}

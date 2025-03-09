import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from '../../services/search-service/search.service';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { RecommendService } from 'src/app/modules/shared/services/recommend-service/recommend.service';
import { SortService } from '../../services/sort-service/sort.service';
import { Subscription } from 'rxjs';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { TorrentCategories } from '../../models/torrent-categories.interface';

@Component({
    selector: 'app-search-bar-search',
    templateUrl: './search-bar-search.component.html',
    styleUrls: ['./search-bar-search.component.scss']
})
export class SearchBarSearchComponent implements OnInit, OnDestroy {
    protected searchForm!: FormGroup;

    protected torrentCategories: TorrentCategories = {} as TorrentCategories;
    protected categories: string[] = [];
    protected providers: string[] = [];
    protected selectedProvider: string = 'All';
    protected selectedCategory: string = 'All';
    protected sort: string = 'default';

    private sortSubscription!: Subscription;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly toastr: ToastrService,
        private readonly route: ActivatedRoute,
        private readonly searchService: SearchService,
        private readonly authService: AuthService,
        private readonly recommendService: RecommendService,
        private readonly sortService: SortService
    ) { }

    public ngOnInit(): void {
        this.sortSubscription = this.sortService.currentSort.subscribe(sort => {
            this.sort = sort;
        })

        // Get torrent categories
        this.searchService.getCategories().subscribe({
            next: (data: TorrentCategories) => {
                data['All'] = ['All'];
                this.torrentCategories = data;
                this.providers = Object.keys(data);
                // Sort providers
                this.providers.sort((a, b) => (a === 'All') ? -1 : (b === 'All') ? 1 : 0);

                this.onProviderChange(this.selectedProvider);
            },
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 503:
                        // TODO
                        // Cannot use potegnime-scraper - display native only
                        this.toastr.error('', 'Storitev trenutno ni na voljo', { timeOut: timingConst.error });
                        break;
                    default:
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
                        break;
                }
            }
        });

        // Default values for search form
        this.searchForm = this.formBuilder.group({
            query: [this.route.snapshot.queryParamMap.get('q') || '', [Validators.required, this.notOnlyWhitespaceValidator]],
            category: ['All'],
            source: ['All'],
            sort: ['default']
        });

        this.route.queryParamMap.subscribe(params => {
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
        return isValid ? null : { 'whitespace': true };
    }

    protected onSearch(): void {
        if (!this.searchForm.valid) {
            this.toastr.warning('', 'Vnesite izraz za iskanje', { timeOut: timingConst.warning });
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
            },
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    default:
                        this.toastr.error('', 'Napaka pri pridobivanju priporočila', { timeOut: timingConst.error });
                        break;
                }
            }
        })
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
        this.sort = sort;
        this.onSearch();
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

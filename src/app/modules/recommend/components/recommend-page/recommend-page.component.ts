import { Component, NgZone, AfterViewChecked, OnInit } from '@angular/core';
import { RecommendService } from '../../../shared/services/recommend-service/recommend.service';
import { TmdbMovieResponse } from '../../../shared/models/tmdb-movie-response.interface';
import { TmdbTrendingResponse } from '../../../shared/models/tmdb-trending-response.interface';
import { AuthService } from '../../../auth/services/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';

@Component({
    selector: 'app-recommend-page',
    templateUrl: './recommend-page.component.html',
    styleUrls: ['./recommend-page.component.scss']
})
export class RecommendPageComponent implements AfterViewChecked, OnInit {
    protected displayLoadingSpinner: boolean = true;
    private allDataLoaded: boolean = false;
    private sectionToScroll: string | null = null;

    protected language: 'sl-SI' | 'en-US' = 'sl-SI'
    protected region: 'SI' | 'US' = 'SI';
    protected timeWindow: 'day' | 'week' = 'day';

    protected readonly posterUrl = 'https://image.tmdb.org/t/p/original';

    protected nowPlayingMovies: TmdbMovieResponse[] = [];
    protected popularMovies: TmdbMovieResponse[] = [];
    protected topRatedMovies: TmdbMovieResponse[] = [];
    protected upcomingMovies: TmdbMovieResponse[] = [];
    protected trendingMovies: TmdbTrendingResponse[] = [];
    protected trendingTvShows: TmdbTrendingResponse[] = [];

    private errorToastShown: boolean = false;

    constructor(
        private readonly recommendService: RecommendService,
        private readonly authService: AuthService,
        private readonly toastr: ToastrService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly ngZone: NgZone
    ) { }

    public ngOnInit(): void {
        // Get params from url
        this.route.queryParams.subscribe((params) => {
            this.loadSite(
                params['s'],
                this.language,
                this.region
            )
        });
    }

    protected loadSite(sectionId: any, language: any, region: any): void {
        this.allDataLoaded = false;
        this.sectionToScroll = sectionId;

        // Display loading spinner
        this.displayLoadingSpinner = true;

        // Update class properties
        this.language = language;
        this.region = region;

        // Load recommendations
        const requests = [
            this.recommendService.nowPlaying(this.language, 1, this.region),
            this.recommendService.popular(this.language, 1, this.region),
            this.recommendService.topRated(this.language, 1, this.region),
            this.recommendService.upcoming(this.language, 1, this.region),
            this.recommendService.trendingMovie(this.timeWindow, this.language),
            this.recommendService.trendingTv(this.timeWindow, this.language)
        ];

        forkJoin(requests).subscribe({
            next: (responses: any) => {
                this.nowPlayingMovies = responses[0];
                this.popularMovies = responses[1];
                this.topRatedMovies = responses[2];
                this.upcomingMovies = responses[3];
                this.trendingMovies = responses[4];
                this.trendingTvShows = responses[5];

                this.allDataLoaded = true;

                // Hide loading spinner
                this.displayLoadingSpinner = false;
            },
            error: (error: any) => {
                this.displayLoadingSpinner = false;
                this.errorGettingRecommendations();
            }
        });
    }

    ngAfterViewChecked() {
        if (this.allDataLoaded && this.sectionToScroll) {
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.ngZone.run(() => {
                        this.navigateToSection(this.sectionToScroll);
                        this.allDataLoaded = false;
                        this.sectionToScroll = null;
                    });
                }, 500);
            });
        }
    }

    protected navigateToSection(sectionId: any): void {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    protected onSectionDropdownChanged(sectionId: any): void {
        const section = document.getElementById(sectionId.value);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    protected updateLanguage(event: any) {
        this.language = event.value;
        this.loadSite('', this.language, this.region);
    }

    protected updateRegion(event: any) {
        this.region = event.value;
        this.loadSite('', this.language, this.region);
    }

    protected searchTitle(text: string): void {
        if (this.language == 'sl-SI') {
            this.toastr.info('Za boljše rezultate, poskusite iskati v angleščini', 'Iskanje v slovenščini', { timeOut: timingConst.info });
        }
        this.router.navigate(['/iskanje'], { queryParams: { q: text } });
    }

    private errorGettingRecommendations(): void {
        if (!this.errorToastShown) {
            this.toastr.error('', 'Napaka pri pridobivanju torrentov', { timeOut: timingConst.error });
            this.errorToastShown = true;
        }
    }
}

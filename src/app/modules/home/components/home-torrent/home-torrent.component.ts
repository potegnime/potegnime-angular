import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { TmdbMovieResponse } from 'src/app/modules/shared/models/tmdb-movie-response.interface';
import { RecommendService } from 'src/app/modules/shared/services/recommend-service/recommend.service';

@Component({
    selector: 'app-home-torrent',
    templateUrl: './home-torrent.component.html',
    styleUrls: ['./home-torrent.component.scss']
})
export class HomeTorrentComponent implements OnInit {
    protected language: 'sl-SI' | 'en-US' = 'sl-SI'
    protected region: 'SI' | 'US' = 'US';
    protected timeWindow: 'day' | 'week' = 'day';

    protected readonly posterUrl = 'https://image.tmdb.org/t/p/original';

    protected nowPlayingMovies: TmdbMovieResponse[] = [];
    protected popularMovies: TmdbMovieResponse[] = [];
    protected topRatedMovies: TmdbMovieResponse[] = [];

    private errorToastShown: boolean = false;

    constructor(
        private readonly recommendService: RecommendService,
        private readonly authService: AuthService,
        private readonly toastr: ToastrService,
        private readonly router: Router
    ) { }

    public ngOnInit(): void {
        // Load recommendations
        const requests = [
            this.recommendService.nowPlaying(this.language, 1, this.region),
            this.recommendService.popular(this.language, 1, this.region),
            this.recommendService.topRated(this.language, 1, this.region),
        ];

        forkJoin(requests).subscribe({
            next: (responses: any) => {
                this.nowPlayingMovies = responses[0];
                this.popularMovies = responses[1];
                this.topRatedMovies = responses[2];
            },
            error: (error: any) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    default:
                        this.errorGettingRecommendations();
                        break;
                }
            }
        });
    }

    // Error getting recommendations
    private errorGettingRecommendations(): void {
        if (!this.errorToastShown) {
            this.toastr.error('', 'Napaka pri pridobivanju torrentov', { timeOut: timingConst.error });
            this.errorToastShown = true;
        }
    }

    protected searchTitle(text: string): void {
        this.toastr.info('Za boljše rezultate, poskusite iskati v angleščini', 'Iskanje v slovenščini', { timeOut: timingConst.info });
        this.router.navigate(['/iskanje'], { queryParams: { q: text } });
    }

    protected seeMore(section: string) {
        let queryParams = {
            s: section
        }
        this.router.navigate(['/razisci'], { queryParams: queryParams });
    }
}

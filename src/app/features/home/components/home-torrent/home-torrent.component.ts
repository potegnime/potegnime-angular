import { SlicePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { timingConst } from '@core/enums/toastr-timing.enum';
import { TmdbMovieResponse } from '@models/tmdb-movie-response.interface';
import { RecommendService } from '@shared/services/recommend/recommend.service';

@Component({
  selector: 'app-home-torrent',
  templateUrl: './home-torrent.component.html',
  styleUrls: ['./home-torrent.component.scss'],
  imports: [SlicePipe],
  standalone: true
})
export class HomeTorrentComponent implements OnInit {
  private readonly recommendService = inject(RecommendService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  protected language: 'sl-SI' | 'en-US' = 'en-US';
  protected region: 'SI' | 'US' = 'US';
  protected timeWindow: 'day' | 'week' = 'day';

  protected readonly posterUrl = 'https://image.tmdb.org/t/p/original';

  protected nowPlayingMovies: TmdbMovieResponse[] = [];
  protected popularMovies: TmdbMovieResponse[] = [];
  protected topRatedMovies: TmdbMovieResponse[] = [];
  protected isLoading: boolean = true;
  @Output() loadingChange = new EventEmitter<boolean>();

  private errorToastShown: boolean = false;

  public ngOnInit(): void {
    this.setLoading(true);

    // Load recommendations
    const requests = [
      this.recommendService.nowPlaying(this.language, 1, this.region),
      this.recommendService.popular(this.language, 1, this.region),
      this.recommendService.topRated(this.language, 1, this.region)
    ];

    forkJoin(requests).subscribe({
      next: (responses: any) => {
        this.nowPlayingMovies = responses[0];
        this.popularMovies = responses[1];
        this.topRatedMovies = responses[2];
        this.setLoading(false);
      },
      error: (error: any) => {
        switch (error.status) {
          default:
            this.errorGettingRecommendations();
            break;
        }
        this.setLoading(false);
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
    // todo: setting for language, per user, configurable in settings
    // this.toastr.info('Za boljše rezultate, poskusite iskati v angleščini', 'Iskanje v slovenščini', { timeOut: timingConst.info });
    this.router.navigate(['/iskanje'], { queryParams: { q: text } });
  }

  protected seeMore(section: string) {
    let queryParams = {
      s: section
    };
    this.router.navigate(['/razisci'], { queryParams: queryParams });
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingChange.emit(this.isLoading);
  }
}

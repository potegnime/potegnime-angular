import { SlicePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { TmdbMovieResponse } from '@models/tmdb-movie-response.interface';
import { ExploreService } from '@shared/services/explore/explore.service';

@Component({
  selector: 'app-home-torrent',
  templateUrl: './home-torrent.component.html',
  styleUrls: ['./home-torrent.component.scss'],
  imports: [SlicePipe],
  standalone: true
})
export class HomeTorrentComponent implements OnInit {
  private readonly exploreService = inject(ExploreService);
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

  public ngOnInit(): void {
    this.setLoading(true);

    this.exploreService.explore(['now_playing', 'popular', 'top_rated'], this.language, 1, this.region).subscribe({
      next: (responses: any) => {
        this.nowPlayingMovies = responses.now_playing;
        this.popularMovies = responses.popular;
        this.topRatedMovies = responses.top_rated;
        this.setLoading(false);
      },
      error: (error: any) => {
        this.setLoading(false);
      }
    });
  }

  protected searchTitle(text: string): void {
    // todo: setting for language, per user, configurable in settings
    // this.toastr.info('Za boljše rezultate, poskusite iskati v angleščini', 'Iskanje v slovenščini', { timeOut: timingConst.info });
    this.router.navigate(['/search'], { queryParams: { q: text } });
  }

  protected seeMore(section: string) {
    let queryParams = {
      s: section
    };
    this.router.navigate(['/explore'], { queryParams: queryParams });
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingChange.emit(this.isLoading);
  }
}

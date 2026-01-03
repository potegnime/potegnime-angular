import { Component, NgZone, AfterViewChecked, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { TmdbMovieResponse } from '@models/tmdb-movie-response.interface';
import { TmdbTrendingResponse } from '@models/tmdb-trending-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '@core/services/toast/toast.service';
import { ExploreService } from '@shared/services/explore/explore.service';

@Component({
  selector: 'app-recommend-page',
  templateUrl: './recommend-page.component.html',
  styleUrls: ['./recommend-page.component.scss'],
  imports: [LoadingSpinnerComponent, DatePipe],
  standalone: true
})
export class RecommendPageComponent implements AfterViewChecked, OnInit {
  private readonly exploreService = inject(ExploreService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);

  protected displayLoadingSpinner: boolean = true;
  private allDataLoaded: boolean = false;
  private sectionToScroll: string | null = null;

  protected language: 'sl-SI' | 'en-US' = 'en-US';
  protected region: 'SI' | 'US' = 'SI';
  protected timeWindow: 'day' | 'week' = 'day';

  protected readonly posterUrl = 'https://image.tmdb.org/t/p/original';

  protected nowPlayingMovies: TmdbMovieResponse[] = [];
  protected popularMovies: TmdbMovieResponse[] = [];
  protected topRatedMovies: TmdbMovieResponse[] = [];
  protected upcomingMovies: TmdbMovieResponse[] = [];
  protected trendingMovies: TmdbTrendingResponse[] = [];
  protected trendingTvShows: TmdbTrendingResponse[] = [];

  public ngOnInit(): void {
    // Get params from url
    this.route.queryParams.subscribe((params) => {
      this.loadSite(params['s'], this.language, this.region);
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
    this.exploreService
      .explore(
        ['now_playing', 'popular', 'top_rated', 'upcoming', 'trending_movie', 'trending_tv'],
        this.language,
        1,
        this.region
      )
      .subscribe({
        next: (responses: any) => {
          this.nowPlayingMovies = responses.now_playing;
          this.popularMovies = responses.popular;
          this.topRatedMovies = responses.top_rated;
          this.upcomingMovies = responses.upcoming;
          this.trendingMovies = responses.trending_movie;
          this.trendingTvShows = responses.trending_tv;

          this.allDataLoaded = true;

          // Hide loading spinner
          this.displayLoadingSpinner = false;
        },
        error: (error: any) => {
          this.displayLoadingSpinner = false;
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
      this.toastService.showInfo(
        'Za boljše rezultate, poskusite iskati v angleščini',
        'Iskanje v slovenščini'
      );
    }
    this.router.navigate(['/search'], { queryParams: { q: text } });
  }
}

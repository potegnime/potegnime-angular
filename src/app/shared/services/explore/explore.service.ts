import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { TmdbMovieResponse } from '@models/tmdb-movie-response.interface';
import { AdminRecommendation } from '@models/admin-recommendation.interface';


@Injectable({
  providedIn: 'root',
})
export class ExploreService extends BaseHttpService {
  public getRandomRecommendation(): Observable<AdminRecommendation> {
    return this.getJson<AdminRecommendation>(`explore/random`);
  }

  public explore(
    types: ('now_playing' | 'popular' | 'top_rated' | 'upcoming' | 'trending_movie' | 'trending_tv')[],
    language: 'sl-SI' | 'en-US',
    page: number,
    region: 'SI' | 'US',
  ): Observable<TmdbMovieResponse> {
    return this.getJson(`explore?types=${types.join(',')}&language=${language}&region=${region}&page=${page}`);
  }
}

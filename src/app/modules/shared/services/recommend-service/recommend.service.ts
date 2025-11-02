import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token-service/token.service';
import { Observable } from 'rxjs';
import { TmdbTrendingResponse } from '../../models/tmdb-trending-response.interface';
import { TmdbMovieResponse } from '../../models/tmdb-movie-response.interface';
import { AdminRecommendation } from '../../models/admin-recommendation.interface';
import { RecommendationDto } from '../../models/recommendation-dto.interface';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { HttpApiService } from 'src/app/core/services/http-api/http-api.service';
import { ConfigService } from 'src/app/core/services/config/config.service';

@Injectable({
    providedIn: 'root'
})
export class RecommendService extends BaseHttpService {
    constructor(
        httpApiService: HttpApiService,
        configService: ConfigService,
    ) {
        super(httpApiService, configService);
    }

    public nowPlaying(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        return this.getJson(`recommend/nowPlaying?language=${language}&page=${page}&region=${region}`);
    }

    public popular(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        return this.getJson(`recommend/popular?language=${language}&page=${page}&region=${region}`);
    }

    public topRated(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        return this.getJson(`recommend/topRated?language=${language}&page=${page}&region=${region}`);
    }

    public upcoming(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        return this.getJson(`recommend/upcoming?language=${language}&page=${page}&region=${region}`);
    }

    public trendingMovie(timeWindow: 'day' | 'week', language: 'sl-SI' | 'en-US'): Observable<TmdbTrendingResponse> {
        return this.getJson(`recommend/trendingMovie?language=${language}&timeWindow=${timeWindow}`);
    }

    public trendingTv(timeWindow: 'day' | 'week', language: 'sl-SI' | 'en-US'): Observable<TmdbTrendingResponse> {
        return this.getJson(`recommend/trendingTv?language=${language}&timeWindow=${timeWindow}`);
    }

    public setAdminRecommendation(recommendationDto: RecommendationDto): Observable<AdminRecommendation> {
        return this.postJson<RecommendationDto, AdminRecommendation>(`recommend`, recommendationDto);
    }

    public getAdminRecommendation(date: string, type: 'movie' | 'series'): Observable<AdminRecommendation> {
        return this.getJson<AdminRecommendation>(`recommend?date=${date}&type=${type}`);
    }

    public deleteAdminRecommendation(date: string, type: 'movie' | 'series'): Observable<any> {
        return this.deleteJson<any, any>(`recommend?date=${date}&type=${type}`);
    }

    public getRandomRecommendation(): Observable<AdminRecommendation> {
        return this.getJson<AdminRecommendation>(`recommend/random`);
    }
}

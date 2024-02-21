import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token-service/token.service';
import { urlConst } from '../../enums/url.enum';
import { Observable } from 'rxjs';
import { TmdbTrendingResponse } from '../../models/tmdb-trending-response.interface';
import { TmdbMovieResponse } from '../../models/tmdb-movie-response.interface';
import { AdminRecommendation } from '../../models/admin-recommendation.interface';
import { RecommendationDto } from '../../models/recommendation-dto.interface';

@Injectable({
    providedIn: 'root'
})
export class RecommendService {

    constructor(
        private readonly http: HttpClient,
        private readonly tokenService: TokenService
    ) { }

    public nowPlaying(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<TmdbMovieResponse>(`${urlConst.apiBase}/recommend/nowPlaying?language=${language}&page=${page}&region=${region}`, { headers });
    }

    public popular(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<TmdbMovieResponse>(`${urlConst.apiBase}/recommend/popular?language=${language}&page=${page}&region=${region}`, { headers });
    }

    public topRated(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<TmdbMovieResponse>(`${urlConst.apiBase}/recommend/topRated?language=${language}&page=${page}&region=${region}`, { headers });
    }

    public upcoming(language: 'sl-SI' | 'en-US', page: number, region: 'SI' | 'US'): Observable<TmdbMovieResponse> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<TmdbMovieResponse>(`${urlConst.apiBase}/recommend/upcoming?language=${language}&page=${page}&region=${region}`, { headers });
    }

    public trendingMovie(timeWindow: 'day' | 'week', language: 'sl-SI' | 'en-US'): Observable<TmdbTrendingResponse> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<TmdbTrendingResponse>(`${urlConst.apiBase}/recommend/trendingMovie?language=${language}&timeWindow=${timeWindow}`, { headers });
    }

    public trendingTv(timeWindow: 'day' | 'week', language: 'sl-SI' | 'en-US'): Observable<TmdbTrendingResponse> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<TmdbTrendingResponse>(`${urlConst.apiBase}/recommend/trendingTv?language=${language}&timeWindow=${timeWindow}`, { headers });
    }

    public setAdminRecommendation(recommendationDto: RecommendationDto): Observable<AdminRecommendation> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        const formData: FormData = new FormData();
        formData.append('Date', recommendationDto.date);
        formData.append('Type', recommendationDto.type);
        formData.append('Name', recommendationDto.name);

        return this.http.post<AdminRecommendation>(`${urlConst.apiBase}/recommend`, formData, { headers });
    }

    public getAdminRecommendation(date: string, type: 'movie' | 'series'): Observable<AdminRecommendation> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<AdminRecommendation>(`${urlConst.apiBase}/recommend?date=${date}&type=${type}`, { headers });
    }

    public deleteAdminRecommendation(date: string, type: 'movie' | 'series'): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.delete<any>(`${urlConst.apiBase}/recommend?date=${date}&type=${type}`, { headers });
    }

    public getRandomRecommendation(): Observable<AdminRecommendation> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<AdminRecommendation>(`${urlConst.apiBase}/recommend/random`, { headers });
    }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token-service/token.service';
import { urlConst } from '../../enums/url.enum';
import { Observable } from 'rxjs';

type Iso3166Code_1 = 'US' | 'SI' | 'GB' | 'DE' | 'FR';

@Injectable({
    providedIn: 'root'
})
export class RecommendService {

    constructor(
        private readonly http: HttpClient,
        private readonly tokenService: TokenService
    ) { }

    

    public discoverMovies(language: string, page: number, region: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    public discoverTvShows(language: string, page: number, region: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    public nowPlaying(language: string, page: number, region: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    public popular(language: string, page: number, region: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    public topRated(language: string, page: number, region: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    public upcoming(language: string, page: number, region: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    public trendingMovie(timeWindow: 'day' | 'week', language: string): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<any>(`${urlConst.apiBase}/recommend/trendingTv?language=${language}&timeWindow=${timeWindow}`, { headers })
    }

    public trendingTv(timeWindow: 'day' | 'week', language: string) {
        const headers: HttpHeaders = new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }    
}

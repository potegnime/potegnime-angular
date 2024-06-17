import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlConst } from '../../../shared/enums/url.enum';
import { TokenService } from '../../../shared/services/token-service/token.service';
import { SearchRequestDto } from '../../models/search-request.interface';
import { TorrentProviderCategories } from '../../models/torrent-provider-categories.interface';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(
        private readonly http: HttpClient,
        private readonly tokenService: TokenService,
        private readonly router: Router,
    ) { }

    public searchTorrents(searchRequestDto: SearchRequestDto): Observable<any> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        // Build URL
        let url = `${urlConst.apiBase}/search?Query=${searchRequestDto.query}`;
        if (searchRequestDto.category && searchRequestDto.category !== 'All') {
            url += `&Category=${searchRequestDto.category}`;
        }
        if (searchRequestDto.source && searchRequestDto.source !== 'All') {
            url += `&Source=${searchRequestDto.source}`;
        }
        if (searchRequestDto.limit) {
            url += `&Limit=${searchRequestDto.limit}`;
        }

        return this.http.get<any>(url, { headers: headers });
    }

    public getTorrentProviderCategories(): Observable<TorrentProviderCategories> {
        const headers = new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });

        return this.http.get<any>(`${urlConst.apiBase}/search/allProviderCategories`, { headers: headers });
    }

    public onSearchComponent(
        query: string,
        category: string | null,
        source: string | null,
        limit: string | null,
        sort: string | null
    ): void {
        // Build query params
        let queryParams = {};
        if (query) {
            queryParams = { ...queryParams, q: query };
        }
        if (category) {
            queryParams = { ...queryParams, category: category };
        }
        if (source) {
            queryParams = { ...queryParams, source: source };
        }
        if (limit) {
            queryParams = { ...queryParams, limit: limit };
        }
        if (sort) {
            queryParams = { ...queryParams, sort: sort };
        }

        this.router.navigate(['/iskanje'], { queryParams: queryParams });
    }
}

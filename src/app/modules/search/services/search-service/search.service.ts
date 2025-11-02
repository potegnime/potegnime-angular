import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../../../shared/services/token-service/token.service';
import { SearchRequestDto } from '../../models/search-request.interface';
import { Router } from '@angular/router';
import { TorrentCategories } from '../../models/torrent-categories.interface';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { HttpApiService } from 'src/app/core/services/http-api/http-api.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { ApiType } from 'src/app/core/enums/api-type.enum';

@Injectable({
    providedIn: 'root'
})
export class SearchService extends BaseHttpService {
    constructor(
        httpApiService: HttpApiService,
        configService: ConfigService,
        private readonly tokenService: TokenService,
        private readonly router: Router,
    ) {
        super(httpApiService, configService);
    }

    public ping(): Observable<any> {
        // used to wake up scraper API (render free tier sleeps after inactivity)
        // this can be removed after better hosting is in place
        return this.getJson<any>(`ping`);
    }

    public searchTorrents(searchRequestDto: SearchRequestDto): Observable<any> {
        // Build URL
        let url = `search?query=${searchRequestDto.query}`;
        if (searchRequestDto.category && searchRequestDto.category !== 'All') {
            url += `&category=${searchRequestDto.category}`;
        }
        if (searchRequestDto.source && searchRequestDto.source !== 'All') {
            url += `&source=${searchRequestDto.source.toLowerCase()}`;
        }
        if (searchRequestDto.limit) {
            url += `&limit=${searchRequestDto.limit}`;
        }

        return this.getJson<any>(url);
    }

    public getCategories(): Observable<TorrentCategories> {
        // TODO - remove, hardcoded in frontend
        return this.getJson<TorrentCategories>(`categories`);
    }


    public getProviders(): Observable<string[]> {
        // TODO - remove, hardcoded in frontend
        return this.getJson<string[]>(`providers`);
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

    protected override getJson<Response>(urlPath: string, apiType?: ApiType): Observable<Response> {
        return super.getJson<Response>(urlPath, ApiType.Scraper);
    }
}

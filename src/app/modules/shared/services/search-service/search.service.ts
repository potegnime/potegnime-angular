import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { urlConst } from '../../enums/url.enum';
import { TokenService } from '../token-service/token.service';

interface Torrent {
  source: string;
  title: string;
  time: string;
  size: string;
  url: string;
  seeds: number;
  peers: number;
  imdb: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  private readonly token = this.tokenService.getToken();

  searchTorrents(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${urlConst.apiBase}/search?Query=${query}`, {headers: headers}).pipe(
      map((response: any) => {
        // Convert response from JSON to array of objects
        const torrents: Torrent[] = [];
        for (const provider in response) {
          if (response.hasOwnProperty(provider)) {
            const providerTorrents = response[provider];
            for (const torrent of providerTorrents) {
              torrents.push({
                source: provider,
                title: torrent.title,
                time: torrent.time,
                size: torrent.size,
                url: torrent.url,
                seeds: torrent.seeds,
                peers: torrent.peers,
                imdb: torrent.imdb
              });
            }
          }
        }
        return torrents;
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          this.authService.unauthorizedHandler();
          return;
        }
        if (error.status === 404) {
          console.log('search.service.ts: 404 error')
          return of([]);
        }
        return error;
      })
    );
    }
}

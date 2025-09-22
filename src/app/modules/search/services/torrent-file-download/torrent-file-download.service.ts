import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class TorrentFileDownloadService {

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
  ) { }

  public downloadTorrentFile(magnetUrl: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });

    // add magnet as query parameter
    const url = `${urlConst.scraperBase}/download?magnet=${encodeURIComponent(magnetUrl)}`;

    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }
}

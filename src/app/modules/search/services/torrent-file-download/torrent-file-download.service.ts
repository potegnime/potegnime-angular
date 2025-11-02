import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { HttpApiService } from 'src/app/core/services/http-api/http-api.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class TorrentFileDownloadService extends BaseHttpService {

  constructor(
    httpApiService: HttpApiService,
    configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super(httpApiService, configService);
  }

  public downloadTorrentFile(magnetUrl: string): Observable<Blob> {
    return this.getBlob('download?magnet=' + encodeURIComponent(magnetUrl));
  }
}

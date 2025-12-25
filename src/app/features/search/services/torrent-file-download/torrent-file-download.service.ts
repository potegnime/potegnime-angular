import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { ApiType } from '@core/enums/api-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TorrentFileDownloadService extends BaseHttpService {
  public downloadTorrentFile(magnetUrl: string): Observable<Blob> {
    return this.getBlob('download?magnet=' + encodeURIComponent(magnetUrl));
  }

  protected override getBlob(urlPath: string, apiType?: ApiType): Observable<Blob> {
    return super.getBlob(urlPath, ApiType.Scraper);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class TorrentFileDownloadService extends BaseHttpService {

  public downloadTorrentFile(magnetUrl: string): Observable<Blob> {
    return this.getBlob('download?magnet=' + encodeURIComponent(magnetUrl));
  }
}

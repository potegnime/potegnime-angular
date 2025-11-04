import { TestBed } from '@angular/core/testing';

import { TorrentFileDownloadService } from './torrent-file-download.service';

describe('TorrentFileDownloadService', () => {
  let service: TorrentFileDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TorrentFileDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

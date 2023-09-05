import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTorrentPageComponent } from './upload-torrent-page.component';

describe('UploadTorrentPageComponent', () => {
  let component: UploadTorrentPageComponent;
  let fixture: ComponentFixture<UploadTorrentPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadTorrentPageComponent]
    });
    fixture = TestBed.createComponent(UploadTorrentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

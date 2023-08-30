import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedTorrentComponent } from './uploaded-torrent.component';

describe('UploadedTorrentComponent', () => {
  let component: UploadedTorrentComponent;
  let fixture: ComponentFixture<UploadedTorrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadedTorrentComponent]
    });
    fixture = TestBed.createComponent(UploadedTorrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

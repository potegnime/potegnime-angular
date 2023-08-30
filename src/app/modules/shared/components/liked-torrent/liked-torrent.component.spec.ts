import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedTorrentComponent } from './liked-torrent.component';

describe('LikedTorrentComponent', () => {
  let component: LikedTorrentComponent;
  let fixture: ComponentFixture<LikedTorrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikedTorrentComponent]
    });
    fixture = TestBed.createComponent(LikedTorrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyTorrentComponent } from './tiny-torrent.component';

describe('TinyTorrentComponent', () => {
  let component: TinyTorrentComponent;
  let fixture: ComponentFixture<TinyTorrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TinyTorrentComponent]
    });
    fixture = TestBed.createComponent(TinyTorrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

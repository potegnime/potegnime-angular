import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentComponent } from './torrent.component';

describe('TorrentComponent', () => {
  let component: TorrentComponent;
  let fixture: ComponentFixture<TorrentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TorrentComponent]
    });
    fixture = TestBed.createComponent(TorrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

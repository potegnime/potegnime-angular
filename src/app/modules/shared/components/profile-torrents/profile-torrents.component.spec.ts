import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedTorrentsComponent } from './profile-torrents.component';

describe('UploadedTorrentsComponent', () => {
  let component: UploadedTorrentsComponent;
  let fixture: ComponentFixture<UploadedTorrentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadedTorrentsComponent]
    });
    fixture = TestBed.createComponent(UploadedTorrentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

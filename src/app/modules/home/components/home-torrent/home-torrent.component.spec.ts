import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTorrentComponent } from './home-torrent.component';

describe('HomeTorrentComponent', () => {
    let component: HomeTorrentComponent;
    let fixture: ComponentFixture<HomeTorrentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HomeTorrentComponent]
        });
        fixture = TestBed.createComponent(HomeTorrentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

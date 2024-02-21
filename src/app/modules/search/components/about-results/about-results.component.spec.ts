import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutResultsComponent } from './about-results.component';

describe('AboutResultsComponent', () => {
    let component: AboutResultsComponent;
    let fixture: ComponentFixture<AboutResultsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AboutResultsComponent]
        });
        fixture = TestBed.createComponent(AboutResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SudoNavComponent } from './sudo-nav.component';

describe('SudoNavComponent', () => {
    let component: SudoNavComponent;
    let fixture: ComponentFixture<SudoNavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SudoNavComponent]
        });
        fixture = TestBed.createComponent(SudoNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

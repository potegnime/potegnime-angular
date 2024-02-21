import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarSearchComponent } from './search-bar-search.component';

describe('SearchBarSearchComponent', () => {
    let component: SearchBarSearchComponent;
    let fixture: ComponentFixture<SearchBarSearchComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchBarSearchComponent]
        });
        fixture = TestBed.createComponent(SearchBarSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

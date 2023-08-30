import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioComponent } from './ratio.component';

describe('RatioComponent', () => {
  let component: RatioComponent;
  let fixture: ComponentFixture<RatioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatioComponent]
    });
    fixture = TestBed.createComponent(RatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

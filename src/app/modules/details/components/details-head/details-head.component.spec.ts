import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHeadComponent } from './details-head.component';

describe('DetailsHeadComponent', () => {
  let component: DetailsHeadComponent;
  let fixture: ComponentFixture<DetailsHeadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsHeadComponent]
    });
    fixture = TestBed.createComponent(DetailsHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

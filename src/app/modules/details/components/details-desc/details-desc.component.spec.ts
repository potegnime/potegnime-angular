import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDescComponent } from './details-desc.component';

describe('DetailsDescComponent', () => {
  let component: DetailsDescComponent;
  let fixture: ComponentFixture<DetailsDescComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsDescComponent]
    });
    fixture = TestBed.createComponent(DetailsDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

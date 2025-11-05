import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendPageComponent } from './recommend-page.component';

describe('RecommendPageComponent', () => {
  let component: RecommendPageComponent;
  let fixture: ComponentFixture<RecommendPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendPageComponent]
    });
    fixture = TestBed.createComponent(RecommendPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

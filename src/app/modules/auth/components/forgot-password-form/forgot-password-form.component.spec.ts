import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';

describe('ForgotPasswordFormComponent', () => {
  let component: ForgotPasswordFormComponent;
  let fixture: ComponentFixture<ForgotPasswordFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordFormComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

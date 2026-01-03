import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { TokenService } from '@core/services/token/token.service';
import { UserLoginDto } from '@features/auth/models/user-login.interface';
import { AuthResetHelper } from '@features/auth//helpers/auth-reset-helper';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [ReactiveFormsModule, NgClass, LoadingSpinnerComponent, RouterLink],
  standalone: true
})
export class LoginFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected loginForm!: FormGroup;
  protected showLoginError: boolean = false;
  protected triggerErrorAnimation: boolean = false;
  protected loginErrorMessage: string = '';
  protected showPassword: boolean = false;
  protected isSubmitting: boolean = false;

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get register form cache (to remove it if expired)
    AuthResetHelper.getRegisterForm();
  }

  protected onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // prevent multiple requests

      const userLoginDto: UserLoginDto = this.loginForm?.value;
      this.authService.login(userLoginDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.toastService.showSuccess('Prijava uspešna');

          // Clear register form cache
          AuthResetHelper.removeRegisterForm();

          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 401) {
            this.showLoginError = true;
            this.loginErrorMessage = err.error.message;
            this.handleErrorAnimation();
          }
        }
      });
    }
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private handleErrorAnimation() {
    this.triggerErrorAnimation = true;
    setTimeout(() => {
      this.triggerErrorAnimation = false;
    }, 300);
  }
}

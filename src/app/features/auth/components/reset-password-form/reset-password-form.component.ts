import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { ResetPasswordDto } from '@features/auth/models/reset-password.interface';
import { TokenService } from '@core/services/token/token.service';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  imports: [ReactiveFormsModule, NgClass],
  standalone: true
})
export class ResetPasswordFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected resetPasswordForm!: FormGroup;
  protected showResetError: boolean = false;
  protected triggerErrorAnimation: boolean = false;
  protected resetErrorMessage: string = '';
  protected showPassword: boolean = false;
  protected showPasswordConfirm: boolean = false;
  protected isSubmitting: boolean = false;
  protected isSubmitted: boolean = false;
  private token: string | null = null;

  public ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });

    // Check if token is present in query params
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
      if (!this.token) {
        // No need to display toast here, the only way to get to this page is through email link
        this.router.navigate(['/']);
      }
    });
  }

  protected togglePasswordVisibility(fieldNumber: number) {
    if (fieldNumber === 1) {
      this.showPassword = !this.showPassword;
    } else if (fieldNumber === 2) {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }

  protected onSubmit() {
    // Password strength validation
    // Length
    if (this.resetPasswordForm?.value.password.length < 8) {
      this.showResetError = true;
      this.resetErrorMessage = 'Geslo mora vsebovati vsaj 8 znakov';
      this.handleErrorAnimation();
      return;
    }
    // Numbers
    const numbers = /[0-9]/;
    if (!numbers.test(this.resetPasswordForm?.value.password)) {
      this.showResetError = true;
      this.resetErrorMessage = 'Geslo mora vsebovati vsaj 1 številko';
      this.handleErrorAnimation();
      return;
    }
    // Special characters
    /*
    const specialCharacters = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharacters.test(this.resetPasswordForm?.value.password)) {
        this.showResetError = true;
        this.resetErrorMessage = 'Geslo mora vsebovati vsaj 1 posebni znak! (!, $, #, ...)';
        return;
    }
    */

    // Passwords match validation
    if (this.resetPasswordForm?.value.password !== this.resetPasswordForm?.value.passwordConfirm) {
      this.showResetError = true;
      this.resetErrorMessage = 'Gesli se ne ujemata';
      this.handleErrorAnimation();
      return;
    }

    if (this.resetPasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (!this.token) {
        this.router.navigate(['/']);
        return;
      }
      const resetPasswordDto: ResetPasswordDto = {
        password: this.resetPasswordForm.value.password,
        token: this.token
      };

      this.authService.resetPassword(resetPasswordDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          if (resp.accessToken) {
            this.toastService.showSuccess('Geslo uspešno posodobljeno');

            // Save token and redirect
            this.tokenService.setToken(resp.accessToken);
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          switch (err.status) {
            case 400:
              // Token expired or invalid
              // Check if message is present and can be displayed
              // TODO - generalize this across the app
              if (err.error.message && err.error.errorCode == 1) {
                this.toastService.showError(err.error.message);
              }

              this.router.navigate(['/']);
              break;
          }
        }
      });
    }
  }

  private handleErrorAnimation() {
    this.triggerErrorAnimation = true;
    setTimeout(() => {
      this.triggerErrorAnimation = false;
    }, 300);
  }
}

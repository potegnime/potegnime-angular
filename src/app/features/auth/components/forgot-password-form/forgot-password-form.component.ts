import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { ForgotPasswordDto } from '@features/auth/models/forgot-password.interface';
import { AuthResetHelper } from '@features/auth/helpers/auth-reset-helper';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '@core/services/toast/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
  imports: [ReactiveFormsModule, LoadingSpinnerComponent, RouterLink],
  standalone: true
})
export class ForgotPasswordFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected forgotPasswordForm!: FormGroup;
  protected isSubmitting: boolean = false;
  protected isSubmitted: boolean = false;
  protected sendGridLimitExceeded: boolean = false;

  public ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    const forgotPasswordTimeout = AuthResetHelper.getForgotPasswordTimeout();
    if (forgotPasswordTimeout) {
      if (new Date() < forgotPasswordTimeout) {
        const secondsLeft = Math.ceil(
          (forgotPasswordTimeout.getTime() - new Date().getTime()) / 1000
        );
        this.toastService.showWarning(this.warningMessage(secondsLeft));
        this.isSubmitted = true;
      } else {
        AuthResetHelper.removeForgotPasswordTimeout();
      }
    }
  }

  protected onSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // prevent multiple requests
      const forgotPasswordDto: ForgotPasswordDto = this.forgotPasswordForm?.value;

      this.authService.forgotPassword(forgotPasswordDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.isSubmitted = true;
          AuthResetHelper.setForgotPasswordTimeout();
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 429) {
            // SendGrid limit exceeded
            this.isSubmitted = false;
            this.sendGridLimitExceeded = true;
          }
        }
      });
    }
  }

  private warningMessage(sec: number): string {
    switch (sec) {
      case 1:
        return `Prosimo počakajte ${sec} sekundo, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
      case 2:
        return `Prosimo počakajte ${sec} sekundi, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
      case 3:
      case 4:
        return `Prosimo počakajte ${sec} sekunde, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
      default:
        return `Prosimo počakajte ${sec} sekund, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
    }
  }
}

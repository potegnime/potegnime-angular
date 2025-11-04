import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { timingConst } from 'src/app/core/enums/toastr-timing.enum';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordDto } from '../../models/forgot-password.interface';
import { AuthResetHelper } from '../../helpers/auth-reset-helper';
import { LoadingSpinnerComponent } from 'src/app/shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-forgot-password-form',
    templateUrl: './forgot-password-form.component.html',
    styleUrls: ['./forgot-password-form.component.scss'],
    imports: [ReactiveFormsModule, LoadingSpinnerComponent],
    standalone: true
})
export class ForgotPasswordFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  protected forgotPasswordForm!: FormGroup;
  protected isSubmitting: boolean = false;
  protected isSubmitted: boolean = false;
  protected sendGridLimitExceeded: boolean = false;

  public ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    const forgotPasswordTimeout = AuthResetHelper.getForgotPasswordTimeout();
    if (forgotPasswordTimeout) {
      if (new Date() < forgotPasswordTimeout) {
        const minutesLeft = Math.ceil((forgotPasswordTimeout.getTime() - new Date().getTime()) / 60000);
        this.toastr.warning('', this.warningMessage(minutesLeft), { timeOut: timingConst.long });
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
        },
      });
    }
  }

  private warningMessage(min: number): string {
    switch (min) {
      case 1:
        return `Prosimo, počakajte ${min} minuto, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
      case 2:
        return `Prosimo, počakajte ${min} minuti, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
      case 3:
      case 4:
        return `Prosimo, počakajte ${min} minute, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
      default:
        return `Prosimo, počakajte ${min} minut, preden ponovno pošljete zahtevo za ponastavitev gesla.`;
    }
  }
}


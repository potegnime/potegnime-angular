import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordDto } from '../../models/forgot-password.interface';
import { AuthHelper } from '../../helpers/auth-helper';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent implements OnInit {
  protected forgotPasswordForm!: FormGroup;
  protected isSubmitting: boolean = false;
  protected isSubmitted: boolean = false;
  protected sendGridLimitExceeded: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    const forgotPasswordTimeout = AuthHelper.getForgotPasswordTimeout();
    if (forgotPasswordTimeout) {
      if (new Date() < forgotPasswordTimeout) {
        const minutesLeft = Math.ceil((forgotPasswordTimeout.getTime() - new Date().getTime()) / 60000);
        this.toastr.warning('', this.warningMessage(minutesLeft), { timeOut: timingConst.long });
        this.isSubmitted = true;
      } else {
        AuthHelper.removeForgotPasswordTimeout();
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
          AuthHelper.setForgotPasswordTimeout();
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 429) {
            // SendGrid limit exceeded
            this.isSubmitted = false;
            this.sendGridLimitExceeded = true;
          } else {
            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
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


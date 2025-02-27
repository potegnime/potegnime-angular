import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordDto } from '../../models/forgot-password.interface';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent {
  protected forgotPasswordForm: FormGroup;
  protected isSubmitting: boolean = false;
  protected isSubmitted: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  protected onSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // prevent multiple requests
      const forgotPasswordDto: ForgotPasswordDto = this.forgotPasswordForm?.value;

      this.authService.forgotPassword(forgotPasswordDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          this.isSubmitted = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
        },
      });
    }
  }
}

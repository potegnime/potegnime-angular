import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { UserLoginDto } from '../../models/user-login.interface';
import { AuthHelper } from '../../helpers/auth-helper';
import { NgClass } from '@angular/common';
import { LoadingSpinnerComponent } from 'src/app/modules/shared/components/loading-spinner/loading-spinner.component';

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
  private readonly toastr = inject(ToastrService);

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
    AuthHelper.getRegisterForm();
  }

  public test() {
    this.authService.test();
  }

  protected onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // prevent multiple requests

      const userLoginDto: UserLoginDto = this.loginForm?.value;
      this.authService.login(userLoginDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          if (resp.token) {
            this.toastr.success('', 'Prijava uspešna', { timeOut: timingConst.success });

            // Clear register form cache
            AuthHelper.removeRegisterForm();

            this.tokenService.setToken(resp.token);
            this.router.navigate(['/']);
          } else {
            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 401) {
            this.showLoginError = true;
            this.loginErrorMessage = err.error.message;
            this.handleErrorAnimation();
          } else {
            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
          }
        },
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

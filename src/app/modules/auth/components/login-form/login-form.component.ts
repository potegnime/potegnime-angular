import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { UserLoginDto } from '../../models/user-login.interface';
import { AuthHelper } from '../../helpers/auth-helper';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  protected loginForm!: FormGroup;
  protected showLoginError: boolean = false;
  protected triggerErrorAnimation: boolean = false;
  protected loginErrorMessage: string = '';
  protected showPassword: boolean = false;
  protected isSubmitting: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get register form cache (to remove it if expired)
    AuthHelper.getRegisterForm();
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

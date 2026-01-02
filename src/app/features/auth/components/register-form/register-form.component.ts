import { Component, OnInit, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserRegisterDto } from '@features/auth/models/user-register.interface';
import { AuthResetHelper } from '@features/auth/helpers/auth-reset-helper';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { TokenService } from '@core/services/token/token.service';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [NgClass, ReactiveFormsModule, LoadingSpinnerComponent, RouterLink],
  standalone: true
})
export class RegisterFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  registerForm!: FormGroup;
  protected showRegisterError: boolean = false;
  protected triggerErrorAnimation: boolean = false;
  protected registerErrorMessage: string = '';
  protected showPassword: boolean = false;
  protected showPasswordConfirm: boolean = false;
  protected agreeToTermsBool: boolean = false;
  protected isSubmitting: boolean = false;

  public ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      agreeToTerms: [false, Validators.required]
    });

    this.registerForm.valueChanges.subscribe((formValue) => {
      AuthResetHelper.setRegisterForm(formValue);
      if (this.agreeToTermsBool !== this.registerForm.value.agreeToTerms) {
        this.agreeToTermsBool = this.registerForm.value.agreeToTerms;
      }
    });

    const registerFormCache = AuthResetHelper.getRegisterForm();
    if (registerFormCache) {
      this.registerForm.patchValue(registerFormCache);
    }
  }

  protected togglePasswordVisibility(fieldNumber: number) {
    if (fieldNumber === 1) {
      this.showPassword = !this.showPassword;
    } else if (fieldNumber === 2) {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }

  protected onSubmit() {
    // Username validation
    if (this.registerForm?.value.username.length < 4) {
      this.showRegisterError = true;
      this.registerErrorMessage = 'Uporabniško ime mora vsebovati vsaj 4 znake';
      this.handleErrorAnimation();
      return;
    }
    if (this.registerForm?.value.username.length > 100) {
      this.showRegisterError = true;
      this.registerErrorMessage = 'Uporabniško ime ima lahko največ 100 znakov';
      this.handleErrorAnimation();
      return;
    }
    // Username cannot end with a trailing space
    if (this.registerForm?.value.username.endsWith(' ')) {
      this.showRegisterError = true;
      this.registerErrorMessage = 'Uporabniško ime ne sme končati s presledkom';
      this.handleErrorAnimation();
      return;
    }

    // Password strength validation
    // Length
    if (this.registerForm?.value.password.length < 8) {
      this.showRegisterError = true;
      this.registerErrorMessage = 'Geslo mora vsebovati vsaj 8 znakov';
      this.handleErrorAnimation();
      return;
    }
    // Numbers
    const numbers = /[0-9]/;
    if (!numbers.test(this.registerForm?.value.password)) {
      this.showRegisterError = true;
      this.registerErrorMessage = 'Geslo mora vsebovati vsaj 1 številko';
      this.handleErrorAnimation();
      return;
    }
    // Special characters
    /*
    const specialCharacters = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharacters.test(this.registerForm?.value.password)) {
        this.showRegisterError = true;
        this.registerErrorMessage = 'Geslo mora vsebovati vsaj 1 posebni znak! (!, $, #, ...)';
        return;
    }
    */

    // Passwords match validation
    if (this.registerForm?.value.password !== this.registerForm?.value.passwordConfirm) {
      this.showRegisterError = true;
      this.registerErrorMessage = 'Gesli se ne ujemata';
      this.handleErrorAnimation();
      return;
    }

    // Terms validation
    if (!this.registerForm?.value.agreeToTerms) {
      this.showRegisterError = true;
      this.registerErrorMessage =
        'Za nadaljevanje je potrebno strinjanje s spošnimi pogoji uporabe';
      this.handleErrorAnimation();
      return;
    }

    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const userRegisterDto: UserRegisterDto = this.registerForm?.value;
      this.authService.register(userRegisterDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          if (resp.accessToken) {
            this.toastService.showSuccess('Registracija uspešna');

            // Clear register form cache
            AuthResetHelper.removeRegisterForm();

            // Save token and redirect
            this.tokenService.setToken(resp.accessToken)
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 409) {
            // User with this email or username already exists
            this.showRegisterError = true;
            this.registerErrorMessage = err.error.message;
            this.handleErrorAnimation();
          } else if (err.status === 400) {
            // Fields missing errror
            this.showRegisterError = true;
            this.registerErrorMessage = err.error.message;
            this.handleErrorAnimation();
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

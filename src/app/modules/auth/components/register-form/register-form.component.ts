import { Component, OnInit, inject } from '@angular/core';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRegisterDto } from '../../models/user-register.interface';
import { AuthHelper } from '../../helpers/auth-helper';
import { NgClass } from '@angular/common';
import { LoadingSpinnerComponent } from 'src/app/modules/shared/components/loading-spinner/loading-spinner.component';

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
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

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
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      agreeToTerms: [false, Validators.required]
    });

    this.registerForm.valueChanges.subscribe((formValue) => {
      AuthHelper.setRegisterForm(formValue);
      if (this.agreeToTermsBool !== this.registerForm.value.agreeToTerms) {
        this.agreeToTermsBool = this.registerForm.value.agreeToTerms;
      }
    });

    const registerFormCache = AuthHelper.getRegisterForm();
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
      this.registerErrorMessage = 'Za nadaljevanje je potrebno strinjanje s spošnimi pogoji uporabe';
      this.handleErrorAnimation();
      return;
    }

    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const userRegisterDto: UserRegisterDto = this.registerForm?.value;
      this.authService.register(userRegisterDto).subscribe({
        next: (resp) => {
          this.isSubmitting = false;
          if (resp.token) {
            this.toastr.success('', 'Registracija uspešna', { timeOut: timingConst.success });

            // Clear register form cache
            AuthHelper.removeRegisterForm();

            // Save token and redirect
            localStorage.setItem('token', resp.token);
            this.router.navigate(['/']);
          } else {
            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
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
          } else {
            // Unexpected error, show toast
            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
          }
        },
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

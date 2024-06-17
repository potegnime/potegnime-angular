import { Component } from '@angular/core';
import { UserRegisterDto } from '../../models/user-register.interface';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {

    registerForm!: FormGroup;
    protected showRegisterError: boolean = false;
    protected registerErrorMessage: string = '';

    protected showPassword: boolean = false;
    protected showPasswordConfirm: boolean = false;
    protected agreeToTermsBool: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly toastr: ToastrService
    ) {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required],
            agreeToTerms: [false, Validators.required]
        });

        this.registerForm.valueChanges.subscribe(() => {
            if (this.agreeToTermsBool !== this.registerForm.value.agreeToTerms) {
                this.agreeToTermsBool = this.registerForm.value.agreeToTerms;
            }
        });
    }

    // password visibility
    togglePasswordVisibility(fieldNumber: number) {
        if (fieldNumber === 1) {
            this.showPassword = !this.showPassword;
        } else if (fieldNumber === 2) {
            this.showPasswordConfirm = !this.showPasswordConfirm;
        }
    }

    onSubmit() {
        // Username validation
        if (this.registerForm?.value.username.length < 4) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Uporabniško ime mora vsebovati vsaj 4 znake!';
            return;
        }
        // Username cannot end with a trailing space
        if (this.registerForm?.value.username.endsWith(' ')) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Uporabniško ime ne sme končati s presledkom!';
            return;
        }

        // Password strength validation
        // Length
        if (this.registerForm?.value.password.length < 8) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Geslo mora vsebovati vsaj 8 znakov!';
            return;
        }
        // Numbers
        const numbers = /[0-9]/;
        if (!numbers.test(this.registerForm?.value.password)) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Geslo mora vsebovati vsaj 1 številko!';
            return;
        }
        // Special characters
        const specialCharacters = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (!specialCharacters.test(this.registerForm?.value.password)) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Geslo mora vsebovati vsaj 1 posebni znak! (!, $, #, ...)';
            return;
        }

        // Passwords match validation
        if (this.registerForm?.value.password !== this.registerForm?.value.passwordConfirm) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Gesli se ne ujemata!';
            return;
        }

        // Terms validation
        if (!this.registerForm?.value.agreeToTerms) {
            this.showRegisterError = true;
            this.registerErrorMessage = 'Za nadaljevanje je potrebno strinjanje s spošnimi pogoji uporabe';
            return;
        }

        if (this.registerForm?.valid) {
            const userRegisterDto: UserRegisterDto = this.registerForm?.value;

            this.authService.register(userRegisterDto).subscribe({
                next: (resp) => {
                    // Register successful
                    if (resp.token) {
                        // Toast register successful
                        this.toastr.success('Registracija uspešna!');

                        // Save token and redirect
                        localStorage.setItem('token', resp.token);
                        this.router.navigate(['/']);
                    } else {
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                    }
                },
                error: (err) => {
                    // Login failed
                    if (err.status === 409) {
                        // User with this email or username already exists
                        this.showRegisterError = true;
                        this.registerErrorMessage = err.error.message;

                    } else if (err.status === 400) {
                        // Fields missing errror
                        this.showRegisterError = true;
                        this.registerErrorMessage = err.error.message;
                    } else {
                        // Unexpected error, show toast
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                    }
                },
            });
        }
    }

}

import { Component } from '@angular/core';
import { UserLoginDto } from '../../models/user-login.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

    loginForm: FormGroup;
    protected showLoginError: boolean = false;
    protected loginErrorMessage: string = '';
    protected showPassword: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly router: Router,
        private readonly toastr: ToastrService
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const userLoginDto: UserLoginDto = this.loginForm?.value;

            this.authService.login(userLoginDto).subscribe({
                next: (resp) => {
                    // Login successful
                    if (resp.token) {
                        // Toast login successful
                        this.toastr.success('', 'Prijava uspešna!', { timeOut: 2000 });

                        // Save token and redirect
                        this.tokenService.setToken(resp.token);
                        this.router.navigate(['/']);
                    } else {
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                    }
                },
                error: (err) => {
                    // Login failed
                    if (err.status === 401) {
                        // Expected login failure, show login error message
                        this.showLoginError = true;
                        this.loginErrorMessage = err.error.message;
                    } else {
                        // Unexpected error, show toast
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                    }
                },
            });
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

}

import { Component } from '@angular/core';
import { UserLoginDto } from '../../models/user-login.interface';
import { AuthService } from '../../services/auth-service/auth.service';
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

    protected loginForm: FormGroup;
    protected showLoginError: boolean = false;
    protected triggerErrorAnimation: boolean = false;
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
                    if (resp.token) {
                        this.toastr.success('', 'Prijava uspešna!', { timeOut: 2000 });

                        this.tokenService.setToken(resp.token);
                        this.router.navigate(['/']);
                    } else {
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                    }
                },
                error: (err) => {
                    if (err.status === 401) {
                        this.showLoginError = true;
                        this.loginErrorMessage = err.error.message;
                        this.handleErrorAnimation();
                    } else {
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
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

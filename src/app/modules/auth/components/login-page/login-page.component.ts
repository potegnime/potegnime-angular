import { Component } from '@angular/core';
import { UserLoginDto } from '../../models/user-login.interface';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';

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
    protected isSubmitting: boolean = false;

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

    protected onSubmit(): void {
        if (this.loginForm.valid && !this.isSubmitting) {
            this.isSubmitting = true; // prevent multiple requests

            const userLoginDto: UserLoginDto = this.loginForm?.value;
            this.authService.login(userLoginDto).subscribe({
                next: (resp) => {
                    this.isSubmitting = false;
                    if (resp.token) {
                        this.toastr.success('', 'Prijava uspešna!', { timeOut: timingConst.success });

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

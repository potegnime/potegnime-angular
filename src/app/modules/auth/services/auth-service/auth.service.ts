import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegisterDto } from '../../models/user-register.interface';
import { UserLoginDto } from '../../models/user-login.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { ForgotPasswordDto } from '../../models/forgot-password.interface';
import { ResetPasswordDto } from '../../models/reset-password.interface';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseHttpService {
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);
    private readonly tokenService = inject(TokenService);

    public register(userRegisterDto: UserRegisterDto): Observable<any> {
        return this.postJson<UserRegisterDto, any>(`auth/register`, userRegisterDto);
    };

    public login(userLoginDto: UserLoginDto): Observable<any> {
        return this.postJson<UserLoginDto, any>(`auth/login`, userLoginDto);
    };

    public logout(): void {
        this.tokenService.deleteToken();
        this.router.navigate(['/prijava']);
        this.toastr.success('', 'Odjava uspešna', { timeOut: timingConst.success });
    }

    public unauthorizedHandler(): void {
        // Called on 401, or when page cannot be displayed
        this.tokenService.deleteToken();
        this.router.navigate(['/prijava']);
    }

    public verifyToken(): boolean {
        const token = this.tokenService.getToken();
        if (!token) return false;
        return true;
        // return this.jwtHelperService.decodeToken(token) ? true : false;
    }

    public refreshToken(): Observable<any> {
        return this.postJson<any, string>(`auth/refresh`, {});
    }

    public forgotPassword(forgorPasswordDto: ForgotPasswordDto): Observable<any> {
        return this.postJson<ForgotPasswordDto, any>(`auth/forgotPassword`, forgorPasswordDto);
    }

    public resetPassword(resetPasswordDto: ResetPasswordDto): Observable<any> {
        return this.postJson<ResetPasswordDto, any>(`auth/resetPassword`, resetPasswordDto);
    }
}
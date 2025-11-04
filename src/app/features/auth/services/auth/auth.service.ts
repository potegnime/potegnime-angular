import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegisterDto } from '../../models/user-register.interface';
import { UserLoginDto } from '../../models/user-login.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/core/services/token-service/token.service';
import { timingConst } from 'src/app/core/enums/toastr-timing.enum';
import { ForgotPasswordDto } from '../../models/forgot-password.interface';
import { ResetPasswordDto } from '../../models/reset-password.interface';
import { BaseHttpService } from 'src/app/core/services/base-http/base-http.service';
import { AuthHelper } from 'src/app/core/helpers/auth-helper';

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

    /**
     * Verifies JWT token expiration on client side
     * If token is expired, returns false
     * Doesn't check token validity - that is done on server side, client only checks expiration
     * @returns true if token is still valid, false if expired or not present
     */
    public verifyToken(): boolean {
        const token = this.tokenService.getToken();
        if (!token) return false;

        const jwtPayload = AuthHelper.decodeJWT(token);
        const isExpired = jwtPayload.exp < Math.floor(Date.now() / 1000);
        return !isExpired;
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
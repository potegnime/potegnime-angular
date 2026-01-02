import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { AuthHelper } from '@core/helpers/auth-helper';
import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { UserRegisterDto } from '@features/auth/models/user-register.interface';
import { UserLoginDto } from '@features/auth/models/user-login.interface';
import { ForgotPasswordDto } from '@features/auth/models/forgot-password.interface';
import { ResetPasswordDto } from '@features/auth/models/reset-password.interface';
import { JwtTokenResponse } from '@models/jwt-token-response.interface';
import { ToastService } from '@core/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly tokenService = inject(TokenService);

  public register(userRegisterDto: UserRegisterDto): Observable<JwtTokenResponse> {
    return this.postJson<UserRegisterDto, JwtTokenResponse>(`auth/register`, userRegisterDto);
  }

  public login(userLoginDto: UserLoginDto): Observable<JwtTokenResponse> {
    return this.postJson<UserLoginDto, JwtTokenResponse>(`auth/login`, userLoginDto);
  }

  public logout(showToast: boolean = true): Observable<void> {
    return this.postJson<any, void>('auth/logout', {}, true, ApiType.Api).pipe(
      tap(() => {
        this.tokenService.deleteToken();
        this.router.navigate(['/login']);
        if (showToast) this.toastService.showSuccess('Odjava uspešna');
      }),
      catchError(err => {
        this.tokenService.deleteToken();
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  public unauthorizedHandler(): void {
    // Called on 401, or when page cannot be displayed
    this.tokenService.deleteToken();
    this.router.navigate(['/login']);
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
    if (!jwtPayload || !jwtPayload.exp) {
      this.tokenService.deleteToken();
      return false;
    }
    const isExpired = jwtPayload.exp < Math.floor(Date.now() / 1000);
    if (isExpired) {
      this.tokenService.deleteToken();
      return false;
    }
    return true;
  }

  public refreshToken(): Observable<any> {
    return this.postJson<any, string>(`auth/refresh`, {});
  }

  public forgotPassword(forgorPasswordDto: ForgotPasswordDto): Observable<any> {
    return this.postJson<ForgotPasswordDto, any>(`auth/forgotPassword`, forgorPasswordDto);
  }

  public resetPassword(resetPasswordDto: ResetPasswordDto): Observable<JwtTokenResponse> {
    return this.postJson<ResetPasswordDto, JwtTokenResponse>(`auth/resetPassword`, resetPasswordDto);
  }
}

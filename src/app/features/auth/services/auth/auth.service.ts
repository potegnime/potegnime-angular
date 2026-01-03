import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, map, switchMap, tap, throwError } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { BaseHttpService } from '@core/services/base-http/base-http.service';
import { ApplicationDataService } from '@core/services/application-data/application-data.service';
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
  private readonly applicationDataService = inject(ApplicationDataService);

  public login(userLoginDto: UserLoginDto): Observable<JwtTokenResponse> {
    return this.postJson<UserLoginDto, JwtTokenResponse>('auth/login', userLoginDto).pipe(
      tap((res) => {
        this.tokenService.setToken(res.accessToken);
      }),
      switchMap((res) =>
        this.applicationDataService.fetchApplicationData().pipe(
          map(() => res)
        )
      )
    );
  }

  public register(userRegisterDto: UserRegisterDto): Observable<JwtTokenResponse> {
    return this.postJson<UserRegisterDto, JwtTokenResponse>('auth/register', userRegisterDto).pipe(
      tap((res) => {
        this.tokenService.setToken(res.accessToken);
      }),
      switchMap((res) =>
        this.applicationDataService.fetchApplicationData().pipe(
          map(() => res)
        )
      )
    );
  }

  public refreshToken(): Observable<JwtTokenResponse> {
    return this.postJson<any, JwtTokenResponse>(`auth/refresh`, {}).pipe(
      tap((res) => {
        this.tokenService.setToken(res.accessToken);
      })
    );
  }

  public logout(showToast: boolean = true): Observable<void> {
    return this.postJson<any, void>('auth/logout', {}).pipe(
      tap(() => {
        this.tokenService.deleteToken();
        this.applicationDataService.clearApplicationData();
        this.router.navigate(['/login']);
        if (showToast) this.toastService.showSuccess('Odjava uspešna');
      }),
      catchError(err => {
        this.tokenService.deleteToken();
        this.applicationDataService.clearApplicationData();
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  public unauthorizedHandler(): void {
    this.tokenService.deleteToken();
    this.router.navigate(['/login']);
  }

  public forgotPassword(forgorPasswordDto: ForgotPasswordDto): Observable<any> {
    return this.postJson<ForgotPasswordDto, any>(`auth/forgotPassword`, forgorPasswordDto);
  }

  public resetPassword(resetPasswordDto: ResetPasswordDto): Observable<JwtTokenResponse> {
    return this.postJson<ResetPasswordDto, JwtTokenResponse>(`auth/resetPassword`, resetPasswordDto);
  }
}

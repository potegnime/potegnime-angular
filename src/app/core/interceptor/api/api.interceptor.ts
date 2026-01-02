import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, switchMap, catchError, filter, take } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { AuthService } from '@features/auth/services/auth/auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    let clonedRequest = request.clone({
      withCredentials: true,
      headers: token ? request.headers.set('Authorization', `Bearer ${token}`) : request.headers
    });

    return next.handle(clonedRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) return this.handle401(clonedRequest, next);
        return throwError(() => err);
      })
    );
  }

  private handle401(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/auth/refresh')) {
      const error = new HttpErrorResponse({
        error: 'Refresh token invalid or expired',
        status: 401,
        statusText: 'Unauthorized'
      });
      return throwError(() => error);
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;

          if (!res || !res.accessToken) {
            this.authService.unauthorizedHandler();
            const error = new HttpErrorResponse({
              error: 'Failed to refresh token',
              status: 401,
              statusText: 'Unauthorized'
            });
            return throwError(() => error);
          }

          this.tokenService.setToken(res.accessToken);
          this.refreshTokenSubject.next(res.accessToken);

          const retryReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${res.accessToken}`)
          });
          return next.handle(retryReq);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.unauthorizedHandler();
          if (err instanceof HttpErrorResponse) {
            return throwError(() => err);
          }
          const error = new HttpErrorResponse({
            error: err.message || 'Unauthorized',
            status: 401,
            statusText: 'Unauthorized'
          });
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          const retryReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token!}`)
          });
          return next.handle(retryReq);
        })
      );
    }
  }
}

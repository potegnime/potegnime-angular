import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService);
  private readonly userSubscription = this.tokenService.user$;
  private token: string | undefined;

  constructor() {
    this.userSubscription.subscribe(user => {
      this.token = this.tokenService.getToken();
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${this.token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}

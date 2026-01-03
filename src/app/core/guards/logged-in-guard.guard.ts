import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  canActivate() {
    const tokenExists = this.tokenService.tokenExists();
    if (tokenExists) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}

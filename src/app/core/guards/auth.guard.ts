import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  canActivate() {
    const tokenExists = this.tokenService.tokenExists();
    if (tokenExists) return true;

    this.router.navigate(['/login']);
    return false;
  }
}

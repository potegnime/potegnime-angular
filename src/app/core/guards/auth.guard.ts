import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@features/auth/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate() {
    const tokenExists = this.authService.tokenExists();
    if (tokenExists) return true;

    this.router.navigate(['/login']);
    return false;
  }
}

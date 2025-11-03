import { Injectable, inject } from '@angular/core'
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    canActivate() {
        if (this.authService.verifyToken()) {
            return true;
        } else {
            this.router.navigate(['/prijava']);
            return false;
        }
    }
}

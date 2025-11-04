import { Injectable, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AuthService } from "@features/auth/services/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    canActivate() {
        const isTokenValid = this.authService.verifyToken();
        if (isTokenValid) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
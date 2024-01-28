import { Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate() {
        console.log(`AuthGuard ${this.authService.verifyToken()}`);
        if (this.authService.verifyToken()) {
            return true;
        } else {
            this.router.navigate(['/prijava']);
            return false;
        }
    }
}

import { Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Injectable()
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate() {
        if (this.authService.verifyToken()) {
            return true;
        } else {
            this.router.navigate(['/prijava']);
            return false;
        }
    }
}

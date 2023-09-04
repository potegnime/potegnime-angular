import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of, map, catchError } from 'rxjs';

@Injectable()
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    // return true if logged in with the correct JWT
    return this.authService.verifyToken().pipe(
      map(isValid => {
        if (isValid) {
          console.log('AuthGuard return true');
          // User is logged in
          return true;
        } else {
          console.log('AuthGuard return false');
          // User not logged in, redirect to login page
          this.router.navigate(['/prijava']);
          return false;
        }
      }),
      catchError(() => {
        console.log('AuthGuard catchError return false');
        // User not logged in, redirect to login page
        this.router.navigate(['/prijava']);
        return of(false); // Handle errors by allowing access to the /login route.
      })
    );
  }
}

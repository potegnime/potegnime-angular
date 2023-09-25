import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of, map, catchError } from 'rxjs';

@Injectable()
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/prijava']);
      return false
    };
    
    // return true if logged in with the correct JWT
    return this.authService.verifyToken().pipe(
      map(isValid => {
        if (isValid) {;
          // User is logged in
          return true;
        } else {
          // User not logged in, redirect to login page
          this.router.navigate(['/prijava']);
          return false;
        }
      }),
      catchError(() => {
        // User not logged in, redirect to login page
        this.router.navigate(['/prijava']);
        return of(false); // Handle errors by allowing access to the /login route.
      })
    );
  }
}

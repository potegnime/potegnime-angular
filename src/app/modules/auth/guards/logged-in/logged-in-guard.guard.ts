import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { map, catchError, of } from "rxjs";

@Injectable()
export class LoggedInAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    // return false if logged in with the correct JWT
    return this.authService.verifyToken().pipe(
      map(isValid => {
        if (isValid) {
          console.log('LoggedInAuthGuard return false');
          // User is logged in, don't allow access to the auth routes
          this.router.navigate(['/']);
          return false;
        } else {
          console.log('LoggedInAuthGuard return true');
          // User not logged in, allow access to the auth routes
          return true;
        }
      }),
      catchError(() => {
        console.log('LoggedInAuthGuard catchError return true');
        // User not logged in, allow access to the auth routes
        return of(true);
      })
    );
  }
}
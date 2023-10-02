import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { map, catchError, of } from "rxjs";

@Injectable()
export class LoggedInAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.verifyToken()) {
      // User is logged in, don't allow access to the auth routes
      this.router.navigate(['/']);
      return false;
    } else {
      // User is not logged in, allow access to the auth routes
      return true;
    }
  }
}
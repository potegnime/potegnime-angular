// this is guard, that get its isLoggedIn from auth service 
// auth service checks for JWT and sends it to backend to verify if JWT is valid

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isLoggedIn: boolean = false;

  constructor(private router: Router, authService: AuthService) { }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn) return true
    else {
      this.router.navigate(['/prijava']);
      return false;
    }
  }
}

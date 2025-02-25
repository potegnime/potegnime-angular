import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service/auth.service';

@Component({
  selector: 'app-license-page',
  templateUrl: './license-page.component.html',
  styleUrls: ['./license-page.component.scss']
})
export class LicensePageComponent {
  protected isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService) {

    // Route handling for auth
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.verifyToken();
      }
    });
  }
}

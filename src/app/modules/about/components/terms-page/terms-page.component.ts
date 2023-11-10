import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss']
})
export class TermsPageComponent {
  protected isLoggedIn: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService) 
  {
    
    // Route handling for auth
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.verifyToken();
      }
    });
}
}

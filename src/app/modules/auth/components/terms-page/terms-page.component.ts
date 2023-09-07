import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss']
})
export class TermsPageComponent {
  protected isLoggedIn: boolean = false;

  constructor(
    private httpClient: HttpClient, 
    private router: Router, 
    private authService: AuthService) 
  {
    
    // Route handling for auth
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authService.verifyToken().subscribe(
          (isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
          }
        );
      }
    });
}
}

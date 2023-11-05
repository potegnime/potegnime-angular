import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Route, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth/auth.service';
import { DefinedRoutes } from './modules/shared/enums/routes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'potegni.ga';
  routes: Route[];
  currentPath: string = new URL(window.location.href).pathname;

  public isLoggedIn: boolean = false;
  public error: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService) 
  {
    // Route handling for auth
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.verifyToken();
        if (!this.isLoggedIn) {
          this.authService.logout();
        }
      }
    });
    
    // Route handling for 404 error
    this.routes = this.router.config;
    this.checkCurrentUrlInRoutes();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentUrlInRoutes();
      });
  }

  checkCurrentUrlInRoutes() {
    // Check for 404 error
    this.currentPath = new URL(window.location.href).pathname.slice(1);
    if (DefinedRoutes.includes(this.currentPath)) {
      this.error = false;
    } else {
      this.error = true;
    }
  }

}

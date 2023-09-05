import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Route, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth/auth.service';
import { UserModel as User } from './modules/auth/models/user/user.model';
import { HttpClient } from '@angular/common/http';
import { DefinedRoutes } from './modules/shared/enums/routes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '114.si';
  routes: Route[];
  currentPath: string = new URL(window.location.href).pathname;

  public isLoggedIn: boolean = false;
  public error: boolean = false;

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
    
    // Route handling for 404 error
    this.routes = this.router.config;
    this.checkCurrentUrlInRoutes();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentUrlInRoutes();
      });
  }

  // Handle JWT header
  ping() {
    this.httpClient.get("http://example.com/api/things").subscribe(
    );
  }

  checkCurrentUrlInRoutes() {
    // Check for 404 error
    this.currentPath = new URL(window.location.href).pathname.slice(1);
    console.log(this.currentPath)
    if (DefinedRoutes.includes(this.currentPath)) {
      this.error = false;
    } else {
      this.error = true;
    }
  }

}

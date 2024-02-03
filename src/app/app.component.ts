import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Route, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth.service';
import { DefinedRoutes } from './modules/shared/enums/routes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'potegni.ga';
  currentPath: string = new URL(window.location.href).pathname;

  public isLoggedIn: boolean = false;
  public error: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService) 
  {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // auth
        this.isLoggedIn = this.authService.verifyToken();

        // 404
        this.checkCurrentUrlInRoutes();
      })
  }

  private checkCurrentUrlInRoutes() {
    // Check for 404 error
    this.currentPath = new URL(window.location.href).pathname.slice(1);
    if (DefinedRoutes.includes(this.currentPath)) {
      this.error = false;
    } else {
      this.error = true;
    }
  }

}

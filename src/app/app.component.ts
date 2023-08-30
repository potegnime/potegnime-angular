import { Component } from '@angular/core';
import { Router, Route, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth/auth.service';
import { UserModel as User } from './modules/auth/models/user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '114.si';
  user: User = new User();
  routes!: Route[];
  currentPath!: string;

  public isLoggedIn: boolean = true;
  public error: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.routes = this.router.config;
    this.currentPath = new URL(window.location.href).pathname.slice(1);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.currentPath = new URL(window.location.href).pathname.slice(1);
      this.checkCurrentUrlInRoutes()
    });
  }
  checkCurrentUrlInRoutes() {
    if (this.routes.some(route => route.path === this.currentPath)) this.error = false;
    else this.error = true;
  }

  register(user: User) {
    this.authService.register(user).subscribe();
  }

  login(user: User) {
    this.authService.register(user).subscribe(
      (token: string) => {
        localStorage.setItem('token', token);
      }
    );
  }
}

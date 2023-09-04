import { Component } from '@angular/core';
import { Router, Route, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth/auth.service';
import { UserModel as User } from './modules/auth/models/user/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '114.si';
  routes!: Route[];
  currentPath!: string;

  public isLoggedIn: boolean = false;
  public error: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  // Handle JWT header
  ping() {
    this.httpClient.get("http://example.com/api/things").subscribe(
      (data) => console.log(data),
      (err) => console.log(err)
    );
  }

  ngOnInit() {
    // Check if user is logged in

    // Check for error routes
    this.routes = this.router.config;
    this.currentPath = new URL(window.location.href).pathname.slice(1);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.currentPath = new URL(window.location.href).pathname.slice(1);
      this.checkCurrentUrlInRoutes()
    });
  }

  checkCurrentUrlInRoutes() {
    // Check for 404 error
    if (this.routes.some(route => route.path === this.currentPath)) this.error = false;
    else this.error = true;
  }

  // register(user: User) {
  //   this.authService.register(user).subscribe();
  // }

  // login(user: User) {
  //   this.authService.register(user).subscribe(
  //     (token: string) => {
  //       localStorage.setItem('token', token);
  //     }
  //   );
  // }
}

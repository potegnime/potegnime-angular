import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth-service/auth.service';
import { DefinedRoutes } from './modules/shared/enums/routes.enum';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
    title = 'potegni.me';
    currentPath: string = new URL(window.location.href).pathname;

    public isLoggedIn: boolean = false;
    public error: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.isLoggedIn = this.authService.verifyToken();
                this.checkCurrentUrlInRoutes();
            })
    }

    private checkCurrentUrlInRoutes() {
        this.currentPath = new URL(window.location.href).pathname.slice(1);
        if (DefinedRoutes.includes(this.currentPath)) {
            this.error = false;
        } else {
            this.error = true;
        }
    }

}

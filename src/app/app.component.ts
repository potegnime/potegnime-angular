import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './modules/auth/services/auth-service/auth.service';
import { DefinedRoutes } from './modules/shared/enums/routes.enum';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NgClass } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [HeaderComponent, FooterComponent, RouterOutlet, NgClass, ToastrModule],
    standalone: true
})
export class AppComponent {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    title = 'potegni.me';
    currentPath: string = new URL(window.location.href).pathname;

    public isLoggedIn: boolean = false;
    public error: boolean = false;

    constructor() {
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

import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { filter } from 'rxjs/operators';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { HeaderComponent } from '@layout/header/header.component';
import { FooterComponent } from '@layout/footer/footer.component';
import { underMaintenance } from 'src/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, FooterComponent, RouterOutlet, NgClass],
  standalone: true
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public isLoggedIn: boolean = false;

  constructor() {
    // isLoggedIn check must be synchronous for ngClass to work properly - some weird UI glitch otherwise
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isLoggedIn = this.authService.tokenExists();
    });

    if (underMaintenance) {
      this.authService.logout(false);
      this.router.navigate(['/maintenance']);
    }
  }
}

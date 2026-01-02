import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { TokenService } from '@core/services/token/token.service';
import { HeaderComponent } from '@layout/header/header.component';
import { FooterComponent } from '@layout/footer/footer.component';
import { underMaintenance } from 'src/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, FooterComponent, RouterOutlet, NgClass],
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  public isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor() {
    if (underMaintenance) {
      this.authService.logout(false).subscribe();
      this.router.navigate(['/maintenance']);
    }
  }

  ngOnInit() {
    this.userSubscription = this.tokenService.user$.subscribe((user) => {
      this.isLoggedIn = user !== undefined;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}

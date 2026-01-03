import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class TermsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  protected isLoggedIn: boolean = false;

  public ngOnInit(): void {
    // Route handling for auth
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.tokenService.tokenExists();
      }
    });
  }
}

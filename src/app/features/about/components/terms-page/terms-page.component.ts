import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Component({
    selector: 'app-terms-page',
    templateUrl: './terms-page.component.html',
    styleUrls: ['./terms-page.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class TermsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected isLoggedIn: boolean = false;

  public ngOnInit(): void {
    // Route handling for auth
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.verifyToken();
      }
    })
  }
}

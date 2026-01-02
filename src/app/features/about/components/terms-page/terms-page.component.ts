import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class TermsPageComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService);

  protected isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  public ngOnInit(): void {
    this.userSubscription = this.tokenService.user$.subscribe((user) => {
      this.isLoggedIn = user !== undefined;
    });
  }

  public ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class AboutPageComponent implements OnInit, OnDestroy {
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

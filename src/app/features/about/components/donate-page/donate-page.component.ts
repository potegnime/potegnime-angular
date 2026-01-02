import { Component, OnInit, inject, OnDestroy } from '@angular/core';

import { TokenService } from '@core/services/token/token.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '@core/services/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class DonatePageComponent implements OnInit, OnDestroy {
  private readonly toastService = inject(ToastService);
  private readonly tokenService = inject(TokenService);

  protected isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;
  protected walletAddresses = {
    btc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    eth: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ltc: 'cccccccccccccccccccccccccccccccccccccccc',
    xmr: 'dddddddddddddddddddddddddddddddddddddddd'
  };

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

  protected copyAddress(key: 'btc' | 'eth' | 'ltc' | 'xmr'): void {
    const address: string = this.walletAddresses[key];
    navigator.clipboard.writeText(address);
    this.toastService.showSuccess(`${key.toUpperCase()} naslov kopiran`);
  }
}

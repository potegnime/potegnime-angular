import { Component, OnInit, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ToastService } from '@core/services/toast/toast.service';
import { TokenService } from '@core/services/token/token.service';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class DonatePageComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly tokenService = inject(TokenService);

  protected isLoggedIn: boolean = false;
  protected walletAddresses = {
    btc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    eth: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ltc: 'cccccccccccccccccccccccccccccccccccccccc',
    xmr: 'dddddddddddddddddddddddddddddddddddddddd'
  };

  public ngOnInit(): void {
    this.isLoggedIn = this.tokenService.tokenExists();
  }

  protected copyAddress(key: 'btc' | 'eth' | 'ltc' | 'xmr'): void {
    const address: string = this.walletAddresses[key];
    navigator.clipboard.writeText(address);
    this.toastService.showSuccess(`${key.toUpperCase()} naslov kopiran`);
  }
}

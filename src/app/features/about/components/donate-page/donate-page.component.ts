import { Component, OnInit, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { timingConst } from '@core/enums/toastr-timing.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class DonatePageComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  protected isLoggedIn: boolean = false;
  protected walletAddresses = {
    btc: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    eth: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ltc: 'cccccccccccccccccccccccccccccccccccccccc',
    xmr: 'dddddddddddddddddddddddddddddddddddddddd'
  };

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.verifyToken();
  }

  protected copyAddress(key: 'btc' | 'eth' | 'ltc' | 'xmr'): void {
    const address: string = this.walletAddresses[key];
    navigator.clipboard.writeText(address);
    this.toastr.success('', `${key.toUpperCase()} naslov kopiran`, {
      timeOut: timingConst.success
    });
  }
}

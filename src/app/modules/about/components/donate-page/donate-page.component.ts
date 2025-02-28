import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss']
})
export class DonatePageComponent {
  protected isLoggedIn: boolean = false;
  protected walletAddresses = {
    'btc': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'eth': 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'ltc': 'cccccccccccccccccccccccccccccccccccccccc',
    'xmr': 'dddddddddddddddddddddddddddddddddddddddd'
  }

  constructor(
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.verifyToken();
  }

  protected copyAddress(key: 'btc' | 'eth' | 'ltc' | 'xmr'): void {
    const address: string = this.walletAddresses[key];
    navigator.clipboard.writeText(address);
    this.toastr.success('', `${key.toUpperCase()} naslov kopiran`, { timeOut: timingConst.success });
  }
}

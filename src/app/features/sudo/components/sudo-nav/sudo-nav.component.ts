import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserService } from '@features/user/services/user/user.service';
import { TokenService } from '@core/services/token-service/token.service';
import { UserModel } from '@models/user.interface';


@Component({
  selector: 'app-sudo-nav',
  templateUrl: './sudo-nav.component.html',
  styleUrls: ['./sudo-nav.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class SudoNavComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly tokenService = inject(TokenService);

  protected user: UserModel | undefined;
  protected isAdmin: boolean = false;
  protected isUploader: boolean = false;

  private userSubscription = new Subscription();

  public ngOnInit(): void {
    this.userSubscription = this.tokenService.user$.subscribe(user => {
      this.user = user;
    });

    if (!this.user) {
      this.authService.logout();
    }
    this.isAdmin = this.userService.isAdminLogged();
    this.isUploader = this.userService.isUploaderLogged();
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  protected logout() {
    this.authService.logout();
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { TokenService } from '@core/services/token/token.service';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserService } from '@features/user/services/user/user.service';
import { UserModel } from '@models/user.interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class FooterComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected user: UserModel | undefined;
  protected isAdmin: boolean = false;

  private userSubscription = new Subscription();

  public ngOnInit(): void {
    this.userSubscription = this.tokenService.user$.subscribe(user => {
      this.user = user;
    });

    this.isAdmin = this.userService.isAdminLogged();
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  protected exploreClick(section: string | null) {
    if (!section) {
      this.router.navigate(['/explore']);
    }
    let queryParams = {
      s: section
    };
    this.router.navigate(['/explore'], { queryParams: queryParams });
  }

  protected logout() {
    this.authService.logout();
  }
}

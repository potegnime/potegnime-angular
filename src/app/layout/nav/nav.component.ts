import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserModel } from '@models/user.interface';
import { CacheService } from '@core/services/cache/cache.service';
import { UserService } from '@features/user/services/user/user.service';
import { APP_CONSTANTS } from '@constants/constants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class NavComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cacheService = inject(CacheService);

  protected user: UserModel | null = null;
  protected profilePictureUrl: string = APP_CONSTANTS.DEFAULT_PFP_PATH;
  protected notificationCount: number = 10;

  public ngOnInit(): void {
    this.user = this.userService.getUserInfoFromToken();

    this.userService.getUserPfp(this.user.username).subscribe({
      next: (blob) => {
        this.profilePictureUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
      }
    });
  }

  protected get notificationCountUi(): string {
    return this.notificationCount > 9 ? '9+' : this.notificationCount.toString();
  }

  protected exploreClick(section: string | null) {
    if (!section) {
      this.router.navigate(['/razisci']);
    }
    let queryParams = {
      s: section
    };
    this.router.navigate(['/razisci'], { queryParams: queryParams });
  }

  protected removeNotification(event: Event, notificationId: number) {
    /**
     * TODO
     * Remove notification from database
     * Handle notification count (better?)
     */
    event.stopPropagation();
    this.notificationCount--;
  }

  protected logout() {
    this.authService.logout();
  }
}

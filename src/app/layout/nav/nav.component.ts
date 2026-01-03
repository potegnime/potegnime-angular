import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserModel } from '@models/user.interface';
import { APP_CONSTANTS } from '@constants/constants';
import { UserService } from '@features/user/services/user/user.service';
import { ApplicationDataService } from '@core/services/application-data/application-data.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly applicationDataService = inject(ApplicationDataService);
  private readonly router = inject(Router);

  protected user: UserModel | undefined;
  protected profilePictureUrl: string = APP_CONSTANTS.DEFAULT_PFP_PATH;
  protected notificationCount: number = 10;

  private userSubscription = new Subscription();

  public ngOnInit(): void {
    this.userSubscription = this.applicationDataService.user$.subscribe(user => {
      this.user = user;

      if (this.user?.hasPfp) {
        this.profilePictureUrl = this.userService.buildPfpUrl(this.user.username);
      } else {
        this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
      }
    });
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  protected get notificationCountUi(): string {
    return this.notificationCount > 9 ? '9+' : this.notificationCount.toString();
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
    this.authService.logout().subscribe();
  }
}

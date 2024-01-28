import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  protected uid: number | null;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
    this.uid = userService.getLoggedUserId();
    if (!this.uid) {
      this.authService.logout();
    }
  }

  protected logout() {
    this.authService.logout();
  }
}

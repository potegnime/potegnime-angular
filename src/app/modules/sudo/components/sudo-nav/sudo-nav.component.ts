import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';

@Component({
  selector: 'app-sudo-nav',
  templateUrl: './sudo-nav.component.html',
  styleUrls: ['./sudo-nav.component.scss']
})
export class SudoNavComponent {
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

  public logout() {
    this.authService.logout();
  }
}

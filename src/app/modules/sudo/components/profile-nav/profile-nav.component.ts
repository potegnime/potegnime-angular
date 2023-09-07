import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.scss']
})
export class ProfileNavComponent {

  constructor(
    private readonly authService: AuthService
  ) { }

  public logout() {
    this.authService.logout();
  }
}

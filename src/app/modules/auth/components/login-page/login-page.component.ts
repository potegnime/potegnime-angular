import { Component } from '@angular/core';
import { UserLoginDto } from '../../models/user/user-login-dto.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService
  ) { }

  protected loginPost(user: UserLoginDto) {
    this.authService.login(user).subscribe(
      (res) => {
        localStorage.setItem('token', res);
      },
      (err) => {

      });
  };
}

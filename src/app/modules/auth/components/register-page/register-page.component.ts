import { Component } from '@angular/core';
import { UserRegisterDto } from '../../models/user/user-register-dto.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  userRegisterDto: UserRegisterDto = {
    email: '',
    username: '',
    password: '',
  };
  
  onSubmit() {
    this.authService.register(this.userRegisterDto).subscribe(
      (tokenResp) => {
        // Register successful
        localStorage.setItem('token', tokenResp);
        this.router.navigate(['/']);
      },
      (error) => {
        // Handle the failed login response here.
      }
    );
  }

}

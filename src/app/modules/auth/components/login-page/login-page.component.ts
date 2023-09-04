import { Component } from '@angular/core';
import { UserLoginDto } from '../../models/user/user-login-dto.model';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  userLoginDto: UserLoginDto = {
    username: '',
    password: '',
  };

  
  onSubmit() {
    this.authService.login(this.userLoginDto).subscribe(
      (tokenResp) => {
        // Login successful
        localStorage.setItem('token', tokenResp);
        this.router.navigate(['/']);
      },
      (error) => {
        // Handle the failed login response here.
      }
    );
  }
  
  
  // onSubmit() {
  //   try {
  //     this.authService.login(this.userLoginDto).subscribe(
  //       (tokenResp) => {
  //         console.log('Login successful:', tokenResp);
  //         // Handle the successful login response here, e.g., store the token.
  //       }
  //     );
  //   } catch (error) {
  //     console.log('Login failed:', error);
  //     // Handle the failed login response here.
  //   }

  // }

}

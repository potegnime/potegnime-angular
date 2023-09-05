import { Component, ElementRef, ViewChild } from '@angular/core';
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
      (resp) => {
        console.log('Login successful');
        // Login successful
        localStorage.setItem('token', resp);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log('Login failed');

        const el = document.getElementById('login-error');
        // Handle the failed login response here.
      }
    );
    
  }
}

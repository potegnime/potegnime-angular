import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserLoginDto } from '../../models/user/user-login-dto.model';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  userLoginDto: UserLoginDto = {
    username: '',
    password: '',
  };

  protected showLoginError = false;

  onSubmit() {
    this.authService.login(this.userLoginDto).subscribe({
      next: (resp) => {
        // Login successful
        if (resp.token) {
          // Toast login successful
          this.toastr.success('Prijava uspešna!');
          
          // Save token and redirect
          localStorage.setItem('token', resp.token);
          this.router.navigate(['/']);
        } else {
          this.toastr.error('Naša ekipa napako že odpravlja!', 'Napaka na strežniku');
        }
      },
      error: (err) => {
        // Login failed
        if (err.status === 401) {
          // Expected login failure, show login error message
          this.showLoginError = true;
        } else {
          // Unexpected error, show toast
          this.toastr.error('Naša ekipa napako že odpravlja!', 'Napaka na strežniku');
        }
      },
    });
  }
}

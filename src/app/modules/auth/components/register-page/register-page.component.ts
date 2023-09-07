import { Component, OnInit } from '@angular/core';
import { UserRegisterDto } from '../../models/user/user-register-dto.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  registerForm?: FormGroup;

  userRegisterDto: UserRegisterDto = {
    email: '',
    username: '',
    password: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
      this.registerForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      username: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(8)],
    });
  }

  // Backend error messages
  protected backendError: boolean= false;
  protected backendErrorMessage: string = '';

  // Frontend validation error
  protected frontendError: boolean = false;
  protected frontendErrorMessage: string = '';

  onSubmit() {
    // Basic validation before sending request
    // Check if all fields are filled
    console.log(this.userRegisterDto);
    if (!this.userRegisterDto.email || !this.userRegisterDto.username || !this.userRegisterDto.password) {
      this.frontendError = true;
      this.frontendErrorMessage = 'Izpolnite vsa polja!';
      return;
    }
    // Check if email is valid


    // Send request
    this.authService.register(this.userRegisterDto).subscribe({
      next: (resp) => {
        // Register successful
        if (resp.token) {
          // Toast register successful
          this.toastr.success('Registracija uspešna!');
          
          // Save token and redirect
          localStorage.setItem('token', resp.token);
          this.router.navigate(['/']);
        } else {
          this.toastr.error('Naša ekipa napako že odpravlja!', 'Napaka na strežniku');
        }
      },
      error: (err) => {
        // Login failed
        if (err.status === 409) {
          // User with this email or username already exists
          this.backendError = true;
          this.backendErrorMessage = err.error.message;
        } else if (err.status === 400) {
          // Fields missing errror
          this.backendError = true;
          this.backendErrorMessage = err.error.message;
        } else {
          // Unexpected error, show toast
          this.toastr.error('Naša ekipa napako že odpravlja!', 'Napaka na strežniku');
        }
      },
    });
  }

}

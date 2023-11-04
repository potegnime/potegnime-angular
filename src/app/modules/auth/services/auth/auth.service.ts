import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map  } from 'rxjs';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';
import { UserRegisterDto } from '../../models/user/user-register-dto.model';
import { UserLoginDto } from '../../models/user/user-login-dto.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtHelper: JwtHelperService,
    private readonly toastr: ToastrService,
    private readonly tokenService: TokenService
  ) { }

  public register(userRegisterDto: UserRegisterDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${urlConst.apiBase}/auth/register`, userRegisterDto, { headers: headers })
    .pipe(
      map((response: any) => {
        return response;
      })    
    );
  };

  public login(userLoginDto: UserLoginDto): Observable<any> {
    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${urlConst.apiBase}/auth/login`, userLoginDto, { headers: headers })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  };

  public logout(): void {
    this.tokenService.deleteToken();
    this.router.navigate(['/prijava']);
  }

  public unauthorizedHandler(): void {
    this.logout();
  }

  public verifyToken(): boolean {
    // Check if token exists
    const token = this.tokenService.getToken();
    if (!token) {
      return false;
    }

    // Check token expiration
    if (this.jwtHelper.isTokenExpired(token)) {
      return false;
    }

    return true;
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, map, throwError  } from 'rxjs';
import { UserModel as User } from '../../models/user/user.model';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';
import { UserRegisterDto } from '../../models/user/user-register-dto.model';
import { UserLoginDto } from '../../models/user/user-login-dto.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtHelper: JwtHelperService
  ) { }

  public register(user: UserRegisterDto): Observable<string> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    return this.http.post<string>(`${urlConst.apiBase}/auth/register`, user, httpOptions);
  };

  public login(userLoginDto: UserLoginDto): Observable<string> {
    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<string>(`${urlConst.apiBase}/auth/login`, userLoginDto, { headers: headers })
      .pipe(
        map((response: any) => {
          return response.token;
        }),
        catchError(() => {
          return throwError(() => new Error('Login failed'));
        })
      );
  };

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/prijava']);
  }

  public verifyToken(): Observable<boolean> {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }

    // Set headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Check token expiration
    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        return of(false);
      }  
    } catch (err) {}
 
    // Send request to check if token is valid
    return this.http.get<any>(`${urlConst.apiBase}/auth/verify`, { headers: headers } )
      .pipe(
        map(() => true),
        catchError(() => {
          return of(false);
        })
      );
  };

}

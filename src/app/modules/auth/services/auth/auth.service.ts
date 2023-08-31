import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel as User } from '../../models/user/user.model';
import { urlConst } from 'src/app/modules/shared/enums/url.enum';
import { UserRegisterDto } from '../../models/user/user-register-dto.model';
import { UserLoginDto } from '../../models/user/user-login-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  public register(user: UserRegisterDto): Observable<string> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    return this.http.post<string>(`${urlConst.apiBase}/auth/register`, user, httpOptions);
  };

  public login(user: UserLoginDto): Observable<string> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    return this.http.post<string>(`${urlConst.apiBase}/auth/login`, user, httpOptions);
  };

  public isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  };
}

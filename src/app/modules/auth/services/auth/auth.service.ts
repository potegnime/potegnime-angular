import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel as User } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public register(user: User): Observable<string> {
    return this.http.post<any>('http://localhost:3000/api/register', user);
  }

  public login(user: User): Observable<string> {
    return this.http.post<any>('http://localhost:3000/api/register', user, {responseType: 'json'});
  }
}

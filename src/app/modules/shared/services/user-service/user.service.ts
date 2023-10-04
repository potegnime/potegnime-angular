import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { TokenService } from '../token-service/token.service';
import { urlConst } from '../../enums/url.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  private readonly token = this.tokenService.getToken();

  public getUploadedTorrents(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${urlConst.apiBase}/user/uploadedTorrents?userId=${userId}`, {headers: headers}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          this.authService.unauthorizedHandler();
          return;
        }
        return error;
      })
    );
  }

  public getLikedTorrents(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${urlConst.apiBase}/user/likedTorrents?userId=${userId}`, {headers: headers}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          this.authService.unauthorizedHandler();
          return;
        }
        return error;
      })
    );
  }
}

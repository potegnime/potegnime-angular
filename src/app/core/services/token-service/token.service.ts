import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DecodedTokenModel } from '@models/decoded-token.interface';
import { UploaderRequestStatus } from '@core/enums/uploader-request-status.enum';
import { AuthHelper } from '@core/helpers/auth-helper';
import { UserModel } from '@models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private userSubject = new BehaviorSubject<UserModel | undefined>(this.getUserFromToken());
  public user$ = this.userSubject.asObservable();

  public getToken(): string | undefined {
    const token = localStorage.getItem('token');
    return token ? token : undefined;
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.userSubject.next(this.getUserFromToken());
  }

  public updateToken(newToken: string): void {
    localStorage.removeItem('token');
    this.setToken(newToken);
  }

  public deleteToken(): void {
    localStorage.removeItem('token');
    this.userSubject.next(undefined);
  }

  public getUserFromToken(): UserModel | undefined {
    console.log('getUserFromToken called');
    const decodedToken = this.decodeToken();

    if (!decodedToken) return;
    const user: UserModel = {
      username: decodedToken.username,
      email: decodedToken.email,
      role: decodedToken.role,
      joined: decodedToken.joined,
      // uploaderRequestStatus: decodedToken.uploaderRequestStatus,
      pfp: decodedToken.pfp
    };

    console.log('getUserFromToken result:', user);

    return user;
  }

  private decodeToken(): DecodedTokenModel | undefined {
    console.log('decodeToken called');
    const token = this.getToken();
    console.log('Token retrieved:', token);
    if (!token) return;

    const decodedToken = AuthHelper.decodeJWT(token);
    try {
      const formattedToken: DecodedTokenModel = {
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role.toLowerCase(),
        pfp: decodedToken.pfp,
        // uploaderRequestStatus: decodedToken.uploaderRequestStatus.toLowerCase(),
        joined: decodedToken.joined,
        iss: decodedToken.iss,
        aud: decodedToken.aud,
        iat: decodedToken.iat,
        exp: Number(decodedToken.exp)
      };

      // if (decodedToken.uploaderRequestStatus) {
      //   formattedToken.uploaderRequestStatus =
      //     decodedToken.uploaderRequestStatus as UploaderRequestStatus;
      // }

      return formattedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return;
    }
  }
}

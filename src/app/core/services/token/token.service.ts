import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DecodedTokenModel } from '@models/decoded-token.interface';
import { AuthHelper } from '@core/helpers/auth-helper';
import { UserModel } from '@models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private userSubject = new BehaviorSubject<UserModel | undefined>(this.getUserFromToken());
  public user$ = this.userSubject.asObservable();
  private token: string | undefined;

  public getToken(): string | undefined {
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
    this.userSubject.next(this.getUserFromToken());
  }

  public deleteToken(): void {
    this.token = undefined;
    this.userSubject.next(undefined);
  }

  public getUserFromToken(): UserModel | undefined {
    const decodedToken = this.decodeToken();

    if (!decodedToken) return;
    const user: UserModel = {
      username: decodedToken.username,
      email: decodedToken.email,
      role: decodedToken.role,
      joined: decodedToken.joined,
      hasPfp: decodedToken.hasPfp === "true"
    };

    return user;
  }

  private decodeToken(): DecodedTokenModel | undefined {
    const token = this.getToken();
    if (!token) return;

    const decodedToken = AuthHelper.decodeJWT(token);
    try {
      const formattedToken: DecodedTokenModel = {
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role.toLowerCase(),
        hasPfp: decodedToken.hasPfp === "true" ? "true" : "false",
        // uploaderRequestStatus: decodedToken.uploaderRequestStatus.toLowerCase(),
        joined: decodedToken.joined,
        iss: decodedToken.iss,
        aud: decodedToken.aud,
        iat: decodedToken.iat,
        exp: Number(decodedToken.exp)
      };

      return formattedToken;
    } catch (error) {
      return;
    }
  }
}

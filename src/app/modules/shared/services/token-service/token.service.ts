import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { DecodedTokenModel } from '../../models/decoded-token.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return token;
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public deleteToken(): void {
    localStorage.removeItem('token');
  }

  public decodeToken(): DecodedTokenModel | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    // return jwt_decode(token);
    return {
      uid: 1,
      username: 'test',
      email: 'test@example.com',
      role: 'user',
      joined: '',
      iss: 'issuer',
      aud: 'audience',
      iat: 1234567890,
      exp: 1234567890
    };
  }
}

import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public deleteToken(): void {
    localStorage.removeItem('token');
  }

  public decodeToken(): any {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      return jwt_decode(token);
    } catch (e) {
      return null;
    }
    
  }
}

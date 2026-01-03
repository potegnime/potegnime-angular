import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string | undefined;

  public getToken(): string | undefined {
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public deleteToken(): void {
    this.token = undefined;
  }

  public tokenExists(): boolean {
    return this.token !== undefined;
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token-service/token.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
    private readonly tokenService: TokenService
  ) { }

  public getNotifications() {
    // Get notifications
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
  }
}

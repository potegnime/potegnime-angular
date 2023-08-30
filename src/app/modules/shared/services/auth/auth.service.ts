// TODO impliment auth logic - check JWT tokens - backend call to verify
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: boolean = false;
  constructor() { }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit  {
  protected isMyPage: boolean = false;
  protected token: string | null = null;
  protected uid: string | null = null;
  protected username: string | null = null;
  protected role: string | null = null;
  protected joined: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check if user page is my page
    this.token = this.tokenService.getToken();
    const urlUid = this.router.url.split('/')[2];
    if (this.token) {
      const decodedToken = this.tokenService.decodeToken();
      if (decodedToken ) {
        this.uid = decodedToken.uid.toString();
        this.username = decodedToken.username;
        this.role = decodedToken.role;
        this.joined = decodedToken.joined;

        // Check if user page is my page
        this.isMyPage = this.uid === urlUid;
        console.log(this.isMyPage)
      }
    } else {
      // user not logged in - session expired - redirect to login page
      this.authService.unauthorizedHandler();
    }
  }
}

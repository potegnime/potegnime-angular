import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserService } from '@features/user/services/user/user.service';
import { timingConst } from '@core/enums/toastr-timing.enum';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { SudoNavComponent } from '@features/sudo/components/sudo-nav/sudo-nav.component';
import { UserModel } from '@models/user.interface';
import { GetUserModel } from '@models/get-user.interface';
import { APP_CONSTANTS } from '@constants/constants';
import { TokenService } from '@core/services/token/token.service';

// TODO
// Compress pfp (client side?) before uploading to server, or server side (before saving?)

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  imports: [LoadingSpinnerComponent, NgClass, SudoNavComponent, DatePipe],
  standalone: true
})
export class UserPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  protected user: UserModel | undefined;
  protected otherUser: GetUserModel | null = null;
  protected isMyPage: boolean = false;
  protected profilePictureUrl: string = APP_CONSTANTS.DEFAULT_PFP_PATH;
  protected isLoading: boolean = true;

  public get displayUserName(): string | undefined {
    if (this.isMyPage) return this.user?.username;
    else return this.otherUser?.username;
  }

  public get displayJoined(): string | undefined {
    if (this.isMyPage) return this.user?.joined;
    else return this.otherUser?.joined;
  }

  public get displayRole(): string {
    switch (this.user?.role) {
      case 'admin':
        return 'Administrator';
      case 'uploader':
        return 'Nalagatelj';
      default:
        return 'Uporabnik';
    }
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const loggedInUser: UserModel | undefined = this.tokenService.getUserFromToken();
      if (!loggedInUser) {
        this.authService.unauthorizedHandler();
        return;
      }

      const urlUsername: string | null = this.activatedRoute.snapshot.paramMap.get('username');
      this.isMyPage = loggedInUser!.username == urlUsername;
      if (this.isMyPage && urlUsername) {
        this.user = loggedInUser;
         this.setPfp(this.user!);
        this.isLoading = false;
      } else {
        this.getUserData(urlUsername!);
      }
    });
  }

  private getUserData(username: string): void {
    this.userService.getUserByUsername(username).subscribe({
      next: (user: GetUserModel) => {
        this.otherUser = user;
        if (this.otherUser?.hasPfp) this.setPfp(this.otherUser);
        this.isLoading = false;
      },
      error: (error) => {
        switch (error.status) {
          case 404:
            // Redirect to 404 page
            this.router.navigate(['404']);
            break;
          default:
            this.toastr.error('', 'Napaka pri pridobivanju podatkov o uporabniku', {
              timeOut: timingConst.error
            });
            break;
        }
      }
    });
  }

  private setPfp(user: UserModel | GetUserModel): void {
    if (user.hasPfp) {
      this.profilePictureUrl = this.userService.buildPfpUrl(user.username);
    } else {
      this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { UserService } from '@features/user/services/user/user.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { SudoNavComponent } from '@features/sudo/components/sudo-nav/sudo-nav.component';
import { UserModel } from '@models/user.interface';
import { GetUserModel } from '@models/get-user.interface';
import { APP_CONSTANTS } from '@constants/constants';
import { ApplicationDataService } from '@core/services/application-data/application-data.service';

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
  private readonly applicationDataService = inject(ApplicationDataService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

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
    if (this.isMyPage) {
      if (!this.user) return '';
      return this.getRoleString(this.user);
    } else {
      if (!this.otherUser) return '';
      return this.getRoleString(this.otherUser);
    }
  }

  private getRoleString(user: UserModel | GetUserModel): string {
    switch (user.role) {
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
      const loggedInUser: UserModel | undefined = this.applicationDataService.getUser();
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

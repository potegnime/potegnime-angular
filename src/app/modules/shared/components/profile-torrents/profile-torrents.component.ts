import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { TokenService } from '../../services/token-service/token.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DecodedTokenModel } from '../../models/decoded-token.interface';

@Component({
  selector: 'app-profile-torrents',
  templateUrl: './profile-torrents.component.html',
  styleUrls: ['./profile-torrents.component.scss']
})
export class ProfileTorrentsComponent implements OnInit {
  protected canGetTorrents: boolean = true;
  protected canGetLikedTorrents: boolean = true;
  protected canGetUploadedTorrents: boolean = true;
  protected torrentsArray: any[] = [];

  @Input({ required: true })
  torrentType: 'uploaded' | 'liked' | undefined;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const decodedToken: DecodedTokenModel | null = this.tokenService.decodeToken();
    if (!decodedToken) {
      this.authService.logout();
    }
    const userId: number = this.tokenService.decodeToken()?.uid || 0;
    if (userId === 0 || !userId) {
      this.authService.logout();
    }
    if (this.torrentType === 'uploaded') {
      this.userService.getUploadedTorrents(userId).subscribe({
        next: (data) => {
          this.torrentsArray = data;
          this.canGetUploadedTorrents = true;
          this.canGetTorrents = true;
        },
        error: () => {
          this.canGetUploadedTorrents = false;
          this.canGetTorrents = false;
        }
      });
    } else if (this.torrentType === 'liked') {
      this.userService.getLikedTorrents(userId).subscribe({
        next: (data) => {
          this.torrentsArray = data;
          this.canGetLikedTorrents = true;
          this.canGetTorrents = true;
        },
        error: () => {
          this.canGetLikedTorrents = false;
          this.canGetTorrents = false;
        }
      });
    }

  }
}

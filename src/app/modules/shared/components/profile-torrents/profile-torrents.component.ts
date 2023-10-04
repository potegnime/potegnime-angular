import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { TokenService } from '../../services/token-service/token.service';

@Component({
  selector: 'app-profile-torrents',
  templateUrl: './profile-torrents.component.html',
  styleUrls: ['./profile-torrents.component.scss']
})
export class ProfileTorrentsComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  protected torrentsArray: any[] = [];

  @Input({ required: true })
  torrentType: 'uploaded' | 'liked' | undefined;

  ngOnInit(): void {
    const userId = this.tokenService.decodeToken().uid;
    if (this.torrentType === 'uploaded') {
      this.userService.getUploadedTorrents(userId).subscribe({
        next: (data) => {
          this.torrentsArray = data;
        },
        error: (error) => {
          // TODO
          console.log(error);
        }
      });
    } else if (this.torrentType === 'liked') {
      this.userService.getLikedTorrents(userId).subscribe({
        next: (data) => {
          this.torrentsArray = data;
          console.log(this.torrentsArray);
        },
        error: (error) => {
          // TODO
          console.log(error);
        }
      });
    }

  }
}

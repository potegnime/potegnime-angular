import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.scss']
})
export class MyProfilePageComponent implements OnInit {
  protected token: string | null = null;
  constructor(
    private readonly tokenService: TokenService
  ) { }

  ngOnInit(): void {
    console.log(this.tokenService.decodeToken());
  }

  username = 'Lan Lebar';
  role = 'Uploader';
  joined = '2020-01-01';
}

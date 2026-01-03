import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TokenService } from '@core/services/token/token.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  imports: [RouterLink],
  standalone: true
})
export class AboutPageComponent implements OnInit {
  private readonly tokenService = inject(TokenService);

  protected isLoggedIn: boolean = false;

  public ngOnInit(): void {
    this.isLoggedIn = this.tokenService.tokenExists();
  }
}

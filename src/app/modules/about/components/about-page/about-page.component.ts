import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  protected isLoggedIn: boolean = false;

  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.verifyToken();
  }
}
